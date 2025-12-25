import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCrown, FaCheck, FaTimes, FaKey, FaArrowRight } from 'react-icons/fa'; // Додав FaArrowRight
import styles from './SubscriptionModal.module.css';

function SubscriptionModal({ isOpen, onClose, onBuy, onActivate, isValidating, translations: t }) {
  const [accessCode, setAccessCode] = useState('');
  // Стейт для статусу: { type: 'success' | 'error', text: '' }
  const [status, setStatus] = useState(null);

  // Скидання при відкритті
  useEffect(() => {
    if (isOpen) {
      setAccessCode('');
      setStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActivateClick = async () => {
    if (!accessCode.trim()) return;
    
    setStatus(null); // Очистити попередній статус

    const success = await onActivate(accessCode);
    
    if (success) {
      setStatus({ type: 'success', text: t.codeSuccess || 'Success! PRO Activated' });
      setAccessCode('');
      // Можна додати закриття через тайм-аут, якщо хочете
    } else {
      setStatus({ type: 'error', text: t.codeError || 'Invalid code. Try again.' });
    }
  };

  // Активація по натисканню Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && accessCode.trim() && !isValidating) {
      handleActivateClick();
    }
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
          <div className={styles.featureItem}><div className={styles.checkIcon}><FaCheck /></div><span>{t.proFeature1}</span></div>
          <div className={styles.featureItem}><div className={styles.checkIcon}><FaCheck /></div><span>{t.proFeatureNoWatermark}</span></div>
          <div className={styles.featureItem}><div className={styles.checkIcon}><FaCheck /></div><span>{t.proFeature3}</span></div>
          <div className={styles.featureItem}><div className={styles.checkIcon}><FaCheck /></div><span>{t.proFeatureVerified}</span></div>
          <div className={styles.featureItem}><div className={styles.checkIcon}><FaCheck /></div><span>{t.proFeatureCustom}</span></div>
        </div>

        <button className={styles.buyBtn} onClick={onBuy}>{t.buyPro}</button>

        <div className={styles.activationSection}>
            <p className={styles.activationTitle}>{t.haveCode}</p>
            
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  {/* Інпут з динамічним класом для помилки */}
                  <input 
                      type="text" 
                      placeholder={t.codePlaceholder || "Enter code..."}
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        if (status) setStatus(null); // Приховуємо помилку при вводі
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
                    {isValidating ? (
                      '...' 
                    ) : (
                      <>
                        {t.activate} <FaArrowRight />
                      </>
                    )}
                </button>
            </div>

            {/* Блок повідомлення про статус (замість alert) */}
            {status && (
              <div className={`${styles.statusMessage} ${status.type === 'success' ? styles.success : styles.error}`}>
                {status.type === 'success' ? '🎉' : '⚠️'} {status.text}
              </div>
            )}
        </div>
        
        <button className={styles.restoreBtn} onClick={() => alert('Please contact support to restore purchase.')}>
          {t.restore}
        </button>
      </div>
    </div>,
    document.body
  );
}

export default SubscriptionModal;