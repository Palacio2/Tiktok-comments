import { useState, useEffect, useCallback } from 'react'
import CommentForm from './components/CommentForm/CommentForm'
import CommentImageExporter from './components/CommentImageExporter/CommentImageExporter'
import { loadComments, saveComment, clearComments } from './utils/storage'
import styles from './App.module.css'

function App() {
  const [comments, setComments] = useState([])
  const [currentComment, setCurrentComment] = useState(null)
  const [language, setLanguage] = useState('uk')
  const [exportSettings, setExportSettings] = useState({
    format: 'png', // 'png' або 'svg'
    width: 1080,
    height: 600,
    customSize: false
  })

  useEffect(() => {
    const savedComments = loadComments()
    setComments(savedComments)
  }, [])

  const handleGenerateComment = useCallback((commentData) => {
    let finalDate;
    
    if (commentData.date) {
      finalDate = new Date(commentData.date).toISOString();
    } else {
      finalDate = new Date().toISOString();
    }

    const newComment = {
      ...commentData,
      id: crypto.randomUUID(),
      date: finalDate
    }
    
    const updatedComments = saveComment(newComment)
    setCurrentComment(newComment)
    setComments(updatedComments)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'uk' ? 'en' : 'uk')
  }, [])

  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1>TikTok Comment Generator</h1>
            <button 
              className={styles.languageToggle}
              onClick={toggleLanguage}
              aria-label={language === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
            >
              <span className={styles.globeIcon}>🌐</span>
              <span>{language === 'uk' ? 'UA' : 'EN'}</span>
            </button>
          </div>
          <p className={styles.subtitle}>
            {language === 'uk' ? 'Створюйте реалістичні скріншоти коментарів' : 'Create realistic comment screenshots'}
          </p>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.formWrapper}>
            <CommentForm 
              onGenerate={handleGenerateComment} 
              language={language}
              exportSettings={exportSettings}
              updateExportSettings={updateExportSettings}
            />
            
            {comments.length > 0 && (
              <button 
                className={styles.clearButton}
                onClick={() => {
                  if (window.confirm(language === 'uk' ? 'Видалити історію?' : 'Clear history?')) {
                    clearComments()
                    setComments([])
                    setCurrentComment(null)
                  }
                }}
              >
                {language === 'uk' ? 'Очистити історію' : 'Clear history'}
              </button>
            )}
          </div>

          {currentComment && (
            <div className={styles.previewWrapper}>
              <CommentImageExporter 
                comment={currentComment} 
                language={language}
                exportSettings={exportSettings}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App