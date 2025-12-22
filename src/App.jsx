import { useState, useEffect, useCallback } from 'react'
import { FaTrash, FaChevronDown, FaPalette } from 'react-icons/fa'
import CommentForm from './components/CommentForm/CommentForm'
import CommentImageExporter from './components/CommentImageExporter/CommentImageExporter'
import { loadComments, saveComment, clearComments } from './utils/storage'
import { translations } from './utils/translations'
import styles from './App.module.css'

const LANGUAGES = [
  { code: 'uk', label: 'Українська', countryCode: 'ua' },
  { code: 'en', label: 'English', countryCode: 'us' },
  { code: 'pl', label: 'Polski', countryCode: 'pl' },
  { code: 'fr', label: 'Français', countryCode: 'fr' }
];

function App() {
  const [comments, setComments] = useState([])
  const [currentComment, setCurrentComment] = useState(null)
  const [language, setLanguage] = useState('uk')
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  
  const t = translations[language];

  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    width: 1080,
    height: 'auto',
    customSize: false
  })

  useEffect(() => {
    const savedComments = loadComments()
    setComments(savedComments)
  }, [])

  const handleGenerateComment = useCallback((commentData) => {
    let finalDate = commentData.date ? new Date(commentData.date).toISOString() : new Date().toISOString();

    const newComment = {
      ...commentData,
      id: crypto.randomUUID(),
      date: finalDate
    }
    
    const updatedComments = saveComment(newComment)
    setCurrentComment(newComment)
    setComments(updatedComments)
  }, [])

  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);
  
  const selectLanguage = (code) => {
    setLanguage(code);
    setIsLangMenuOpen(false);
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language);

  const FlagIcon = ({ code }) => (
    <img 
      src={`https://flagcdn.com/24x18/${code}.png`} 
      width="20" 
      height="15" 
      alt={code} 
      style={{ borderRadius: '2px', objectFit: 'cover' }}
    />
  );

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{t.appTitle}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
          
          <div className={styles.languageWrapper}>
            <button className={styles.languageButton} onClick={toggleLangMenu}>
              <FlagIcon code={currentLangObj.countryCode} />
              <span>{currentLangObj.label}</span>
              <FaChevronDown size={10} style={{ opacity: 0.5 }} />
            </button>
            
            {isLangMenuOpen && (
              <div className={styles.languageDropdown}>
                {LANGUAGES.map(lang => (
                  <button 
                    key={lang.code}
                    className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`}
                    onClick={() => selectLanguage(lang.code)}
                  >
                    <FlagIcon code={lang.countryCode} />
                    <span>{lang.label}</span>
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
              />
            </div>
            
            <div className={styles.clearButtonWrapper}>
              <button 
                className={styles.clearButton}
                disabled={comments.length === 0}
                onClick={() => {
                  if (comments.length === 0) return;
                  if (window.confirm(language === 'uk' ? 'Видалити історію?' : 'Clear history?')) {
                    clearComments()
                    setComments([])
                    setCurrentComment(null)
                  }
                }}
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
              />
            ) : (
              <div className={styles.emptyState}>
                <FaPalette className={styles.emptyEmoji} />
                {t.emptyState}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App