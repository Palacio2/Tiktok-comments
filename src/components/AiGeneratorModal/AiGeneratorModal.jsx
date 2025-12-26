import { createPortal } from 'react-dom';
import { useAiGenerator } from '../../hooks/useAiGenerator';
import { translations } from '../../utils/translations';
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
          <h3>{t.aiTitle || '✨ AI Comment Generator'}</h3>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">×</button>
        </div>

        <div className={styles.body}>
          {!result ? (
            <>
              <div className={styles.formGroup}>
                <label>{t.topic || 'Тема коментаря'}</label>
                <input 
                  type="text"
                  value={settings.topic}
                  onChange={e => updateSetting('topic', e.target.value)}
                  placeholder={t.topicPlaceholder || 'Наприклад: "цей трек вогонь", "як ти це зробив?"...'}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>{t.mood || 'Настрій'}</label>
                  <select 
                    value={settings.mood} 
                    onChange={e => updateSetting('mood', e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="positive">{t.moods?.positive || 'Позитивний'}</option>
                    <option value="funny">{t.moods?.funny || 'Смішний'}</option>
                    <option value="shocked">{t.moods?.shocked || 'Шокований'}</option>
                    <option value="hater">{t.moods?.hater || 'Хейтер'}</option>
                    <option value="question">{t.moods?.question || 'Питання'}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t.length || 'Довжина'}</label>
                  <select 
                    value={settings.length} 
                    onChange={e => updateSetting('length', e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="short">{t.lengths?.short || 'Короткий'}</option>
                    <option value="medium">{t.lengths?.medium || 'Середній'}</option>
                    <option value="long">{t.lengths?.long || 'Довгий'}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.resultContainer}>
              <label>{t.generatedComment || 'Згенерований коментар'}</label>
              <textarea 
                className={styles.resultArea}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={6}
                placeholder="Тут з'явиться результат..."
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
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                '✨ ' + (t.generate || 'Згенерувати')
              )}
            </button>
          ) : (
            <div className={styles.resultActions}>
              <button 
                className={styles.regenerateBtn} 
                onClick={handleGenerate} 
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.spinner}></span> : t.regenerate || 'Згенерувати ще'}
              </button>
              <button 
                className={styles.applyBtn} 
                onClick={handleAccept}
                disabled={isLoading}
              >
                {t.apply || 'Застосувати'}
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