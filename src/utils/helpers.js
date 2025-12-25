export const validateCommentData = (data) => {
  const errors = {}
  
  if (!data.username?.trim()) errors.username = "Введіть ім'я користувача"
  if (!data.commentText?.trim()) errors.commentText = "Введіть текст коментаря"
  if (data.likes < 0) errors.likes = "Кількість лайків не може бути від'ємною"
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getDefaultAvatarData = (username) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']
  if (!username || username.length < 2) return { color: colors[0], initial: '?' }
  const color = colors[username.length % colors.length]
  const initial = username.charAt(1).toUpperCase()
  return { color, initial }
}

// 👇 Перенесено з CommentImageExporter.jsx
export const formatLikeCount = (count) => {
  if (!count || count === 0) return null
  if (count < 1000) return count.toString()
  if (count < 10000) return Math.floor(count / 1000) + 'k'
  return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace('.0', '') + 'k'
}

// 👇 Перенесено з AvatarGeneratorModal.jsx
export const toBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Base64 error:", e);
    return url;
  }
};

// 👇 Перенесено логіку розрахунків розмірів (можна також в окремий файл stylesUtils.js)
export const calculatePreviewSizes = (baseWidth) => {
  const scale = baseWidth / 1080
  return {
    padding: Math.max(20, 40 * scale),
    avatarSize: Math.max(50, 110 * scale),
    avatarFontSize: Math.max(20, 48 * scale),
    usernameFontSize: Math.max(20, 38 * scale),
    verifiedSize: Math.max(16, 32 * scale),
    verifiedFontSize: Math.max(10, 18 * scale),
    textFontSize: Math.max(24, 42 * scale),
    dateFontSize: Math.max(20, 36 * scale),
    iconFontSize: Math.max(24, 46 * scale),
    likeFontSize: Math.max(18, 34 * scale),
    gap: Math.max(16, 32 * scale),
    actionGap: Math.max(20, 40 * scale)
  }
}