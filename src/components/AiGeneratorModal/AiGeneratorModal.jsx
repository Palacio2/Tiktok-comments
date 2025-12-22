import { useState } from 'react';
import { createPortal } from 'react-dom';
import { translations } from '../../utils/translations';
import styles from './AiGeneratorModal.module.css';

function AiGeneratorModal({ isOpen, onClose, onApply, language }) {
  const [settings, setSettings] = useState({
    topic: '',
    mood: 'positive',
    length: 'short'
  });
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];

  const handleGenerate = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert("API Key не знайдено!");
      return;
    }

    setIsLoading(true);

    const currentLangConfig = translations[language];
    
    const promptText = `
      Act as a TikTok user. Write a single comment.
      Target Language: ${currentLangConfig.aiLangName}.
      Topic: ${settings.topic || 'viral video'}.
      Mood: ${settings.mood}.
      Length: ${settings.length}.
      Style Instruction: ${currentLangConfig.aiPromptStyle}
      Constraint: Text only. No quotes.
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || response.statusText);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) setResult(text.trim());
      else alert("Empty response.");

    } catch (error) {
      console.error("Gemini API Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onApply(result);
    onClose();
    setResult('');
  };

  const handleClose = () => {
    onClose();
    setResult('');
  };

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
                  onChange={e => setSettings({...settings, topic: e.target.value})}
                  placeholder={t.topicPlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>{t.mood}</label>
                  <select value={settings.mood} onChange={e => setSettings({...settings, mood: e.target.value})}>
                    <option value="positive">{t.moods.positive}</option>
                    <option value="funny">{t.moods.funny}</option>
                    <option value="shocked">{t.moods.shocked}</option>
                    <option value="hater">{t.moods.hater}</option>
                    <option value="question">{t.moods.question}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.length}</label>
                  <select value={settings.length} onChange={e => setSettings({...settings, length: e.target.value})}>
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