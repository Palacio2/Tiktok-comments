export const APP_CONFIG = {
  MAX_REPLIES: 5,
  AVATAR_MAX_SIZE: 2 * 1024 * 1024,
  AVATAR_DISPLAY_SIZE: 400,
};

export const STORAGE_KEYS = {
  PRO_TOKEN: 'tiktok_gen_pro_key',
};

export const LANGUAGES_LIST = [
  { code: 'uk', label: 'Українська', countryCode: 'ua' },
  { code: 'en', label: 'English', countryCode: 'us' },
  { code: 'pl', label: 'Polski', countryCode: 'pl' },
  { code: 'fr', label: 'Français', countryCode: 'fr' },
  { code: 'ru', label: 'Русский', countryCode: 'ru' },
];

export const AI_LANGUAGES = [
  { id: 'ukrainian', label: '🇺🇦 Українська' },
  { id: 'english', label: '🇬🇧 English' },
  { id: 'polish', label: '🇵🇱 Polski' }
];

export const MEDIA_CATEGORIES = ['All', 'Gaming', 'ASMR', 'Satisfying', 'Nature'];

export const RANDOM_DATA = {
  NAMES: ['user_19283', 'sigma_rules', 'tiktok_queen', 'viral_creator', 'meme_hub', 'dark_knight', 'sunny_girl'],
  COMMENTS: [
    'Bro really thought he did something 💀',
    'This is literally me 😂',
    'Part 2 please!!',
    'How did you do this? 😳',
    'First! 🏆',
    'The ending was unexpected lol',
    'I need this in my life right now'
  ],
  AVATARS: ['Felix', 'Aneka', 'Oliver', 'Mimi', 'Jack', 'Luna', 'Max'],
  LIKES: ['1.2M', '45.6K', '890', '12K', '3.4M', '225', '1.1K'],
  TIMES: ['1h', '2m', '5d', 'Just now', '1w', '10h', '30m']
};

export const INITIAL_COMMENT_STATE = {
  username: 'tiktok_star',
  isVerified: false,
  isAuthor: false,
  avatarUrl: null,
  commentText: 'This is an awesome video! 🔥',
  likes: '12K',
  timeAgo: '2h',
  isLikedByCreator: false,
  replies: []
};