# 六口探險隊｜麗寶夏日大冒險

純靜態 RWD 行程網站，可直接部署到 GitHub Pages。沒有套件安裝、建置指令、資料庫或後端。

## 本機查看

直接開啟 `index.html` 即可。家庭照片、卡通人物、CSS 與 JavaScript 都在專案內；YouTube 影片縮圖與外部參考連結需要網路。

私人價格頁位於 `private/planner-private.html`，已由 `.gitignore` 排除。它不會出現在公開網站，也不應手動加入 Git。

## 使用 GitHub CLI 建立儲存庫

在 PowerShell 進入此資料夾後執行：

```powershell
git init -b main
git add .
git status
git commit -m "Add Lihpao family trip site"
gh auth status
gh repo create lihpao-family-trip --public --source=. --remote=origin --push
```

`git status` 中不應出現 `private/`。網站含家人照片，公開儲存庫代表任何知道網址的人都可能看到；`robots.txt` 與 `noindex` 只能降低搜尋引擎收錄，不能當作存取控制。

## 啟用 GitHub Pages

專案已包含 `.github/workflows/pages.yml`。建立並推送儲存庫後，用 CLI 啟用 Pages 的 GitHub Actions 模式：

```powershell
$repo = gh repo view --json nameWithOwner --jq .nameWithOwner
gh api --method POST "repos/$repo/pages" -f build_type=workflow
gh workflow run pages.yml
gh run watch
```

部署完成後查看網址：

```powershell
gh api "repos/$repo/pages" --jq .html_url
```

若帳號已為該儲存庫建立過 Pages，`POST` 可能回傳已存在；可直接執行 `gh workflow run pages.yml`。

## 更新網站

```powershell
git add .
git commit -m "Update trip itinerary"
git push
```

推送到 `main` 後會自動重新部署。

## 專案結構

```text
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── images/
│   └── js/app.js
├── private/                 # 本機私人預算，Git 忽略
├── .github/workflows/pages.yml
├── .gitignore
├── .nojekyll
└── robots.txt
```

## 內容維護

- 行程文字：`index.html`
- 色彩與 RWD／列印版：`assets/css/styles.css`
- 倒數、分享、分隊篩選與勾選記憶：`assets/js/app.js`
- 私人價格計算：`private/planner-private.html`

活動時間、適齡限制與票券內容可能變動，出發前應再次核對官方公告。
