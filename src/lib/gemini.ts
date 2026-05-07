import { GoogleGenAI } from '@google/genai';
import { getProducts } from './db';

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

export const TOOLS: never[] = [];

export interface GeminiHistoryItem {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export async function chatWithGemini(userMessage: string, history: GeminiHistoryItem[], language: string = 'ru') {
  try {
    const productContext = await getCurrentProductContext();
    const chat = getAI().chats.create({
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

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text || 'Извините, не удалось получить ответ.';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Ошибка при обращении к ИИ-ассистенту');
  }
}

export async function chatWithGeminiStream(userMessage: string, history: GeminiHistoryItem[], language: string = 'ru') {
  try {
    const productContext = await getCurrentProductContext();
    const chat = getAI().chats.create({
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

    return await chat.sendMessageStream({
      message: userMessage,
    });
  } catch (error) {
    console.error('Gemini Streaming API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка при обращении к ИИ-ассистенту (Stream): ' + message);
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
      model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(language, productContext),
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
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
      model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash',
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
      model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash',
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

/**
 * Virtual Try-On using @google/genai SDK with gemini-3.1-flash-image-preview.
 * Single model, no fallback chain — fast and reliable.
 */
export async function virtualTryOn(selfieBase64: string, frameBase64: string, frameMimeType: string = 'image/jpeg') {
  const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL_TRYON || 'gemini-3.1-flash-image-preview';
  console.log(`[Try-On] Using model: ${modelName}`);

  const prompt = "На первом фото — лицо человека (селфи). На втором фото — оправа очков. " +
    "Надень эти ТОЧНЫЕ очки на лицо этого человека. " +
    "Результат должен быть ОДНИМ фотореалистичным изображением человека в этих очках. " +
    "Масштаб и положение очков должны идеально соответствовать форме лица.";

  try {
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: selfieBase64 } },
        { inlineData: { mimeType: frameMimeType, data: frameBase64 } },
        { text: prompt },
      ],
    });

    // Extract generated image from response
    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => 'inlineData' in p && p.inlineData?.data);

    if (imagePart?.inlineData?.data) {
      console.log(`[Try-On] ✅ SUCCESS! mimeType: ${imagePart.inlineData.mimeType}`);
      return {
        image: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || 'image/png'
      };
    }

    // Check finish reason
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason === 'NO_IMAGE') {
      throw new Error('Модель не смогла сгенерировать изображение. Попробуйте другое фото.');
    }

    // Model returned text instead of image
    const textPart = parts.find((p) => 'text' in p && p.text);
    console.warn('[Try-On] Model returned text instead of image:', textPart?.text?.substring(0, 200));
    throw new Error('Модель вернула текст вместо изображения. Попробуйте ещё раз.');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Try-On] Error:', message);
    
    if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Превышен лимит запросов к API. Попробуйте через минуту.');
    }
    if (message.includes('high demand')) {
      throw new Error('Сервер перегружен. Попробуйте через 30 секунд.');
    }
    
    // Re-throw if it's already our error
    if (message.startsWith('Модель') || message.startsWith('Превышен') || message.startsWith('Сервер')) {
      throw error;
    }
    
    throw new Error('Не удалось сгенерировать примерку. Попробуйте другое фото или повторите позже.');
  }
}
