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
| 3D 吉祥物 | Three.js（低多边形 3D 柯基，纯代码建模） |
| AI 助手 | 柯基机器人 + DeepSeek API（访客可自带 Key，内嵌 Key 待配置） |
| 配色 | 柯基暖橙棕（enhance.css v3 覆盖层，可整体回退） |

## 目录结构

```
├── index.html              # 首页（欢迎卡片 + 头条文章 + 文章卡片流）
├── 404.html                # 自定义 404 页
├── archives/               # 文章归档（按年/月）
├── tags/                   # 标签总览页 + 各标签聚合页
├── 2023/ / 2024/           # 文章页面（按发布日期）
├── css/
│   ├── index.css           # 主题编译后的样式
│   ├── enhance.css         # 增强样式（排版/动效/暖橙棕覆盖层 v3）
│   └── chatbot.css         # 柯基聊天面板与 3D 舞台样式
├── js/
│   ├── main.js             # 主题核心脚本
│   ├── utils.js            # 工具函数（防抖、节流、动画等）
│   ├── enhance.js          # 阅读进度条、入场动画、页脚年份等增强
│   ├── chatbot.js          # 柯基聊天机器人（DeepSeek 接入 + 设置面板）
│   ├── corgi3d.js          # Three.js 低多边形 3D 柯基（ES Module）
│   └── tw_cn.js            # 简繁中文转换
├── lib/
│   └── hbe.js              # 文章加密解密库
├── img/                    # 图片资源（头像、文章图等）
└── fancybox/               # 灯箱插件
```

## 当前文章（3 篇）

| 文章 | 日期 | 标签 |
|---|---|---|
| 城市记忆-泰州 | 2024-03-22 | CityMem-Taizhou |
| 学习笔记-PMP | 2024-02-26 | Learn-PMP |
| 城市记忆-南京 | 2023-04-11 | CityMem-Nanjing |

## 本地预览

```bash
# 启动本地服务器
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 构建与部署

本仓库是 Hexo 生成的静态输出文件。Hexo 源文件（Markdown 文章、`_config.yml` 主题配置等）位于单独的源码仓库中。

> 说明：本仓库当前已在 Git 历史中直接维护（首页改版、聊天机器人等均为直接修改静态文件），直接编辑后提交即可生效。若从 Hexo 源工程重新 `hexo generate` 会覆盖这里的直接改动，需注意取舍。

部署流程：
```bash
hexo generate   # 生成静态文件
hexo deploy     # 推送到 GitHub Pages
```

## 许可

博客文章版权所有 &copy; 2020-2026 H-Whisky，采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
