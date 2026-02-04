import { supabase } from '@utils/supabaseClient';

// --- Генерація коментарів ---
export const generateComment = async (settings, languageCode) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-comment', {
      body: { 
        type: 'comment', // Вказуємо тип операції
        topic: settings.topic,
        mood: settings.mood,
        length: settings.length,
        language: languageCode 
      }
    });

    if (error) throw error;
    return data.result; // Увага: я змінив ключ відповіді на 'result' для універсальності

  } catch (err) {
    console.error("AI Comment Error:", err);
    throw err;
  }
};

// --- Аватари: Покращення тексту (через Gemini) ---
export const enhanceAvatarPrompt = async (userText) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-comment', {
      body: { 
        type: 'avatar', // Вказуємо, що це для аватара
        prompt: userText 
      }
    });

    if (error || !data?.result) {
      console.warn("AI Enhance failed, using original text");
      return userText;
    }

    return data.result;
  } catch (err) {
    console.warn("AI Service Error (Avatar):", err);
    return userText; // Якщо помилка, повертаємо те, що ввів користувач
  }
};

// --- Аватари: Генерація URL (Pollinations) ---
export const generateAvatarUrl = (enhancedPrompt) => {
  const seed = Math.floor(Math.random() * 100000);
  // Додаємо стильові підказки для кращого результату
  const safePrompt = encodeURIComponent(`${enhancedPrompt}, white background, centered, avatar, high quality, 3d render style`);
  return `https://image.pollinations.ai/prompt/${safePrompt}?width=512&height=512&seed=${seed}&nologo=true&model=flux`;
};