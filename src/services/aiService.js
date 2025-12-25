const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Генерує текст коментаря за допомогою Gemini
 */
export const generateComment = async (params, languageConfig) => {
  if (!API_KEY) throw new Error("API Key не знайдено!");

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
 * Покращує промпт для аватара за допомогою Gemini (переклад + деталізація)
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

/**
 * Конвертує URL картинки в Base64 (для збереження або відображення)
 */
export const imageUrlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Base64 Conversion Error:", e);
    // Якщо не вдалося конвертувати, повертаємо оригінальний URL як запасний варіант
    return url;
  }
};