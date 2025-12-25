import { createPortal } from 'react-dom';
import styles from './AvatarGeneratorModal.module.css';
import { useAvatarGenerator } from '../../hooks/useAvatarGenerator';

function AvatarGeneratorModal({ isOpen, onClose, onApply, translations: t }) {
  const {
    promptText, setPromptText,
    previewImage, isLoading, status,
    handleGenerate, handleApply, handleClose
  } = useAvatarGenerator(onApply, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{t?.aiAvatarTitle || '✨ AI Avatar'}</h3>
          <button className={styles.closeBtn} onClick={handleClose}>×</button>
        </div>

        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={t?.aiAvatarPrompt || "Опишіть аватар..."}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={isLoading}
              autoFocus
            />
            <button 
              className={styles.generateBtn} 
              onClick={handleGenerate}
              disabled={isLoading || !promptText.trim()}
            >
              {isLoading ? '⏳' : '✨'}
            </button>
          </div>

          <div className={styles.previewArea}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loader}></div>
                <span className={styles.statusText}>{status}</span>
              </div>
            ) : previewImage ? (
              <img src={previewImage} alt="Preview" className={styles.previewImg} />
            ) : (
              <div className={styles.placeholder}>
                <span>?</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose}>{t?.reset || 'Скасувати'}</button>
          <button 
            className={styles.applyBtn} 
            onClick={handleApply}
            disabled={!previewImage}
          >
            {t?.apply || 'Застосувати'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AvatarGeneratorModal;