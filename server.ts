import express from "express";
import path from "path";
import multer from "multer";
import { createRequire } from "module";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const upload = multer({ storage: multer.memoryStorage() });

  // API route for parsing PDF
  app.post("/api/parse-pdf", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      let text = "";
      let parseFn = pdfParse;
      if (typeof parseFn !== "function" && parseFn && typeof (parseFn as any).default === "function") {
        parseFn = (parseFn as any).default;
      }

      if (typeof parseFn === "function") {
        const data = await parseFn(req.file.buffer);
        text = data.text;
      } else if (pdfParse && typeof (pdfParse as any).PDFParse === "function") {
        const parser = new (pdfParse as any).PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        text = result.text;
        await parser.destroy();
      } else {
        throw new TypeError(`pdfParse is not a function/class. Resolved type: ${typeof pdfParse}, keys: ${Object.keys(pdfParse || {})}`);
      }
      
      res.json({ text });
    } catch (error: any) {
      console.error("PDF Parse Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong parsing PDF" });
    }
  });

  // API route for AI assistance
  app.post("/api/ai-optimize", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing from environment variables." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI API Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong" });
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
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
