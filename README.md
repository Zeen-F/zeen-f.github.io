# Zeen Fang · Academic homepage

方泽恩的中英双语学术主页，部署于 **https://zeen-f.github.io/**。

## 更新内容

编辑 `data/profile.json`，修改对应的 `zh` / `en` 文本。论文图文卡片、论文列表和简历共用一份数据。图片放在 `assets/images/`。

默认英文。页面地址：英文 `/`，中文 `/zh/`，英文简历 `/cv/`，中文简历 `/zh/cv/`。简历页面可以打印或另存为 PDF。

## 本地预览

需要 Node.js 22 或更新版本，无第三方运行依赖。

```sh
npm run dev
```

浏览器打开 `http://127.0.0.1:4186`。更新内容后重新运行；构建产物位于 `dist/`。

```sh
npm test
```

检查双语页面、站内链接、图片路径、重复锚点及过时占位文案。

## 发布

向 `main` 推送更新后，GitHub Actions 自动构建和发布。仓库 Settings → Pages 使用 **GitHub Actions**。

本项目为独立静态站点，没有后台、数据库、远程字体、访问统计或第三方嵌入脚本。它不依赖原有网站服务。

## 来源与使用范围

学术侧栏与栏目组织参考 [WowPage](https://github.com/WD7ang/WowPage)，原许可保存在 `LICENSE-WowPage`；本项目重新实现静态页面生成及双语内容维护。

代码按 MIT 许可开放；人物照片、个人材料不包含在代码的 MIT 授权中。论文图表和字体按各自许可使用，见 `ASSET_CREDITS.md`。个人贡献、团队工作与数值仿真范围在条目中分别说明。
