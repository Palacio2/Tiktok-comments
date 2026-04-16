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
  darkMode: string;
  downloadBtn: string;
  aiAssist: string;
  authorSettings: string;
  commentContent: string;
  aiAvatarTitle: string;
  aiAvatarPrompt: string;
  generate: string;
  cancel: string;
  apply: string;
  width: string;
  height: string;
  presetAuto: string;
  presetSquare: string;
  presetStory: string;
  presetCustom: string;
  replyNumber: string;
  likes: string;
  time: string;
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
  // Ключі для прев'ю коментаря
  authorBadgeLabel: string;
  replyAction: string;
  viewReplies: string;
  
  // Нові ключі для лоадера та модалки PRO
  loading: string;
  proActiveTitle: string;
  proValidUntil: string;
  extendPro: string;
  extendProBtn: string;
  enterCode: string;
  activateCode: string;
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
    timeAgo: "Час",
    likesCount: "Лайки",
    likedByCreator: "Лайк автора",
    replies: "Відповіді",
    addReply: "Додати відповідь",
    exportSettings: "Налаштування експорту",
    darkMode: "Темна тема",
    downloadBtn: "Завантажити",
    aiAssist: "AI Помічник",
    authorSettings: "Профіль автора",
    commentContent: "Контент",
    aiAvatarTitle: "Створити AI Аватар",
    aiAvatarPrompt: "Напр. кіт у кіберпанк стилі...",
    generate: "Згенерувати",
    cancel: "Скасувати",
    apply: "Застосувати",
    width: "Ширина",
    height: "Висота",
    presetAuto: "Авто",
    presetSquare: "1:1",
    presetStory: "9:16",
    presetCustom: "Свій",
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
    authorBadgeLabel: "· Автор",
    replyAction: "Відповісти",
    viewReplies: "Подивитись {count} відповіді",

    // Переклади для лоадера та модалки PRO
    loading: "Завантаження...",
    proActiveTitle: "PRO Активовано!",
    proValidUntil: "Ваша підписка дійсна ще:",
    extendPro: "Бажаєте продовжити?",
    extendProBtn: "Придбати новий код",
    enterCode: "Введіть код активації",
    activateCode: "Активувати код",
    getProModalTitle: "Отримай PRO",
    getProModalDesc: "Генеруй AI-коментарі, завантажуй в SVG без втрати якості та використовуй преміум-функції. (Діє 7 днів)",
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
    timeAgo: "Time",
    likesCount: "Likes",
    likedByCreator: "Liked by Creator",
    replies: "Replies",
    addReply: "Add Reply",
    exportSettings: "Export Settings",
    darkMode: "Dark Mode",
    downloadBtn: "Download",
    aiAssist: "AI Assistant",
    authorSettings: "Author Profile",
    commentContent: "Content",
    aiAvatarTitle: "Create AI Avatar",
    aiAvatarPrompt: "E.g. a cat in cyberpunk style...",
    generate: "Generate",
    cancel: "Cancel",
    apply: "Apply",
    width: "Width",
    height: "Height",
    presetAuto: "Auto",
    presetSquare: "1:1",
    presetStory: "9:16",
    presetCustom: "Custom",
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
    authorBadgeLabel: "· Creator",
    replyAction: "Reply",
    viewReplies: "View {count} replies",

    // Переклади для лоадера та модалки PRO
    loading: "Loading...",
    proActiveTitle: "PRO is Active!",
    proValidUntil: "Your subscription is valid for:",
    extendPro: "Want to extend?",
    extendProBtn: "Buy a new code",
    enterCode: "Enter activation code",
    activateCode: "Activate code",
    getProModalTitle: "Get PRO",
    getProModalDesc: "Generate AI comments, download in SVG without quality loss, and use premium features. (Valid for 7 days)",
    orEnterCode: "Or enter code"
  }
};