import { urlToBase64 } from '../utils/helpers'; // Якщо знадобиться тут

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Генерує текст коментаря за допомогою Gemini
 */
export const generateComment = async (params, languageConfig) => {
  if (!API_KEY) throw new Error("API Key не знайдено! Перевірте .env файл.");

  const promptText = `
    Act as a TikTok user. Write a single comment.
    Target Language: ${languageConfig.aiLangName}.
    Topic: ${params.topic || 'viral video'}.
    Mood: ${params.mood}.
    Length: ${params.length}.
    Style Instruction: ${languageConfig.aiPromptStyle}
    Constraint: Text only. No quotes.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API Error');
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  } catch (error) {
    console.error("AI Text Error:", error);
    throw error;
  }
};

/**
 * Покращує промпт для аватара за допомогою Gemini
 */
export const enhanceAvatarPrompt = async (userText) => {
  if (!API_KEY) return userText;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `You are an expert prompt engineer. Translate this user request to English and enhance it for an AI image generator (Flux model). 
              Make it descriptive but concise. Focus on: avatar style, centered composition, high quality, vector or 3D render style.
              Input: "${userText}"
              Output ONLY the English prompt, nothing else.` 
            }] 
          }]
        })
      }
    );
    
    if (!response.ok) {
      console.warn(`Gemini API Warning: ${response.status}`);
      return userText;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || userText;
  } catch (error) {
    console.error("Gemini Prompt Enhance Error:", error);
    return userText;
  }
};

/**
 * Генерує URL картинки через Pollinations AI (Flux model)
 */
export const generateAvatarUrl = (enhancedPrompt) => {
  const seed = Math.floor(Math.random() * 10000);
  const safePrompt = encodeURIComponent(`${enhancedPrompt}, white background, centered, avatar, high quality`);
  return `https://image.pollinations.ai/prompt/${safePrompt}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
};