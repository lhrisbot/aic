# 部署到 GitHub Pages（含其他静态托管平台）

> 目标：让队友、评委用**一个公网链接**打开前端，不用你的电脑开机、不用装 npm。
> 项目数据全部是 Mock，**纯静态部署即可完整演示**（不需要后端）。

---

## 0. 先理解三个坑（已经在代码里解决，但你该知道原因）

直接在 GitHub Pages 上部署这个项目会踩三个坑，我们都已经处理好了：

| 坑 | 现象 | 本项目如何处理 |
| --- | --- | --- |
| **子路径** | GitHub Pages 项目站点地址是 `https://<用户名>.github.io/<仓库名>/`，资源默认按 `/assets/...` 找 → 全部 404、白屏 | `vite.config.ts` 的 `base` 读取 `VITE_BASE` 环境变量；`npm run build:pages` 会自动带上 `/<仓库名>/` |
| **history 路由深链** | 直接访问或刷新 `/<仓库名>/heritage` → GitHub Pages 没有重写规则 → 404 | 构建脚本把 `index.html` 复制成 `404.html`；Pages 对未知路径返回该文件，SPA 随即接管路由 |
| **Jekyll 忽略下划线文件** | Vite 产物里有 `assets/_plugin-vue_export-helper-*.js`，Jekyll 会跳过下划线开头的文件 → 该文件 404 | 构建脚本生成 `dist/.nojekyll`，让 Pages 完全跳过 Jekyll |

另外还有一处**路由 base**：`src/router/index.ts` 里 `createWebHistory(import.meta.env.BASE_URL)`。
如果不带这个参数，即使资源都加载成功，浏览器地址是 `/<仓库名>/heritage`，路由匹配不到规则，**整站都会落到 404 页**（这个坑已修，本地开发仍是 `/`，不受影响）。

---

## 1. 方式一：GitHub Actions 自动部署（推荐）

仓库里已包含工作流 `.github/workflows/deploy-pages.yml`：推送到 `main` 就自动构建并发布。

1. **创建仓库并推送代码**（若还没做）

   ```bash
   cd "D:\Users\26877\Desktop\aic主题赛"
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

2. **开启 Pages**
   仓库 → `Settings` → `Pages` → `Build and deployment` → **Source 选 `GitHub Actions`**。

3. **等待自动部署**
   `Actions` 标签页会看到 `Deploy web to GitHub Pages` 在跑；完成后 `Settings → Pages` 顶部会显示访问地址，形如：
   `https://<你的用户名>.github.io/<仓库名>/`

工作流会自动把 `${{ github.event.repository.name }}` 作为资源前缀，**仓库改名也能自动适配**，无需手改配置。

> 如果你的仓库是 `<用户名>.github.io` 这种"用户站点"（地址没有子路径），或在 Pages 里绑定了自定义域名：
> 把工作流里的 `PAGES_BASE` 改成 `/` 即可。

---

## 2. 方式二：手动发布（不用 CI）

本地构建后，把 `dist` 推到 `gh-pages` 分支：

```powershell
cd "D:\Users\26877\Desktop\aic主题赛\web"

# 1) 构建（把 <仓库名> 换成你实际的仓库名）
$env:PAGES_BASE='/<仓库名>/'
npm.cmd run build:pages

# 2) 用 gh-pages 工具把 dist 推到 gh-pages 分支（首次会下载该工具）
npx gh-pages -d dist
```

然后仓库 → `Settings` → `Pages` → Source 选 **`Deploy from a branch`** → 分支选 `gh-pages`、目录选 `/ (root)`。

**这样每次改完代码都要重新执行上面两步。** 只是临时给队友看一次的话够用了。

---

## 3. 其他静态托管平台（同样支持）

| 平台 | 做法 | 需要的配置 |
| --- | --- | --- |
| **Cloudflare Pages** | 直接拖拽 `web/dist` 文件夹上传，或连仓库自动构建 | 已备 `web/public/_redirects`（构建时会进 `dist`），SPA 回退自动生效 |
| **Netlify** | 拖拽 `web/dist` 或用 `netlify deploy --dir=dist` | 同上，`_redirects` 生效 |
| **Vercel** | 连仓库部署（已备 `web/vercel.json`：构建命令、输出目录与 rewrites） | 无需额外配置 |

这几个平台给的都是**域名根路径**，所以构建时 `PAGES_BASE` 用默认的 `/` 即可：

```powershell
cd web
npm.cmd run build            # 根路径构建
# 然后把 web/dist 拖到平台上
```

> 只有 GitHub Pages 的项目站点是子路径，需要 `PAGES_BASE`。

---

## 4. 常见问题

**页面白屏 / 控制台一堆 404**
构建时的资源前缀和实际访问路径不一致。检查 `dist/index.html` 里 `src="..."` 是否以 `/<仓库名>/assets/` 开头；GitHub Pages 项目站点必须带仓库名前缀。

**首页能开，点进非遗详情后刷新变 404**
`dist/404.html` 没生成。确认用的是 `npm run build:pages`（普通 `npm run build` 不会生成它）。

**所有页面都显示「这一页似乎未被收录」（404 页）**
`src/router/index.ts` 的 `createWebHistory(import.meta.env.BASE_URL)` 被改成不带参数的写法了，改回去即可。

**队友打开后登录不了**
Mock 账号库在各自浏览器的 `localStorage` 里，首次打开会自动初始化演示账号：
用户名 `非遗创作者`，密码 `yiyun2026`（登录页有一键填入按钮）。

**每人看到的数据不一样**
这是正常的：Mock 数据存在各自浏览器本地，作品库、注册的账号都是"本地的"。演示时不冲突，反而互不干扰。

**GitHub Pages 打不开或很慢**
`github.io` 在国内访问不稳定。给评委演示时建议准备备用链接（Cloudflare Pages/Vercel），或提前录屏；局域网方式见 `README.md` 的"方案 A"。

---

## 5. 上线前的检查清单

- [ ] `npm.cmd run type-check` 通过
- [ ] `npm.cmd run build:pages` 成功，且 `dist/` 下有 `index.html`、`404.html`、`.nojekyll`
- [ ] 用手机/另一台电脑打开公网链接，能进首页
- [ ] 直接访问 `https://<地址>/heritage` 并刷新，不会 404
- [ ] 走一遍演示路径：首页 → 非遗探索 → 详情 → AI 创作 CTA → 登录（演示账号） → 生成并保存 → 视频创作 → 我的作品
- [ ] 页面中不含学校名称、Logo、指导教师信息（提示词要求）
- [ ] 仓库里没有真实 API Key / 令牌（本项目目前全是 Mock，无密钥）

---

## 6. 本项目的实际部署状态（已上线）

| 项 | 值 |
| --- | --- |
| 代码仓库 | https://github.com/lhrisbot/aic （公开，默认分支 `main`） |
| 线上站点 | **https://lhrisbot.github.io/aic/** |
| Pages 源 | `gh-pages` 分支（`build_type: legacy`，即"从分支部署"） |
| 构建前缀 | `/aic/`（仓库名，已写入构建产物） |
| 页面标题实测 | 首页「首页 · 遗韵智创」；`/aic/heritage`「非遗探索 · 遗韵智创」；`/aic/heritage/shadow-puppetry`「皮影戏 · 遗韵智创」 |

### 6.1 更新线上站点（改了代码之后）

```powershell
cd "D:\Users\26877\Desktop\aic主题赛\web"
$env:PAGES_BASE='/aic/'
npm.cmd run build:pages      # 构建（自动带 /aic/ 前缀 + 404.html + .nojekyll）
npx gh-pages -d dist         # 把 dist 推到 gh-pages 分支，1~2 分钟后线上更新
```

改完源码记得先把 `main` 推上去，这样队友能拿到最新代码：

```powershell
cd "D:\Users\26877\Desktop\aic主题赛"
git add -A; git commit -m "描述改动"; git push
```

### 6.2 想让"推送即自动部署"生效（可选）

仓库里的自动部署工作流目前在 `docs/deploy-pages-workflow.yml`，**没有放进 `.github/workflows/`**，原因是：

> 用 OAuth 令牌推送 `.github/workflows/**` 需要令牌具备 `workflow` 权限，
> 当前 `gh` 登录的令牌只有 `gist / read:org / repo`，因此推送被 GitHub 拒绝了。

两种启用方式，任选其一：

**方式 A：网页端粘贴（不用命令行、不用重新授权）**

1. 打开 https://github.com/lhrisbot/aic → `Add file` → `Create new file`
2. 文件名填 `.github/workflows/deploy-pages.yml`
3. 把 `docs/deploy-pages-workflow.yml` 的内容整段粘贴进去 → Commit
4. 仓库 `Settings` → `Pages` → `Source` 改成 **`GitHub Actions`**
5. 之后每次推 `main` 自动构建发布（Actions 标签页可看进度）

**方式 B：给 gh 补授权，然后直接推送**

```powershell
$gh = "$env:LOCALAPPDATA\Programs\gh-portable\bin\gh.exe"
& $gh auth refresh -h github.com -s workflow      # 会再弹一次浏览器授权
mkdir ".github\workflows" -Force
Copy-Item "docs\deploy-pages-workflow.yml" ".github\workflows\deploy-pages.yml"
git add -A; git commit -m "ci: 启用 GitHub Pages 自动部署"; git push
```

### 6.3 本次推送踩过的两个坑（避免重复踩）

1. **workflow 权限**：见 §6.2。若历史提交里已经含有 `.github/workflows/**`，整条分支都会被拒绝推送，
   需要重写历史或用上面的方式 A/B 解决。
2. **默认分支被推成了 `gh-pages`**：先推 `gh-pages` 时 GitHub 会把它设为默认分支，队友 `git clone` 拿到的会是构建产物而不是源码。
   已用 `gh api -X PATCH repos/lhrisbot/aic -f default_branch=main` 修正；
   换仓库时记得推完 `main` 后确认默认分支。
