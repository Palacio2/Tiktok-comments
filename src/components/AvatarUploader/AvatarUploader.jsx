import { useState } from 'react'
import AvatarGeneratorModal from './AvatarGeneratorModal'
import styles from './AvatarUploader.module.css'
import { FaLock } from 'react-icons/fa'
import { useFileUploader } from '../../hooks/useFileUploader'

function AvatarUploader({ onAvatarSelect, currentAvatar, t, language, isPro, onOpenPro }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { fileInputRef, handlePick, handleFileChange } = useFileUploader(onAvatarSelect);

  const handleAiClick = () => {
    if (isPro) {
      setIsModalOpen(true);
    } else {
      onOpenPro();
    }
  };

  return (
    <div className={styles.uploader}>
      <AvatarGeneratorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={onAvatarSelect}
        translations={t}
      />

      {currentAvatar ? (
        <div className={styles.preview}>
          <img src={currentAvatar} alt="Avatar" className={styles.avatarImg} />
          <button 
            type="button" 
            className={styles.removeBtn} 
            onClick={() => onAvatarSelect(null)}
            aria-label={t.removeAvatar || "Remove avatar"}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={styles.options}>
          <button 
            type="button" 
            className={styles.uploadBtn} 
            onClick={handlePick}
          >
            📁 {t.upload || 'Завантажити'}
          </button>
          
          <button 
            type="button" 
            className={`${styles.aiBtn} ${!isPro ? styles.locked : ''}`} 
            onClick={handleAiClick}
          >
            ✨ {t.aiAvatarBtn || 'AI Avatar'}
            {!isPro && <FaLock className={styles.lockIcon} />}
          </button>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className={styles.fileInput} 
        aria-label={t.upload || "Upload avatar"}
      />
    </div>
  )
}

export default AvatarUploader;