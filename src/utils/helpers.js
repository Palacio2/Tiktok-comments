export const validateCommentData = (data) => {
  const errors = {}
  
  if (!data.username?.trim()) {
    errors.username = "Введіть ім'я користувача"
  }
  
  if (!data.commentText?.trim()) {
    errors.commentText = "Введіть текст коментаря"
  }
  
  if (data.likes < 0) {
    errors.likes = "Кількість лайків не може бути від'ємною"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Уніфікована функція для аватара (можна використовувати в будь-якому місці)
export const getDefaultAvatarData = (username) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']
  
  if (!username || username.length < 2) {
    return { color: colors[0], initial: '?' }
  }
  
  const color = colors[username.length % colors.length]
  const initial = username.charAt(1).toUpperCase()
  
  return { color, initial }
}