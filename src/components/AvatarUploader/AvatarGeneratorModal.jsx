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
          <h3>{t.aiAvatarTitle || '✨ AI Avatar Generator'}</h3>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">×</button>
        </div>

        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={t.aiAvatarPrompt || "Опишіть бажаний аватар... (наприклад: 'молодий хлопець у стилі аніме')"}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
              disabled={isLoading}
              autoFocus
            />
            <button 
              className={styles.generateBtn} 
              onClick={handleGenerate}
              disabled={isLoading || !promptText.trim()}
              aria-label="Generate"
            >
              {isLoading ? <span className={styles.spinner}></span> : '✨'}
            </button>
          </div>

          <div className={styles.previewArea}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loader}></div>
                <span className={styles.statusText}>{status || t.generating || 'Генерація...'}</span>
              </div>
            ) : previewImage ? (
              <img src={previewImage} alt="AI Generated Avatar" className={styles.previewImg} />
            ) : (
              <div className={styles.placeholder}>
                <span>?</span>
                <p>{t.aiAvatarPlaceholder || 'Введіть опис і натисніть ✨'}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose}>
            {t.cancel || 'Скасувати'}
          </button>
          <button 
            className={styles.applyBtn} 
            onClick={handleApply}
            disabled={!previewImage || isLoading}
          >
            {t.apply || 'Застосувати'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AvatarGeneratorModal;