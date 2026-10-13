# 班级学习看板

一个托管在 GitHub Pages 上的班级学习进度看板，包含 6 个学科（数字电路、模拟电路、复变函数、概率论、计算机原理与嵌入式系统、电磁学）。

功能：

- 各科目进度看板：模拟卷出到第几套、学习指南整理到第几章、已找到哪些资料
- 一键跳转各科学习指南的飞书链接
- 每日自动轮换的励志句子
- 学习委员一人维护，同学只读访问

## 本地预览

页面需要通过 HTTP 访问才能读取数据文件，直接双击 `index.html` 可能看不到内容。请在项目目录下启动一个本地服务器：

```bash
python -m http.server 8000
```

然后浏览器打开 <http://localhost:8000> 即可。

## 部署到 GitHub Pages

1. 把文件推送到你的 GitHub 仓库：

   ```bash
   git add .
   git commit -m "init study board"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. 打开仓库页面 → **Settings** → 左侧 **Pages**。
3. **Source** 选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`，点 **Save**。
4. 约 1 分钟后，访问 `https://你的用户名.github.io/你的仓库名/` 即可看到网站。

> 若你的默认分支是 `master`，上面第 1、3 步的分支相应改为 `master`。

## 如何更新内容

所有看板数据都在 `subjects.json` 中，改完提交后约 1 分钟自动生效。

可以直接在 GitHub 网页上改：打开 `subjects.json` → 点右上角铅笔图标 → 编辑 → **Commit changes**，无需安装任何软件。

### 字段说明

- `className`：网站顶部标题，可改成你们的班级名。
- `semester`：学期信息。
- `updated`：数据更新日期，手动填写，用于展示“数据更新于”。
- `subjects`：学科数组，每个学科包含：
  - `name`：学科名
  - `leader`：领学人姓名，留空则显示“待填写”
  - `mockExam`：`done` 已出套数，`total` 计划总套数，`note` 补充说明
  - `studyGuide`：`done` 已整理章数，`total` 总章数，`note` 补充说明
  - `materials`：资料列表，每条 `{ "title": "名称", "url": "" }`；`url` 留空则只显示文字
  - `feishu`：飞书文档链接；留空则按钮置灰显示“飞书链接待设置”

### 修改励志句子

励志句子在 `script.js` 文件顶部 `QUOTES` 数组中，一行一条，按当天日期自动轮换。增删条目即可。

## 飞书文档分享权限

飞书文档需要把分享权限设为 **“获得链接的人可阅读/可查看”**，否则同学点击链接后打不开。

## 维护权限

- 只有你有仓库写权限，同学只能通过网站地址访问，无法修改内容。
- 以后想邀请其他领学人一起录入，可在仓库 **Settings → Collaborators** 中添加协作者。
## 背景壁纸

- 壁纸图片放在 `pictures` 文件夹，文件路径在 `script.js` 末尾的 `BACKGROUNDS` 数组中维护。
- 建议比例 1920×1080；可随意增删图片，多张时会每 8 秒自动交叉淡入切换，并带有缓慢缩放/平移的“滚动”效果。