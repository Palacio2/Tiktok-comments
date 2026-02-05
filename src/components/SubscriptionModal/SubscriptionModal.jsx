import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCrown, FaCheck, FaTimes, FaKey, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '@hooks';
import styles from './SubscriptionModal.module.css';

function SubscriptionModal({ isOpen, onClose, onBuy, onActivate, isValidating }) {
  const { t } = useLanguage();
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
      setStatus({ type: 'error', text: t.codeError || 'Невірний код.' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && accessCode.trim() && !isValidating) {
      handleActivateClick();
    }
  };

  const handleSupportClick = () => {
    const subject = encodeURIComponent(t.supportSubject);
    const body = encodeURIComponent(`${t.supportGreeting}\n\n${t.supportBody}\n\n${t.supportQuestion}`);
    window.location.href = `mailto:support@tt-comments.online?subject=${subject}&body=${body}`;
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>
        
        <div className={styles.header}>
          <div className={styles.crownIconWrapper}>
            <FaCrown className={styles.crownIcon} />
          </div>
          <h2>{t.proTitle}</h2>
          <p>{t.proDesc}</p>
        </div>

        <div className={styles.featuresList}>
          <div className={styles.featureItem}><FaCheck className={styles.checkIcon} /> {t.proFeature1}</div>
          <div className={styles.featureItem}><FaCheck className={styles.checkIcon} /> {t.proFeatureNoWatermark}</div>
          <div className={styles.featureItem}><FaCheck className={styles.checkIcon} /> {t.proFeature3}</div>
          <div className={styles.featureItem}><FaCheck className={styles.checkIcon} /> {t.proFeatureVerified}</div>
          <div className={styles.featureItem}><FaCheck className={styles.checkIcon} /> {t.proFeatureCustom}</div>
        </div>

        <button className={styles.buyBtn} onClick={onBuy}>
          {t.buyPro}
        </button>

        <div className={styles.activationSection}>
          <p className={styles.hasCodeText}>{t.haveCode}</p>
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
              aria-label={t.activate || "Activate PRO"}
              data-testid="activate-pro-btn"
            >
              {isValidating ? <span className={styles.spinner}></span> : <FaArrowRight />}
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