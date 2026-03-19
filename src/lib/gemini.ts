import { GoogleGenAI } from '@google/genai';
import { getProducts } from './db';
import { Product } from '@/types';

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ У ВАС НЕ УКАЗАНЫ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ AI STUDIO / GEMINI!");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

async function getCurrentProductContext() {
  const products = await getProducts();
  return products.map(p => `- [ID: ${p.id}] ${p.name} (${p.brand}): ${p.price} сом, стиль ${p.shape}, материал ${p.material}, категория ${p.category}`).join('\n');
}

const BASE_SYSTEM_PROMPT = `Role: You are "OptiCare AI", an expert virtual optician, stylist, and customer success assistant for the "VIZHU" online eyewear store in Karakol, Kyrgyzstan.

Your Goal: Help customers find the perfect eyewear through professional consultation.

Store Info:
- Address: г. Каракол, ул. Токтогула 259/8
- Phone: +996 772 18-88-02, +996 500 18-88-02`;

function getSystemPrompt(language: string = 'ru', productContext: string) {
  return `${BASE_SYSTEM_PROMPT}

Current Inventory:
${productContext}

CRITICAL INSTRUCTION: You MUST communicate with the user entirely in the language corresponding to this language code: '${language}' (e.g. 'ru' for Russian, 'en' for English, 'kg' for Kyrgyz language). Do not use any other language.`;
}

export const TOOLS: any = [];

export async function chatWithGemini(userMessage: string, history: { role: string; content: string }[], language: string = 'ru') {
  try {
    const productContext = await getCurrentProductContext();
    const chat = getAI().chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(language, productContext),
        maxOutputTokens: 1024,
        temperature: 0.7,
        tools: TOOLS,
      },
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : ('model' as any),
        parts: [{ text: msg.content }],
      })),
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text || 'Извините, не удалось получить ответ.';
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error('Ошибка при обращении к ИИ-ассистенту');
  }
}

export async function chatWithGeminiStream(userMessage: string, history: { role: string; content: string }[], language: string = 'ru') {
  try {
    const productContext = await getCurrentProductContext();
    const chat = getAI().chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(language, productContext),
        maxOutputTokens: 1024,
        temperature: 0.7,
        tools: TOOLS,
      },
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : ('model' as any),
        parts: [{ text: msg.content }],
      })),
    });

    return await chat.sendMessageStream({
      message: userMessage,
    });
  } catch (error: any) {
    console.error('Gemini Streaming API error:', error);
    throw new Error('Ошибка при обращении к ИИ-ассистенту (Stream): ' + (error?.message || String(error)));
  }
}

export async function chatWithGeminiVision(
  userMessage: string,
  imageBase64: string,
  mimeType: string,
  history: { role: string; content: string }[],
  language: string = 'ru'
) {
  try {
    const productContext = await getCurrentProductContext();
    const chat = getAI().chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(language, productContext),
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : ('model' as any),
        parts: [{ text: msg.content }],
      })),
    });

    const response = await chat.sendMessage({
      message: [
        { text: userMessage || 'Проанализируй изображение.' },
        { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } }
      ]
    });

    return response.text || 'Ошибка анализа изображения.';
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    throw new Error('Ошибка при анализе изображения');
  }
}

export async function parsePrescription(imageBase64: string, mimeType: string) {
  try {
    const prompt = 'Проанализируй фото рецепта. Верни JSON с полями od, os (sphere, cylinder, axis, add) и pd.';
    const chat = getAI().chats.create({
      model: 'gemini-2.5-flash',
      config: { maxOutputTokens: 512, temperature: 0.2 },
    });

    const response = await chat.sendMessage({
      message: [
        { text: prompt },
        { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } }
      ]
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error('Prescription parsing error:', error);
    throw new Error('Ошибка при чтении рецепта');
  }
}

export async function getQuizRecommendations(answers: Record<string, string>) {
  try {
    const productContext = await getCurrentProductContext();
    const prompt = `Подбери 3-5 оправ. Параметры: ${JSON.stringify(answers)}. Ассортимент: ${productContext}`;
    const chat = getAI().chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'Ты — эксперт-оптик. Помоги подобрать очки.',
        maxOutputTokens: 1024,
        temperature: 0.8,
      },
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text || 'Не удалось получить рекомендации.';
  } catch (error) {
    console.error('Quiz recommendations error:', error);
    throw new Error('Ошибка при получении рекомендаций');
  }
}
