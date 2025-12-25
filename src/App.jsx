import { useState, useCallback } from 'react'
import { FaTrash, FaChevronDown, FaPalette, FaCrown } from 'react-icons/fa'
import CommentForm from './components/CommentForm/CommentForm'
import CommentImageExporter from './components/CommentImageExporter/CommentImageExporter'
import SubscriptionModal from './components/SubscriptionModal/SubscriptionModal'
import InfoSection from './components/InfoSection/InfoSection'
import { useLanguage, usePro, useHistory, useTheme } from './hooks/useAppHooks'
import styles from './App.module.css'

function App() {
  const { language, t, isLangMenuOpen, currentLangObj, LANGUAGES, toggleLangMenu, selectLanguage } = useLanguage();
  
  // 🆕 Отримуємо isValidating з хука
  const { isPro, isSubModalOpen, setIsSubModalOpen, handleBuyPro, activatePro, isValidating } = usePro();
  
  const { comments, currentComment, handleGenerateComment, clearHistory } = useHistory();
  const { theme, toggleTheme } = useTheme();

  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    width: 1080,
    height: 'auto',
    customSize: false,
    isDark: false 
  });

  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }))
  }, []);

  const FlagIcon = ({ code }) => (
    <img src={`https://flagcdn.com/24x18/${code}.png`} width="20" height="15" alt={code} style={{ borderRadius: '2px', objectFit: 'cover' }} />
  );

  return (
    <div className={styles.app}>
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)}
        onBuy={handleBuyPro} 
        onActivate={activatePro}
        isValidating={isValidating} // 🆕 Передаємо стан завантаження
        translations={t}
      />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{t.appTitle}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
          
          <div className={styles.languageWrapper}>
             <button 
              onClick={toggleTheme} 
              style={{
                background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginRight: '10px', color: 'var(--text-main)'
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {isPro ? (
               <div style={{ padding: '6px 12px', background: 'gold', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', color: '#8a6d00', marginRight: '10px' }}>
                 <FaCrown /> PRO
               </div>
            ) : (
               <button onClick={() => setIsSubModalOpen(true)} style={{ marginRight: '10px', border: 'none', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                 <FaCrown /> PRO
               </button>
            )}

            <button className={styles.languageButton} onClick={toggleLangMenu}>
              <FlagIcon code={currentLangObj.countryCode} />
              <span>{currentLangObj.label}</span>
              <FaChevronDown size={10} style={{ opacity: 0.5 }} />
            </button>
            
            {isLangMenuOpen && (
              <div className={styles.languageDropdown}>
                {LANGUAGES.map(lang => (
                  <button key={lang.code} className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`} onClick={() => selectLanguage(lang.code)}>
                    <FlagIcon code={lang.countryCode} /> <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.formWrapper}>
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
            <div className={styles.clearButtonWrapper}>
              <button 
                className={styles.clearButton}
                disabled={comments.length === 0}
                onClick={() => clearHistory(t, language)}
              >
                <FaTrash /> {t.clearHistory}
              </button>
            </div>
          </div>

          <div className={styles.previewWrapper}>
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
                {t.emptyState}
              </div>
            )}
          </div>
        </div>
        
        <InfoSection t={t} />
      </div>
    </div>
  )
}

export default App