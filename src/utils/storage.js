const STORAGE_KEY = 'tiktok_comments_data_v2'
const MAX_COMMENTS = 50

export const loadComments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Помилка завантаження коментарів:', error)
    return []
  }
}

export const saveComment = (comment) => {
  try {
    const comments = loadComments()
    
    // Перевірка на дублікат за вмістом
    const isDuplicate = comments.some(
      c => c.username === comment.username && 
           c.commentText === comment.commentText &&
           c.date === comment.date
    )
    
    if (isDuplicate) {
      console.warn('Коментар-дублікат не збережено')
      return comments
    }
    
    const newComments = [comment, ...comments].slice(0, MAX_COMMENTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newComments))
    return newComments
  } catch (error) {
    console.error('Помилка збереження коментаря:', error)
    return []
  }
}

export const clearComments = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const deleteComment = (commentId) => {
  try {
    const comments = loadComments()
    const filteredComments = comments.filter(comment => comment.id !== commentId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredComments))
    return filteredComments
  } catch (error) {
    console.error('Помилка видалення коментаря:', error)
    return loadComments()
  }
}