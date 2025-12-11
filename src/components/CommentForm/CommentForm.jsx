import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import CommentInfoSection from './CommentInfoSection/CommentInfoSection'
import ExportSettingsSection from './ExportSettingsSection/ExportSettingsSection'
import styles from './CommentForm.module.css'

function CommentForm({ onGenerate, exportSettings, updateExportSettings }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: 'user123',
    commentText: t('defaultCommentText'),
    likes: 120,
    avatar: null,
    verified: false,
    date: ''
  })

  const presetSizes = [
    { width: 1080, height: 600, label: 'Standard (1080×600)' },
    { width: 1200, height: 630, label: 'Social Media (1200×630)' },
    { width: 800, height: 600, label: 'Square-ish (800×600)' },
    { width: 1920, height: 1080, label: 'Full HD (1920×1080)' },
    { width: 1080, height: 1920, label: 'Stories (1080×1920)' }
  ]

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'likes' ? parseInt(value) || 0 : value)
    }))
  }, [])

  const handleAvatarSelect = useCallback((avatar) => {
    setFormData(prev => ({ ...prev, avatar }))
  }, [])

  const handleExportSettingsChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'format') {
      updateExportSettings({ format: value })
    } else if (name === 'presetSize') {
      const selectedSize = presetSizes.find(size => 
        `${size.width}×${size.height}` === value
      )
      if (selectedSize) {
        updateExportSettings({
          width: selectedSize.width,
          height: selectedSize.height,
          customSize: false
        })
      }
    } else if (name === 'customWidth' || name === 'customHeight') {
      const newValue = parseInt(value) || 0
      updateExportSettings(prev => ({
        ...prev,
        [name === 'customWidth' ? 'width' : 'height']: Math.max(100, Math.min(newValue, 5000)),
        customSize: true
      }))
    } else if (name === 'useCustomSize') {
      updateExportSettings({ customSize: checked })
    }
  }, [updateExportSettings, presetSizes])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.commentText.trim()) {
      alert(t('alertFillFields'))
      return
    }
    
    onGenerate(formData)
  }, [formData, onGenerate, t])

  const handleResetForm = useCallback(() => {
    setFormData({
      username: 'user123',
      commentText: t('defaultCommentText'),
      likes: 0,
      avatar: null,
      verified: false,
      date: ''
    })
    updateExportSettings({
      format: 'png',
      width: 1080,
      height: 600,
      customSize: false
    })
  }, [t, updateExportSettings])

  return (
    <div className={styles.formContainer}>
      <form className={styles.simpleForm} onSubmit={handleSubmit}>
        <CommentInfoSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleAvatarSelect={handleAvatarSelect}
        />
        <ExportSettingsSection
          exportSettings={exportSettings}
          handleExportSettingsChange={handleExportSettingsChange}
          presetSizes={presetSizes}
        />
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            {t('generate')}
          </button>
          
          <button 
            type="button" 
            className={styles.resetBtn}
            onClick={handleResetForm}
          >
            {t('clearAll')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm