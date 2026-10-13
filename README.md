# 网页动效辞典

[![网页动效辞典介绍图：56 项动效与 UX 规则，支持场景与变体、参数调节、提示词生成和独立收藏](docs/assets/web-motion-dictionary-intro.webp)](docs/assets/web-motion-dictionary-intro.webp)

“弹簧”“视差”“共享元素转场”看过名字，仍然很难判断它们在页面上怎么动。网页动效辞典把这些术语做成可操作的演示：选一个场景，调节参数，比较变化，再把当前选择生成完整提示词。

[打开在线演示](https://motion.capx-ai.com/) · [GitHub 源码](https://github.com/caaaptaintop/web-motion-dictionary)

## 怎么用

从左侧目录进入条目，也可以按名称或编号搜索。1–51项保留“适用场景”和“效果变体”两种选择；52–56项是UX规则，用“选择观察情况”查看对应交互。触发方式的10个编号属于独立章节。

演示上方说明怎样触发、会看到什么。部分效果需要点击、滚动、悬停或拖动，进入条目后不一定自动播放。右侧参数只显示当前分支实际可调的数值，“恢复默认”可回到初始状态。

提示词在参数下方，可以查看和复制完整原文，也可以按当前场景、效果和具体数值生成一段完整提示词，再复制到开发工具中使用。生成在本地完成，不调用外部模型。网站还提供收藏、原文依据和当前演示的“实际技术”说明。

手机端会重新排列目录、演示和参数区域。适用的交互保留点击、键盘聚焦、导航或排序按钮；装饰性的指针跟随会按输入环境适配。

## 内容来源

术语、原文规则和代表性提示词来源于 **Adrian Punk / [@AdrianPunk115](https://x.com/AdrianPunk115)** 的三篇文章：

- [上篇：教你准确描述页面怎么动](https://x.com/adrianpunk115/status/2099485951701721585)
- [中篇：视差滚动、磁吸按钮与鼠标跟随](https://x.com/adrianpunk115/status/2099772129478869309)
- [下篇：组件反馈、布局过渡与页面转场](https://x.com/adrianpunk115/status/2100209733567430964)

本站为独立制作的交互演示，非原作者网站。演示代码、默认数值和具体实现由本项目提供，不代表原作者的实现或背书。

## 本地运行

需要Node.js20.19以上的20.x版本，或Node.js22.12及以上版本，以及npm。在项目目录执行：

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

构建静态站点并预览：

```sh
npm run build
npm run preview -- --host 127.0.0.1
```

构建结果位于 `dist/client/`，构建过程不需要Sites配置或部署凭据。

运行源码完整性、图片资产、提示词、技术映射及场景初始渲染检查：

```sh
npm run check
```

这些检查不等于浏览器交互或真实硬件验收。

## 实现与目录

应用使用React19和Vite6。动效按具体分支使用CSS过渡／关键帧、Web Animations API、requestAnimationFrame、SVG和原生浏览器事件。React主要负责状态与调度。

Three.js与SVGRenderer用于程序化模型、SVG投影及图片帧准备；图片序列播放与实时投影分别标注。部分图标路径使用flubber插值，地图使用d3-geo、topojson-client和world-atlas。依赖列表并不等于某个演示的技术列表，以右侧说明和执行代码为准。

| 目录 | 内容 |
| --- | --- |
| `src/` | 页面、演示、有效参数、技术映射与提示词逻辑 |
| `public/` | 本地图片、模型预览、favicon及素材通知 |
| `scripts/` | 图片资产准备、模型预览生成与构建辅助 |
| `tests/` | 原文完整性、图片资产、提示词与技术映射等检查 |

静态托管时上传 `dist/client/` 的内容，根层应包含 `index.html`、`favicon.svg` 和 `assets/`。页面使用hash导航。现有演示托管在Cloudflare Workers Static Assets。

原生后台标签暂停和真实双指手势仍有未完成的验收；可见按钮的操作测试不能替代真实多指测试。

## 许可

本项目有权授权的原创实现代码和原创技术文档采用 [MIT许可](LICENSE)，著作权标记为 `Copyright (c) 2026 caaaptaintop`。具体范围见 [NOTICE.md](NOTICE.md)。

Adrian Punk的文章、原文提示词及头像保留原有权利，不纳入本项目MIT授权；目前保存的来源记录尚未确认它们随公开仓库再分发的许可。署名和原文链接不构成授权。图标、字形、地图与第三方依赖按各自许可使用，通知见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
