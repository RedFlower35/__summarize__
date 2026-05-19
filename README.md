# AI 會議記錄生成與翻譯工具 (Meeting Summarizer)

這是一個精美且高效的 **AI 會議記錄生成與翻譯工具**。本專案採用 **BFF (Backend-for-Frontend)** 架構，結合 **Vite + React 19** 構建流暢的單頁應用 (SPA)，並使用 **Express.js** 建立後端安全代理，將會議逐字稿發送給 Google Gemini 3 Flash 模型進行繁體中文結構化摘要與英文專業翻譯對照。

---

## 🚀 核心技術棧

* **前端 (Frontend)**: React 19, TypeScript, Vite 6
* **樣式與 UI (Styling)**: Tailwind CSS v4, Lucide React (圖示)
* **後端 (Backend)**: Express.js, TypeScript, tsx (開發執行), esbuild (生產打包)
* **AI 整合 (AI / LLM)**: Google Gen AI SDK (`@google/genai` v1.29.0), Gemini 3 Flash (`gemini-3-flash-preview`)

---

## 🛠️ 本地開發與運行步驟

### 1. 環境需求
* **Node.js**: 建議 v18.0.0 以上

### 2. 安裝依賴
在專案根目錄下執行以下指令安裝前端與後端的所有依賴套件：
```bash
npm install
```

### 3. 設定環境變數
將專案根目錄下的 `.env.example` 複製並重新命名為 `.env`，然後填入您的 Google Gemini API 金鑰：
```env
GEMINI_API_KEY=您的_GEMINI_API_KEY
PORT=3000
NODE_ENV=development
```
> 💡 若您尚未取得 Gemini API Key，可以前往 [Google AI Studio](https://aistudio.google.com/) 免費申請。

### 4. 啟動開發伺服器
執行以下指令同時啟動 Express 後端伺服器與 Vite 熱更新前端服務：
```bash
npm run dev
```
啟動成功後，即可在瀏覽器中打開：**`http://localhost:3000`** 進行使用與開發。

---

## 📦 生產環境建置與運行

### 1. 編譯與打包
執行以下指令來打包前端靜態資源與編譯後端的 TypeScript 程式碼：
```bash
npm run build
```
此步驟會執行兩件事：
1. 將前端 React 專案打包至 `dist/` 目錄。
2. 使用 `esbuild` 將後端 `server.ts` 編譯並封裝成單一的 Node.js 檔案 `dist/server.cjs`。

### 2. 在生產環境運行
打包完成後，即可直接啟動生產伺服器：
```bash
npm start
```
伺服器將在您設定的 `PORT`（預設為 3000）上提供服務，並會自動靜態託管 `dist/` 中的前端畫面與處理 API 請求。

---

## ☁️ 部署指南 (Deployment)

由於本專案是一個包含 Express 後端與 React 前端的全端專案，您可以將其部署到任何支援 Node.js 的平台：

### 部署至 Render / Railway / Heroku
1. **關聯 GitHub 儲存庫**。
2. **設定 Build Command (建置指令)**:
   ```bash
   npm install && npm run build
   ```
3. **設定 Start Command (啟動指令)**:
   ```bash
   npm start
   ```
4. **新增環境變數 (Environment Variables)**:
   * `GEMINI_API_KEY`: 您的 Gemini API Key
   * `PORT`: `8080` (或由平台自動分配)
   * `NODE_ENV`: `production`

### 部署至 VPS / 自建伺服器
1. 將專案 Clone 至伺服器。
2. 安裝生產依賴並進行 build：
   ```bash
   npm install --production=false
   npm run build
   ```
3. 使用 `pm2` 等行程管理器守護執行：
   ```bash
   pm2 start dist/server.cjs --name "meeting-summarizer"
   ```
