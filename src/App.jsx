import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header/Header'
import CommentForm from './components/CommentForm/CommentForm'
import CommentImageExporter from './components/CommentImageExporter/CommentImageExporter'
import { loadComments, saveComment, clearComments } from './utils/storage'
import styles from './App.module.css'

function App() {
  const { t } = useTranslation();
  const [comments, setComments] = useState([])
  const [currentComment, setCurrentComment] = useState(null)
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

  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header />

        <div className={styles.mainContent}>
          <div className={styles.formWrapper}>
            <CommentForm 
              onGenerate={handleGenerateComment} 
              exportSettings={exportSettings}
              updateExportSettings={updateExportSettings}
            />
            
            {comments.length > 0 && (
              <button 
                className={styles.clearButton}
                onClick={() => {
                  if (window.confirm(t('confirmClearHistory'))) {
                    clearComments()
                    setComments([])
                    setCurrentComment(null)
                  }
                }}
              >
                {t('clearHistory')}
              </button>
            )}
          </div>

          {currentComment && (
            <div className={styles.previewWrapper}>
              <CommentImageExporter 
                comment={currentComment} 
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