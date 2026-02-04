import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAvatarGenerator } from '@hooks/useAvatarGenerator';
import { useLanguage } from '@hooks';
import styles from './AvatarGeneratorModal.module.css';

const Icons = {
  Sparkles: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  User: () => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

function AvatarGeneratorModal({ isOpen, onClose, onApply }) {
  const { t } = useLanguage();
  
  const {
    promptText, setPromptText,
    previewImage, isLoading, status, error,
    handleGenerate, handleApply, handleClose: originalHandleClose
  } = useAvatarGenerator(onApply, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={originalHandleClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.iconBadge}>
              <Icons.Sparkles />
            </div>
            <h3>{t.aiAvatarTitle || 'AI Avatar'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={originalHandleClose} aria-label="Close">
            <Icons.Close />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.inputContainer}>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={t.aiAvatarPrompt || "Describe avatar (e.g., anime boy)..."}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                disabled={isLoading}
                autoFocus
                className={styles.input}
              />
              <button 
                className={styles.generateBtn} 
                onClick={handleGenerate}
                disabled={isLoading || !promptText.trim()}
                aria-label="Generate"
              >
                {isLoading ? <span className={styles.spinnerSmall}></span> : <Icons.Sparkles />}
              </button>
            </div>
            {error && <div className={styles.errorMessage}>⚠️ {error}</div>}
          </div>

          <div className={styles.previewContainer}>
            <div className={styles.previewFrame}>
              {isLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loader}></div>
                  <span className={styles.statusText}>{status || t.generating || 'Generating...'}</span>
                </div>
              ) : previewImage ? (
                <img src={previewImage} alt="Generated Avatar" className={styles.previewImg} />
              ) : (
                <div className={styles.placeholder}>
                  <Icons.User />
                  <p>{t.aiAvatarPlaceholder || 'Enter prompt & press generate'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={originalHandleClose}>
            {t.cancel || 'Cancel'}
          </button>
          <button 
            className={styles.primaryBtn} 
            onClick={handleApply}
            disabled={!previewImage || isLoading}
          >
            <Icons.Check /> {t.apply || 'Apply Avatar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AvatarGeneratorModal;