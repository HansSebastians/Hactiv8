import 'dotenv/config';
import express, { response } from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

const app = express();
app.use(cors()); 
app.use(express.json());

const upload = multer();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:3001' 
}));

app.listen(PORT, () => console.log('server ready'));

app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  try {
    if (!Array.isArray(conversation)) {
      throw new Error('Harus array');
    }

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const aiResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        maxOutputTokens: 400,
  systemInstruction: "Pakai bahasa indonesia dalam memberikan respon. Berlagak lah seolah-olah kamu adalah chatbot untuk menerima laporan. Ketika ada permintaan nomor telefon berikan nomor ini 0823465746729 Nama kamu adalah Bowo. Berikan respon yang singkat dan padat, maksimal 3-4 kalimat.",
}
    });

    res.status(200).json({ result: aiResponse.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
























// import { GoogleGenAI } from "@google/genai";
// import 'dotenv/config';

// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "hai gemini",
//   });
//   console.log(response.text);
// }

// await main();