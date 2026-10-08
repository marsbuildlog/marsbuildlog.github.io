# Mars Build Log

个人博客:项目构建日志与技术分享 → [https://marsbuildlog.github.io](https://marsbuildlog.github.io)

基于 [Astro](https://astro.build) 构建,部署在 GitHub Pages。

## 本地开发

```bash
pnpm install     # 安装依赖
pnpm dev         # 启动开发服务器 http://localhost:4321
pnpm build       # 构建到 dist/
pnpm preview     # 预览构建产物
```

## 发布新文章

1. 在 `src/content/blog/` 下新建 `my-post.md`:

   ```markdown
   ---
   title: '文章标题'
   description: '一句话摘要'
   pubDate: 2026-10-08
   tags: ['标签']
   ---

   正文……
   ```

2. `pnpm dev` 本地预览确认无误
3. 提交推送到 `main` 分支,GitHub Actions 自动构建部署(约 1 分钟生效)

## 功能

- ✍️ Markdown / MDX 写作
- 🏷️ 标签系统(标签页 + 按标签筛选)
- 📅 按年归档页
- 📡 RSS 订阅(`/rss.xml`)
- 🔍 SEO:sitemap、Open Graph、canonical URL
- 🚀 GitHub Actions 自动部署
