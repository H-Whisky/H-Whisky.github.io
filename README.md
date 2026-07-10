# H-Whisky's Notebook

个人博客 / Personal Blog，基于 [Hexo](https://hexo.io) + [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题构建，托管于 [GitHub Pages](https://h-whisky.github.io)。

## 技术栈

| 层面 | 技术 |
|---|---|
| 静态网站生成器 | Hexo 6.3 |
| 主题 | Butterfly |
| 托管 | GitHub Pages |
| 代码高亮 | highlight.js |
| 图片灯箱 | Fancybox v4 |
| 图标 | Font Awesome 6 |
| 统计 | 不蒜子 (Busuanzi) |
| 加密支持 | hexo-blog-encrypt |

## 目录结构

```
├── index.html              # 首页
├── archives/               # 文章归档（按年/月）
├── tags/                   # 标签聚合页
├── 2023/ / 2024/           # 文章页面（按发布日期）
├── css/
│   ├── index.css           # 主题编译后的样式
│   └── enhance.css         # 前端优化增强样式
├── js/
│   ├── main.js             # 主题核心脚本
│   ├── utils.js            # 工具函数（防抖、节流、动画等）
│   ├── enhance.js          # 前端交互增强脚本
│   └── tw_cn.js            # 简繁中文转换
├── lib/
│   └── hbe.js              # 文章加密解密库
├── img/                    # 图片资源（头像、图标等）
└── fancybox/               # 灯箱插件
```

## 本地预览

```bash
# 启动本地服务器
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 构建与部署

本仓库是 Hexo 生成的静态输出文件。Hexo 源文件（Markdown 文章、`_config.yml` 主题配置等）位于单独的源码仓库中。

部署流程：
```bash
hexo generate   # 生成静态文件
hexo deploy     # 推送到 GitHub Pages
```

## 许可

博客文章版权所有 &copy; 2020-2024 H-Whisky，采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
