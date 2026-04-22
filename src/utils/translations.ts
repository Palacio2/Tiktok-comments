export interface TranslationSchema {
  appTitle: string;
  aboutBtn: string;
  updatesBtn: string;
  getPro: string;
  proActive: string;
  username: string;
  verified: string;
  authorBadge: string;
  commentText: string;
  commentPlaceholder: string;
  timeAgo: string;
  likesCount: string;
  likedByCreator: string;
  replies: string;
  addReply: string;
  exportSettings: string;
  clear?: string
  
  // Експорт та буфер
  watermark?: string;
  randomComment?: string;
  randomCommentApplied?: string;
  copyImage?: string;
  copied?: string;
  exportSuccess?: string;
  exportError?: string;
  copyError?: string;
  liveEditHint?: string;
  toolbar?: string;
  
  // Бібліотека
  search?: string;
  allCategories?: string;
  downloadSelected?: string;
  downloadStarted?: string;
  libraryDesc?: string;
  noResults?: string;
  tryAnotherSearch?: string;
  
  // Налаштування
  darkMode: string;
  downloadBtn: string;
  aiAssist: string;
  mediaLibrary: string;
  authorSettings: string;
  commentContent: string;
  aiAvatarTitle: string;
  aiAvatarPrompt: string;
  generatorNav?: string;
  libraryNav?: string;
  generate: string;
  cancel: string;
  apply: string;
  width: string;
  height: string;
  presetAuto: string;
  presetSquare: string;
  presetStory: string;
  replyNumber: string;
  likes: string;
  time: string;

  // AI та TTS
  aiMoods: {
    funny: string;
    hater: string;
    supportive: string;
    sarcastic: string;
    question: string;
  };
  aiLengths: {
    short: string;
    medium: string;
    long: string;
  };
  aiPromptError?: string;
  aiSuccess?: string;
  aiError?: string;
  avatarSuccess?: string;
  ttsLoading?: string;
  ttsSuccess?: string;
  ttsError?: string;

  // Компонент коментаря
  authorBadgeLabel: string;
  replyAction: string;
  viewReplies: string;
  
  // PRO модалка
  loading: string;
  proActiveTitle: string;
  proValidUntil: string;
  extendPro: string;
  extendProBtn: string;
  enterCode: string;
  activateCode: string;
  invalidCode?: string;
  getProModalTitle: string;
  getProModalDesc: string;
  orEnterCode: string;
}

export const translations: Record<string, TranslationSchema> = {
  uk: {
    appTitle: "TikTok Gen",
    aboutBtn: "Про проект",
    updatesBtn: "Оновлення",
    getPro: "Отримати PRO",
    proActive: "PRO Активне",
    username: "Нікнейм",
    verified: "Верифікація",
    authorBadge: "Бейдж автора",
    commentText: "Текст коментаря",
    commentPlaceholder: "Напишіть щось цікаве...",
    mediaLibrary: "Бібліотека фонів",
    timeAgo: "Час",
    generatorNav: "Генератор",
    libraryNav: "Бібліотека",
    likesCount: "Лайки",
    likedByCreator: "Лайк автора",
    replies: "Відповіді",
    addReply: "Додати відповідь",
    exportSettings: "Налаштування експорту",
    
    watermark: "Водяний знак",
    randomComment: "Випадково",
    randomCommentApplied: "Випадкові дані застосовано 🎲",
    copyImage: "Копіювати",
    copied: "Скопійовано!",
    exportSuccess: "Зображення збережено!",
    exportError: "Помилка при експорті",
    copyError: "Помилка при копіюванні",
    liveEditHint: "Клікайте на текст або аватарку, щоб редагувати!",
    toolbar: "Панель інструментів",
    
    search: "Пошук фонів...",
    allCategories: "Усі категорії",
    downloadSelected: "Завантажити вибрані ({count})",
    downloadStarted: "Почалося завантаження {count} відео",
    libraryDesc: "Шукай та завантажуй високоякісні відео-фони для своїх TikTok.",
    noResults: "Нічого не знайдено",
    tryAnotherSearch: "Спробуй змінити запит або категорію.",

    darkMode: "Темна тема",
    downloadBtn: "Завантажити",
    aiAssist: "AI Текст",
    authorSettings: "Профіль",
    commentContent: "Контент",
    aiAvatarTitle: "Створити AI Аватар",
    aiAvatarPrompt: "Напр. кіт у кіберпанк стилі...",
    generate: "Згенерувати",
    cancel: "Скасувати",
    apply: "Застосувати",
    width: "Ширина",
    height: "Висота",
    presetAuto: "АВТО",
    presetSquare: "1:1",
    presetStory: "9:16",
    replyNumber: "Відповідь",
    likes: "Лайки",
    time: "Час",
    
    aiMoods: {
      funny: "😂 Смішний",
      hater: "😡 Хейтер",
      supportive: "😍 Підтримка",
      sarcastic: "😏 Сарказм",
      question: "🤔 Питання"
    },
    aiLengths: {
      short: "Короткий",
      medium: "Середній",
      long: "Довгий"
    },
    aiPromptError: "Введіть тему або опис",
    aiSuccess: "Текст успішно згенеровано!",
    aiError: "Помилка генерації",
    avatarSuccess: "Аватар застосовано!",
    ttsLoading: "Генеруємо голос TikTok...",
    ttsSuccess: "Аудіо збережено!",
    ttsError: "Помилка озвучки",

    authorBadgeLabel: "· Автор",
    replyAction: "Відповісти",
    viewReplies: "Подивитись {count} відповіді",

    loading: "Завантаження...",
    proActiveTitle: "PRO Активовано!",
    proValidUntil: "Діє до:",
    extendPro: "Бажаєте продовжити?",
    extendProBtn: "Придбати код",
    enterCode: "Введіть код активації",
    activateCode: "Активувати",
    invalidCode: "Невірний код активації",
    getProModalTitle: "Отримати PRO",
    getProModalDesc: "Генеруй AI-коментарі, TTS озвучку, прибирай водяний знак та качай SVG. (Діє 7 днів)",
    orEnterCode: "Або введіть код"
  },
  en: {
    appTitle: "TikTok Gen",
    aboutBtn: "About",
    updatesBtn: "Updates",
    getPro: "Get PRO",
    proActive: "PRO Active",
    username: "Username",
    verified: "Verified",
    authorBadge: "Author Badge",
    commentText: "Comment Text",
    commentPlaceholder: "Write something cool...",
    mediaLibrary: "Media Library",
    timeAgo: "Time",
    generatorNav: "Generator",
    libraryNav: "Library",
    likesCount: "Likes",
    likedByCreator: "Liked by Creator",
    replies: "Replies",
    addReply: "Add Reply",
    exportSettings: "Export Settings",
    
    watermark: "Watermark",
    randomComment: "Random",
    randomCommentApplied: "Random data applied 🎲",
    copyImage: "Copy",
    copied: "Copied!",
    exportSuccess: "Image saved!",
    exportError: "Export failed",
    copyError: "Copying not supported",
    liveEditHint: "Click text or avatar to edit!",
    toolbar: "Toolbar",
    
    search: "Search backgrounds...",
    allCategories: "All categories",
    downloadSelected: "Download selected ({count})",
    downloadStarted: "Started downloading {count} videos",
    libraryDesc: "Search and download high-quality video backgrounds for your TikToks.",
    noResults: "No results found",
    tryAnotherSearch: "Try changing your search or category.",

    darkMode: "Dark Mode",
    downloadBtn: "Download",
    aiAssist: "AI Text",
    authorSettings: "Profile",
    commentContent: "Content",
    aiAvatarTitle: "Create AI Avatar",
    aiAvatarPrompt: "E.g. a cat in cyberpunk style...",
    generate: "Generate",
    cancel: "Cancel",
    apply: "Apply",
    width: "Width",
    height: "Height",
    presetAuto: "AUTO",
    presetSquare: "1:1",
    presetStory: "9:16",
    replyNumber: "Reply",
    likes: "Likes",
    time: "Time",

    aiMoods: {
      funny: "😂 Funny",
      hater: "😡 Hater",
      supportive: "😍 Supportive",
      sarcastic: "😏 Sarcastic",
      question: "🤔 Question"
    },
    aiLengths: {
      short: "Short",
      medium: "Medium",
      long: "Long"
    },
    aiPromptError: "Please enter a topic",
    aiSuccess: "Text generated successfully!",
    aiError: "Generation error",
    avatarSuccess: "Avatar applied!",
    ttsLoading: "Generating TikTok voice...",
    ttsSuccess: "Audio saved!",
    ttsError: "TTS error",

    authorBadgeLabel: "· Creator",
    replyAction: "Reply",
    viewReplies: "View {count} replies",

    loading: "Loading...",
    proActiveTitle: "PRO is Active!",
    proValidUntil: "Valid until:",
    extendPro: "Want to extend?",
    extendProBtn: "Buy a code",
    enterCode: "Enter activation code",
    activateCode: "Activate",
    invalidCode: "Invalid activation code",
    getProModalTitle: "Get PRO Access",
    getProModalDesc: "Generate AI comments, TTS voice, remove watermark and export SVG. (Valid for 7 days)",
    orEnterCode: "Or enter code"
  }
};