import { useRef, useCallback } from 'react'
import styles from './AvatarUploader.module.css'

function AvatarUploader({ onAvatarSelect, currentAvatar }) {
  const fileInputRef = useRef(null)

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Перевірка розміру файлу (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Розмір файлу не повинен перевищувати 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      onAvatarSelect(e.target.result)
    }
    reader.onerror = () => {
      alert('Помилка при читанні файлу')
    }
    reader.readAsDataURL(file)
  }, [onAvatarSelect])

  const handleRemoveAvatar = useCallback(() => {
    onAvatarSelect(null)
  }, [onAvatarSelect])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={styles.simpleUploader}>
      {currentAvatar ? (
        <div className={styles.avatarPreview}>
          <img 
            src={currentAvatar} 
            alt="Аватар користувача"
            className={styles.avatarImg}
            loading="lazy"
          />
          <button 
            type="button"
            className={styles.removeBtn}
            onClick={handleRemoveAvatar}
            title="Видалити аватар"
            aria-label="Видалити аватар"
          >
            ✕
          </button>
        </div>
      ) : (
        <button 
          type="button"
          className={styles.uploadBtn}
          onClick={handleUploadClick}
          aria-label="Завантажити фото"
        >
          <i className="fas fa-upload" aria-hidden="true"></i>
          Завантажити фото
        </button>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className={styles.fileInput}
        aria-label="Виберіть файл для аватара"
      />
    </div>
  )
}

export default AvatarUploader