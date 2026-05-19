import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __dirname = typeof __filename !== "undefined"
  ? path.dirname(__filename)
  : path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API endpoint for summarization
  app.post("/api/summarize", async (req, res) => {
    try {
      const { transcript } = req.body;
      if (!transcript) {
        return res.status(400).json({ error: "Missing transcript" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Server configuration error: Missing API Key" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
        你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
        請務必遵守以下輸出格式要求：

        1. **會議主題與時間**：擷取會議的主題與時間。
        2. **與會者**：列出參與會議的人員。
        3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
        4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
        5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

        請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: transcript,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      
      let errorMessage = "伺服器正忙\n請等一下再試\n\n錯誤細節：\n";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }

      const status = error?.status || 500;
      res.status(status).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
