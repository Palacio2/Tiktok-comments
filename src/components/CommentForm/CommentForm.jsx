import { useState, useCallback } from 'react'
import AvatarUploader from '../AvatarUploader/AvatarUploader'
import AiGeneratorModal from '../AiGeneratorModal/AiGeneratorModal'
import { validateCommentData } from '../../utils/helpers'
import styles from './CommentForm.module.css'

function CommentForm({ onGenerate, language, translations: t, exportSettings, updateExportSettings }) {
  const [formData, setFormData] = useState({
    username: 'user123',
    commentText: 'TikTok Comment Generator! 🔥',
    likes: 120,
    avatar: null,
    verified: false,
    date: ''
  })
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [tempCustomWidth, setTempCustomWidth] = useState(1080)
  const [tempCustomHeight, setTempCustomHeight] = useState(600)

  const presetSizes = [
    { width: 1080, height: 'auto', label: 'Standard (1080×auto)' },
    { width: 1200, height: 'auto', label: 'Social Media (1200×auto)' },
    { width: 'custom', height: 'custom', label: 'Custom Size' }
  ]

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'likes' ? parseInt(value) || 0 : value)
    }))
  }, [])

  const handleAiApply = (text) => {
    setFormData(prev => ({ ...prev, commentText: text }));
  };

  const handleAvatarSelect = useCallback((avatar) => {
    setFormData(prev => ({ ...prev, avatar }))
  }, [])

  const handleExportSettingsChange = useCallback((e) => {
    const { name, value } = e.target
    
    if (name === 'presetSize') {
      const selectedSize = presetSizes.find(size => `${size.width}×${size.height}` === value)
      
      if (selectedSize) {
        if (selectedSize.width === 'custom') {
          updateExportSettings({ 
            width: tempCustomWidth, 
            height: tempCustomHeight, 
            customSize: true 
          })
        } else {
          updateExportSettings({
            width: selectedSize.width,
            height: selectedSize.height,
            customSize: false
          })
        }
      }
    } else if (name === 'customWidth') {
        const val = parseInt(value) || 100
        setTempCustomWidth(val)
        if (exportSettings.customSize) updateExportSettings({ width: val, customSize: true })
    } else if (name === 'customHeight') {
        const val = parseInt(value) || 100
        setTempCustomHeight(val)
        if (exportSettings.customSize) updateExportSettings({ height: val, customSize: true })
    }
  }, [updateExportSettings, presetSizes, exportSettings.customSize, tempCustomWidth, tempCustomHeight])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const validation = validateCommentData(formData);
    if (!validation.isValid) {
      alert(Object.values(validation.errors).join('\n'));
      return;
    }
    onGenerate(formData)
  }, [formData, onGenerate])

  const handleResetForm = useCallback(() => {
    setFormData({
      username: 'user123',
      commentText: '',
      likes: 0,
      avatar: null,
      verified: false,
      date: ''
    })
  }, [])

  const getCurrentPresetValue = () => exportSettings.customSize ? 'custom×custom' : `${exportSettings.width}×${exportSettings.height}`

  return (
    <div className={styles.formContainer}>
      <AiGeneratorModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onApply={handleAiApply}
        language={language}
        translations={t} 
      />

      <form className={styles.simpleForm} onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t.info}</h3>
          
          <div className={styles.formRow}>
            <label>{t.username}</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </div>
          
          <div className={styles.checkboxRow}>
             <label className={styles.checkboxLabel}>
              <span>{t.verified}</span>
              <input type="checkbox" name="verified" checked={formData.verified} onChange={handleInputChange} />
            </label>
          </div>
          
          <div className={styles.formRow}>
            <label>{t.avatar}</label>
            <AvatarUploader onAvatarSelect={handleAvatarSelect} currentAvatar={formData.avatar} />
          </div>

          <div className={styles.formRow}>
             <div className={styles.labelWithAi}>
                <label htmlFor="commentText">{t.text}</label>
                <button type="button" className={styles.aiButton} onClick={() => setIsAiModalOpen(true)}>
                  {t.aiBtn}
                </button>
             </div>
            <textarea id="commentText" name="commentText" value={formData.commentText} onChange={handleInputChange} rows="4"/>
          </div>
          
          <div className={styles.formRow}>
            <label>{t.likes}</label>
            <input type="number" name="likes" value={formData.likes} onChange={handleInputChange} />
          </div>
          
          <div className={styles.formRow}>
             <label>{t.date}</label>
             <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t.export}</h3>
          <div className={styles.formRow}>
            <label>{t.size}</label>
            <select name="presetSize" value={getCurrentPresetValue()} onChange={handleExportSettingsChange} className={styles.selectInput}>
              {presetSizes.map(size => (
                <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>{size.label}</option>
              ))}
            </select>
          </div>
          {(exportSettings.customSize || getCurrentPresetValue() === 'custom×custom') && (
            <div className={styles.dimensionsRow}>
              <input type="number" name="customWidth" value={exportSettings.customSize ? exportSettings.width : tempCustomWidth} onChange={handleExportSettingsChange} />
              <span className={styles.dimensionSeparator}>×</span>
              <input type="number" name="customHeight" value={exportSettings.customSize ? exportSettings.height : tempCustomHeight} onChange={handleExportSettingsChange} />
            </div>
          )}
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>{t.create}</button>
          <button type="button" className={styles.resetBtn} onClick={handleResetForm}>{t.reset}</button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm