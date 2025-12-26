import { useState, useCallback } from 'react';
import { FaTrash, FaPalette, FaCrown, FaChevronDown } from 'react-icons/fa';
import CommentForm from './components/CommentForm/CommentForm';
import CommentImageExporter from './components/CommentImageExporter/CommentImageExporter';
import SubscriptionModal from './components/SubscriptionModal/SubscriptionModal';
import InfoSection from './components/InfoSection/InfoSection';
import { FlagIcon } from './components/UI/FlagIcon';
import { ProTimer } from './components/UI/ProTimer'; // ✅ Імпорт таймера
import { useLanguage, usePro, useHistory } from './hooks/useAppHooks';
import styles from './App.module.css';

function App() {
  const { language, t, isLangMenuOpen, currentLangObj, LANGUAGES, toggleLangMenu, selectLanguage } = useLanguage();
  // ✅ Деструктуризуємо expirationDate
  const { isPro, expirationDate, isSubModalOpen, setIsSubModalOpen, handleBuyPro, activatePro, isValidating } = usePro();
  const { comments, currentComment, handleGenerateComment, clearHistory } = useHistory();

  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    width: 1080,
    height: 'auto',
    customSize: false,
    isDark: false
  });

  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <div className={styles.app}>
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)}
        onBuy={handleBuyPro} 
        onActivate={activatePro}
        isValidating={isValidating}
        translations={t}
      />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{t.appTitle}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={isPro ? styles.proBadge : styles.upgradeBtn} 
              onClick={() => !isPro && setIsSubModalOpen(true)}
              style={isPro ? { minWidth: '140px', justifyContent: 'center', cursor: 'default' } : {}}
            >
              {isPro ? (
                 <ProTimer date={expirationDate} t={t} /> 
              ) : (
                 <> <FaCrown /> {t.buyPro} </>
              )}
            </button>

            <div className={styles.languageWrapper}>
              <button className={styles.languageButton} onClick={toggleLangMenu}>
                <FlagIcon code={currentLangObj.countryCode} />
                <span>{currentLangObj.label}</span>
                <FaChevronDown size={10} />
              </button>
              
              {isLangMenuOpen && (
                <div className={styles.languageDropdown}>
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang.code} 
                      className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`} 
                      onClick={() => selectLanguage(lang.code)}
                    >
                      <FlagIcon code={lang.countryCode} /> <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.formWrapper}>
            <div className={styles.scrollableContent}>
              <CommentForm 
                onGenerate={handleGenerateComment} 
                language={language}
                translations={t}
                exportSettings={exportSettings}
                updateExportSettings={updateExportSettings}
                isPro={isPro}
                onOpenPro={() => setIsSubModalOpen(true)}
              />
            </div>
            
            <button 
              className={styles.clearButton}
              disabled={comments.length === 0}
              onClick={() => clearHistory(t, language)}
            >
              <FaTrash /> {t.clearHistory}
            </button>
          </section>

          <section className={styles.previewWrapper}>
            {currentComment ? (
              <CommentImageExporter 
                comment={currentComment} 
                language={language}
                translations={t}
                exportSettings={exportSettings}
                isPro={isPro}
                onOpenPro={() => setIsSubModalOpen(true)}
              />
            ) : (
              <div className={styles.emptyState}>
                <FaPalette className={styles.emptyEmoji} />
                <p>{t.emptyState}</p>
              </div>
            )}
          </section>
        </main>
        
        <InfoSection t={t} />
      </div>
    </div>
  );
}

export default App;