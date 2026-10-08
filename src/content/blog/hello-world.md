---
title: '博客上线:为什么选择 Astro + GitHub Pages'
description: '这个博客的第一篇文章:介绍本站的技术选型、目录结构,以及日常发布文章的完整流程。'
pubDate: 2026-10-08
tags: ['astro', 'github-pages', '建站']
---

欢迎来到 MarsBuildLog 👋

这是本站的第一篇文章,记录这个博客是如何搭建的,以及后续如何发布新文章。

## 技术选型

本站基于 **Astro** 构建,部署在 **GitHub Pages** 上,选这套组合的理由:

- **Astro 默认零 JS**:纯静态输出,首屏速度快,对技术博客非常友好
- **Markdown 即文章**:`src/content/blog/` 下放一个 `.md` 文件就是一篇文章
- **GitHub Pages 免费托管**:push 到 `main` 分支自动构建部署,零运维
- **内置 SEO 支持**:sitemap、RSS、Open Graph 都已配置好

## 项目结构

```text
├── astro.config.mjs        # 站点配置(site URL、集成插件)
├── src/
│   ├── content/blog/       # 📝 博客文章(Markdown)
│   ├── components/         # 可复用组件(Header、Tags 等)
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由(首页、标签页、归档页……)
│   ├── styles/             # 全局样式
│   └── consts.ts           # 站点标题、描述等全局常量
└── public/                 # 静态资源(favicon 等)
```

## 如何发布一篇文章

日常写作只需要三步:

### 1. 新建 Markdown 文件

在 `src/content/blog/` 下创建一个文件,例如 `my-new-post.md`:

```markdown
---
title: '文章标题'
description: '一句话摘要,会显示在列表页和 SEO 元信息里'
pubDate: 2026-10-08
tags: ['标签一', '标签二']
---

正文从这里开始,支持标准 Markdown 语法。
```

### 2. 本地预览

```bash
pnpm dev
```

打开 `http://localhost:4321` 即可实时预览。

### 3. 发布

提交并推送到 `main` 分支:

```bash
git add . && git commit -m "post: 新文章" && git push
```

GitHub Actions 会自动构建并部署,大约一分钟后文章就上线了。

## 写在最后

接下来会陆续发布一些项目构建日志和技术实践记录,欢迎通过 [RSS](/rss.xml) 订阅。
