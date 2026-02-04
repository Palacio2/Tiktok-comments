import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAiGenerator } from '@hooks';
import { translations } from '@utils';
import styles from './AiGeneratorModal.module.css';

const Icons = {
  Magic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Topic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Mood: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Length: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20"/><path d="M6 8v8"/><path d="M12 7v10"/><path d="M18 8v8"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
};

function AiGeneratorModal({ isOpen, onClose, onApply, language }) {
  const {
    settings,
    updateSetting,
    result,
    setResult,
    isLoading,
    error,
    handleGenerate,
    handleAccept,
    handleClose: originalHandleClose
  } = useAiGenerator(onApply, onClose, language);

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

  const t = translations[language] || {};
  const handleModalClick = (e) => e.stopPropagation();

  return createPortal(
    <div className={styles.overlay} onClick={originalHandleClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={handleModalClick}>
        
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.iconBadge}>
              <Icons.Magic />
            </div>
            <h3>{t.aiTitle || 'AI Assistant'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={originalHandleClose} aria-label="Close">
            <Icons.Close />
          </button>
        </div>

        <div className={styles.body}>
          {!result ? (
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label><Icons.Topic /> {t.topic || 'Topic'}</label>
                <input 
                  type="text"
                  className={styles.input}
                  value={settings.topic}
                  onChange={e => updateSetting('topic', e.target.value)}
                  placeholder={t.topicPlaceholder || '...'}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label><Icons.Mood /> {t.mood || 'Mood'}</label>
                  <div className={styles.selectWrapper}>
                    <select 
                      value={settings.mood} 
                      onChange={e => updateSetting('mood', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="positive">{t.moods?.positive || 'Positive'}</option>
                      <option value="funny">{t.moods?.funny || 'Funny'}</option>
                      <option value="professional">{t.moods?.professional || 'Professional'}</option>
                      <option value="shocked">{t.moods?.shocked || 'Shocked'}</option>
                      <option value="hater">{t.moods?.hater || 'Hater'}</option>
                      <option value="question">{t.moods?.question || 'Question'}</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label><Icons.Length /> {t.length || 'Length'}</label>
                  <div className={styles.selectWrapper}>
                    <select 
                      value={settings.length} 
                      onChange={e => updateSetting('length', e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="short">{t.lengths?.short || 'Short'}</option>
                      <option value="medium">{t.lengths?.medium || 'Medium'}</option>
                      <option value="long">{t.lengths?.long || 'Long'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorMessage}>⚠️ {error}</div>}
            </div>
          ) : (
            <div className={styles.resultContainer}>
              <label className={styles.resultLabel}>
                <Icons.Magic /> {t.generatedComment || 'Result'}
              </label>
              <textarea 
                className={styles.resultArea}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={6}
              />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {!result ? (
            <button 
              className={styles.generateBtn} 
              onClick={handleGenerate} 
              disabled={isLoading || !settings.topic.trim()}
            >
              {isLoading ? <span className={styles.loader}></span> : <><Icons.Magic /> {t.generate || 'Generate'}</>}
            </button>
          ) : (
            <div className={styles.resultActions}>
              <button 
                className={styles.secondaryBtn} 
                onClick={handleGenerate} 
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.loaderSmall}></span> : <Icons.Refresh />}
              </button>
              
              <button 
                className={styles.primaryBtn} 
                onClick={handleAccept}
                disabled={isLoading}
              >
                <Icons.Check /> {t.apply || 'Apply'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AiGeneratorModal;