# Zeen Fang · Academic homepage

方泽恩的中英双语学术主页，默认英文，部署于 **https://zeen-f.github.io/**。

页面外观按 [Koreyoshi01 / Hao Lin 的主页](https://koreyoshi01.github.io/)复现：使用其 MIT 开源主题的原始 CSS、导航和图像预览脚本，个人资料、论文、项目和图片均替换为 Zeen Fang 的内容。

## 更新内容

编辑 `data/profile.json`，修改对应的 `zh` / `en` 文本。主页和简历共用这份数据。图片放在 `assets/images/`。

- 英文主页：`/`
- 中文主页：`/zh/`
- 英文简历：`/cv/`
- 中文简历：`/zh/cv/`

简历页支持打印或另存为 PDF；论文缩略图支持悬停放大和点击查看。

## 本地预览与检查

需要 Node.js 22 或更新版本，无需安装第三方构建依赖。

```sh
npm run dev
```

打开 `http://127.0.0.1:4186`。更新内容后重新运行；构建产物在 `dist/`。

```sh
npm test
```

检查双语页面、站内链接、图片路径、重复锚点和占位/过时文案。

## 发布

向 `main` 推送更新后，GitHub Actions 自动构建和发布。仓库 Settings → Pages 使用 **GitHub Actions**。

这是独立静态站点，没有后台、数据库、访问统计或第三方嵌入请求，不依赖原有个人网站服务。

## 主题来源

- 参考仓库：[Koreyoshi01/Koreyoshi01.github.io](https://github.com/Koreyoshi01/Koreyoshi01.github.io)
- 参考提交：`84e6cc6e941a36b0092e288d4c1256caac6312dc`
- `assets/reference/main.css`：参考站公开的已编译主题样式，保持原样。
- `assets/reference/main.min.js`：参考仓库的导航、侧栏、平滑滚动和 Magnific Popup 代码。
- `assets/site.css` / `assets/site.js`：键盘可访问性、中英入口和附加简历页支持。
- `scripts/template.mjs`：与参考主题匹配的页面结构，读取本人的资料。

上游许可保存在 `LICENSE-AcadHomepage`。不包含参考站作者的个人信息、论文、证件、微信码、Google Analytics 或 Google Scholar 爬取配置。

代码按 MIT 许可开放；照片、个人项目材料、论文图和字体保留各自权利，见 `ASSET_CREDITS.md`。
