import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(cors());
  app.use(express.json());

  // Setup multer for product images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "status is ok" });
  });

  // Order Confirmation Email API
  app.post("/api/orders/confirm", async (req, res) => {
    const { orderId, userEmail, items, totalAmount } = req.body;

    try {
      const prompt = `Draft a high-end, professional order confirmation email for an electronics store called Solo's Phones & Electronics.
      Order Details:
      Order ID: ${orderId}
      Customer Email: ${userEmail}
      Items: ${JSON.stringify(items)}
      Total Amount: $${totalAmount}

      The email should be enthusiastic, informative, and include a summary of the items. Use a modern "tech" tone.
      Return the email subject and body in JSON format.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const emailContent = JSON.parse(result.text || "{}");
      
      console.log("-----------------------------------------");
      console.log(`SIMULATED EMAIL SENT TO: ${userEmail}`);
      console.log(`SUBJECT: ${emailContent.subject}`);
      console.log(`BODY: ${emailContent.body}`);
      console.log("-----------------------------------------");

      res.json({ success: true, message: "Confirmation email simulated and logged." });
    } catch (error) {
      console.error("Error generating confirmation email:", error);
      res.status(500).json({ success: false, error: "Failed to generate confirmation email" });
    }
  });

  // Example Product API
  app.get("/api/products", (req, res) => {
    res.json([]);
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
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
