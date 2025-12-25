import { useState } from 'react'
import AvatarGeneratorModal from './AvatarGeneratorModal'
import styles from './AvatarUploader.module.css'
import { FaLock } from 'react-icons/fa'
import { useFileUploader } from '../../hooks/useFileUploader' // Імпорт хука

function AvatarUploader({ onAvatarSelect, currentAvatar, t, language, isPro, onOpenPro }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Використовуємо хук для файлів
  const { fileInputRef, handlePick, handleFileChange } = useFileUploader(onAvatarSelect);

  const handleAiClick = () => {
    if (isPro) setIsModalOpen(true);
    else onOpenPro();
  };

  return (
    <div className={styles.simpleUploader}>
      <AvatarGeneratorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={onAvatarSelect}
        translations={t}
      />

      {currentAvatar ? (
        <div className={styles.avatarPreview}>
          <img src={currentAvatar} alt="Avatar" className={styles.avatarImg} />
          <button type="button" className={styles.removeBtn} onClick={() => onAvatarSelect(null)}>✕</button>
        </div>
      ) : (
        <div className={styles.uploadOptions}>
          <button type="button" className={styles.uploadBtn} onClick={handlePick}>
            {t.upload || "Файл"}
          </button>
          
          <button 
            type="button" 
            className={styles.aiAvatarBtn} 
            onClick={handleAiClick}
            style={!isPro ? { background: '#f5f5f5', color: '#666', borderColor: '#ddd' } : {}}
          >
             {isPro ? '✨ AI Avatar' : (
               <>AI Avatar <FaLock style={{marginLeft: 5, fontSize: 12}} /></>
             )}
          </button>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className={styles.fileInput} />
    </div>
  )
}

export default AvatarUploader;