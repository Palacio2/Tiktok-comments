import { createPortal } from 'react-dom';
import { useAiGenerator } from '../../hooks/useAiGenerator';
import { translations } from '../../utils/translations'; // Для відображення текстів UI
import styles from './AiGeneratorModal.module.css';

function AiGeneratorModal({ isOpen, onClose, onApply, language }) {
  const {
    settings,
    updateSetting,
    result,
    setResult,
    isLoading,
    handleGenerate,
    handleAccept,
    handleClose
  } = useAiGenerator(onApply, onClose, language);

  if (!isOpen) return null;

  const t = translations[language];

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{t.aiTitle}</h3>
          <button className={styles.closeBtn} onClick={handleClose}>×</button>
        </div>

        <div className={styles.body}>
          {!result ? (
            <>
              <div className={styles.formGroup}>
                <label>{t.topic}</label>
                <input 
                  value={settings.topic}
                  onChange={e => updateSetting('topic', e.target.value)}
                  placeholder={t.topicPlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>{t.mood}</label>
                  <select 
                    value={settings.mood} 
                    onChange={e => updateSetting('mood', e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="positive">{t.moods.positive}</option>
                    <option value="funny">{t.moods.funny}</option>
                    <option value="shocked">{t.moods.shocked}</option>
                    <option value="hater">{t.moods.hater}</option>
                    <option value="question">{t.moods.question}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.length}</label>
                  <select 
                    value={settings.length} 
                    onChange={e => updateSetting('length', e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="short">{t.lengths.short}</option>
                    <option value="medium">{t.lengths.medium}</option>
                    <option value="long">{t.lengths.long}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.resultContainer}>
              <textarea 
                className={styles.resultArea}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {!result ? (
            <button className={styles.generateBtn} onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? '...' : t.generate}
            </button>
          ) : (
            <div className={styles.resultActions}>
              <button className={styles.secondaryBtn} onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? '...' : t.regenerate}
              </button>
              <button className={styles.primaryBtn} onClick={handleAccept}>
                {t.apply}
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