import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCrown, FaCheck, FaTimes, FaKey, FaArrowRight } from 'react-icons/fa';
import { MdVerified } from "react-icons/md"; // Іконка верифікації
import styles from './SubscriptionModal.module.css';

function SubscriptionModal({ isOpen, onClose, onBuy, onActivate, isValidating, translations: t }) {
  const [accessCode, setAccessCode] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAccessCode('');
      setStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActivateClick = async () => {
    if (!accessCode.trim()) return;
    
    setStatus(null);
    const success = await onActivate(accessCode);
    
    if (success) {
      setStatus({ type: 'success', text: t.codeSuccess || 'Успіх! PRO активовано 🎉' });
      setAccessCode('');
    } else {
      setStatus({ type: 'error', text: t.codeError || 'Невірний код. Спробуйте ще раз.' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && accessCode.trim() && !isValidating) {
      handleActivateClick();
    }
  };

  const handleSupportClick = () => {
    const email = import.meta.env.VITE_SUPPORT_EMAIL || 'zaviiskyoleh@gmail.com';
    const subject = encodeURIComponent(t.supportSubject || 'Питання PRO');
    const body = encodeURIComponent(`${t.supportGreeting}\n\n${t.supportBody}\n\n`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>
        
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <FaCrown className={styles.crownIcon} />
          </div>
          <h2>{t.proTitle}</h2>
          <p>{t.proDesc}</p>
        </div>

        <div className={styles.features}>
          {[t.proFeature1, t.proFeatureNoWatermark, t.proFeature3, t.proFeatureVerified, t.proFeatureCustom].map((feature, i) => {
            const isVerifiedItem = feature === t.proFeatureVerified;

            return (
              <div key={i} className={styles.featureItem}>
                {/* 1. Зелена галочка завжди зліва */}
                <div className={styles.checkIcon}><FaCheck /></div>
                
                {/* 2. Текст (якщо це верифікація - додаємо синю іконку перед текстом) */}
                <span style={isVerifiedItem ? { display: 'flex', alignItems: 'center', gap: '6px' } : {}}>
                  {isVerifiedItem && (
                    <MdVerified style={{ color: '#20d5ec', fontSize: '18px', flexShrink: 0 }} />
                  )}
                  {feature}
                </span>
              </div>
            );
          })}
        </div>

        <button className={styles.buyBtn} onClick={onBuy}>
          {t.buyPro}
        </button>

        <div className={styles.activationSection}>
          <p className={styles.activationTitle}>{t.haveCode}</p>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                placeholder={t.codePlaceholder}
                value={accessCode}
                onChange={(e) => { 
                  setAccessCode(e.target.value.toUpperCase()); 
                  if(status) setStatus(null); 
                }}
                onKeyDown={handleKeyDown}
                className={`${styles.codeInput} ${status?.type === 'error' ? styles.inputError : ''}`}
                disabled={isValidating}
              />
              <FaKey className={styles.keyIcon} />
            </div>
            
            <button 
              onClick={handleActivateClick} 
              className={styles.activateBtn} 
              disabled={!accessCode.trim() || isValidating}
            >
              {isValidating ? <span className={styles.spinner}></span> : <><FaArrowRight /></>}
            </button>
          </div>
          
          {status && (
            <div className={`${styles.statusMessage} ${styles[status.type]}`}>
              {status.type === 'success' ? '🎉' : '⚠️'} {status.text}
            </div>
          )}
        </div>
        
        <button className={styles.restoreBtn} onClick={handleSupportClick}>
          {t.supportButton}
        </button>
      </div>
    </div>,
    document.body
  );
}

export default SubscriptionModal;