---
title: 'SheetDo:在浏览器里给 Excel 公式打分 — Astro + Univer 的技术实践'
description: '介绍 SheetDo 这个完全运行在浏览器中的 Excel 练习平台:如何用 Astro SSG、Univer 公式引擎和 React Island 实现零后端成本的公式判题。'
pubDate: 2026-10-09
heroImage: '../../assets/sheetdo-formula-grader-cover.png'
tags: ['astro', 'univer', 'excel', '前端工程']
---

[SheetDo](https://sheetdo.com) 是一个完全在浏览器里运行的 Excel & Google Sheets 练习平台:内置交互式练习题、公式语法指南、快捷键速查表和实用微工具，全部免费、无需注册，进度保存在浏览器本地。

它最有意思的一点是**判题完全在前端完成**——不依赖任何后端沙箱。本文介绍这套「浏览器内公式判题器」的技术实现，原文(英文版)发布在 [SheetDo 官方博客](https://sheetdo.com/blog/building-in-browser-excel-formula-grader/)。

## 为什么不用后端沙箱?

大多数代码判题系统(LeetCode、OJ)的做法是把用户代码扔进后端沙箱执行。但对 Excel 练习来说，这个模型并不合适:

- 你希望用户获得**真实的表格操作体验**(选区、公式栏、单元格引用)
- 希望反馈**即时**(而不是提交后等几百毫秒)
- 希望每次提交的**计算成本为零**

SheetDo 的答案:把整个电子表格引擎搬到浏览器里。

## 技术栈:Astro + Univer

三个核心目标决定了选型:

1. **SEO + 快速首屏**——练习页需要可抓取的静态 HTML 和结构化数据
2. **真实的 Excel 交互**——Canvas 网格、公式栏、单元格引用
3. **零后端计算**——所有重算都在客户端完成

团队也刻意跳过了「自己写公式解析器」:真实 Excel 涉及范围引用、绝对引用、动态数组、混乱的类型隐式转换，而 Univer 的 `@univerjs/engine-formula` 已经把这些都解决了。整体架构如下:

```text
Astro 静态外壳(SEO、文案、JSON-LD、骨架屏)
        │  client:only="react"
        ▼
ExerciseRunner(React Island)
        │
        ├── SheetEditor(Univer 网格 + 公式引擎)
        └── 多用例判题器(注入数据 → 重算 → 对比)
```

## 坑 1:Univer 和 SSR 天生不合

Univer 依赖 `window`、`document` 和 Canvas，Astro 的 SSR 会直接崩溃。解决方案是用 `client:only="react"` 挂载判题组件，同时提供一个 Astro 骨架屏作为 `slot="fallback"`，避免 Island 启动时布局跳动。

Vite 也需要额外调教:Univer 的依赖图很深，开发环境下陈旧的 `optimizeDeps` 缓存曾导致 Island 白屏。最终的方案是在 `astro.config.ts` 中固定完整导入集，并把 `@univerjs/*` 标记为 `ssr.noExternal`。

## 坑 2:锁定表格，但要留给判题器"后门"

学习者看到的是一张完整的电子表格。如果不做锁定，用户可以直接改源数据来"作弊通过"。

做法是用 Univer 事件(`BeforeSheetEditStart`、`BeforeCommandExecute`)取消答案单元格之外的一切编辑，然后为判题器开一个短暂的程序化写入通道:

```ts
async function withEditableSheet(mutate) {
  allowProgrammaticMutateRef.current = true;
  try {
    return await mutate(sheet);
  } finally {
    allowProgrammaticMutateRef.current = false;
  }
}
```

用户碰不了锁定的单元格，判题器却可以自由改写测试用例和应用公式。

## 判题器:多用例 + 防硬编码

只检查一个期望值是不够的——求和题里写死 `=1500` 也能"通过"。点击提交时，SheetDo 会:

1. 要求公式必须以 `=` 开头
2. 可选要求包含指定函数关键字(`XLOOKUP`、`SUM`……)
3. 对每个测试用例:注入单元格数据 → 应用用户的公式 → 等待计算完成 → 对比结果
4. 恢复可见的用例，逐条展示通过/失败

```ts
for (const tc of testCases) {
  await editor.updateCells({ ...baseCells, ...tc.cells });
  const value = await editor.applyFormula(target, formula);
  evaluations.push({ actualValue: value, expectedValue: tc.expectedValue });
}
```

一个容易被忽略的细节:**Univer 的计算是异步的**。`setFormula` 之后必须等待 `onCalculationResultApplied` 事件再读单元格，否则判题读到的是旧值。此外，结果对比容忍浮点误差、货币符号和千分位逗号(`valuesEqual` 使用 `1e-9` 精度)。

## 练习题库的 Headless CI

每道 JSON 练习题都附有官方答案。CI 里用 Vitest 启动一个无 UI 的 Univer(只加载 core + sheets + formula 插件)，把每道题的官方答案跑过所有测试用例，答案一旦"漂移"就挂掉 CI。不需要 Playwright、不需要浏览器，整个题库几秒钟跑完。

## 效果对比

| | 后端沙箱 | 浏览器判题(Astro + Univer) |
| --- | --- | --- |
| 延迟 | 数百毫秒起 | 几十毫秒 |
| 计算成本 | 随提交量增长 | 仅 CDN 费用 |
| 离线 | 弱 | 首次加载后可用 |
| SEO | SPA 折腾 | 静态 HTML |

**几点 takeaway**:

- 重量级电子表格 UI 别进 SSR，用 `client:only` + 骨架屏
- 判题靠"注入用例对比结果"，而不是字符串匹配
- 读结果前永远先等公式引擎算完

可以去 [sheetdo.com](https://sheetdo.com) 亲自体验。