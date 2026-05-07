import { GoogleGenAI } from '@google/genai';
import { getProducts } from '../lib/db';
import { GeminiHistoryItem } from '../lib/gemini';

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ AI Studio API Key not found in environment variables!");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

async function getCurrentProductContext() {
  const products = await getProducts();
  return products.map(p => `- [ID: ${p.id}] ${p.name} (${p.brand}): ${p.price} сом, стиль ${p.shape}, материал ${p.material}, категория ${p.category}`).join('\n');
}

const BASE_SYSTEM_PROMPT = `Role: You are "OptiCare AI", provide professional eyewear consultation for "VIZHU" store.
Address: Karakol, Toktogul 259/8.
Phone: +996 772 18-88-02, +996 500 18-88-02.`;

function getSystemPrompt(language: string = 'ru', productContext: string) {
  return `${BASE_SYSTEM_PROMPT}
  
Current Inventory:
${productContext}

Instruction: Speak ONLY in the requested language: '${language}'.`;
}

export const TOOLS: never[] = [];

export async function chatWithGemini(userMessage: string, history: GeminiHistoryItem[] = [], language: string = 'ru') {
  try {
    const productContext = await getCurrentProductContext();
    const ai = getAI();
    
    // Using gemini-2.5-flash for stability and "thinking" capabilities
    const chat = ai.chats.create({
      model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(language, productContext),
        maxOutputTokens: 1024,
        temperature: 0.7,
        tools: TOOLS,
      },
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage({
      message: userMessage,
    });

    return result.text || 'Извините, не удалось получить ответ.';
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw new Error('Ошибка при обращении к ИИ-ассистенту (Gemini 3)');
  }
}
