import { useState, useCallback } from 'react'
import AvatarUploader from '../AvatarUploader/AvatarUploader'
import styles from './CommentForm.module.css'

function CommentForm({ onGenerate, language, exportSettings, updateExportSettings }) {
  const [formData, setFormData] = useState({
    username: 'user123',
    commentText: language === 'uk' ? 'Це просто вау! 🔥' : 'This is awesome! 🔥',
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
      alert(language === 'uk' ? 'Будь ласка, заповніть ім\'я та текст коментаря' : 'Please fill in username and comment text')
      return
    }
    
    onGenerate(formData)
  }, [formData, onGenerate, language])

  const handleResetForm = useCallback(() => {
    setFormData({
      username: 'user123',
      commentText: language === 'uk' ? 'Це просто вау! 🔥' : 'This is awesome! 🔥',
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
  }, [language, updateExportSettings])

  return (
    <div className={styles.formContainer}>
      <form className={styles.simpleForm} onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            {language === 'uk' ? 'Інформація про коментар' : 'Comment Information'}
          </h3>
          
          <div className={styles.formRow}>
            <label htmlFor="username">
              {language === 'uk' ? 'Ім\'я користувача:' : 'Username:'}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="@username"
            />
          </div>
          
          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <span>
                {language === 'uk' ? 'Верифікація (синя галочка)' : 'Verification (blue checkmark)'}
              </span>
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleInputChange}
              />
            </label>
          </div>
          
          <div className={styles.formRow}>
            <label>
              {language === 'uk' ? 'Аватар профілю:' : 'Profile Avatar:'}
            </label>
            <AvatarUploader 
              onAvatarSelect={handleAvatarSelect}
              currentAvatar={formData.avatar}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="date">
              {language === 'uk' ? 'Дата коментаря:' : 'Comment Date:'}
            </label>
            <input
              type="date" 
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={styles.dateInput}
            />
            <small className={styles.dateHint}>
              {language === 'uk' 
                ? 'Пусте поле = поточна дата. Вибрана дата = формат "MM-DD".'
                : 'Empty = current date. Selected date = "MM-DD" format.'}
            </small>
          </div>
          
          <div className={styles.formRow}>
            <label htmlFor="commentText">
              {language === 'uk' ? 'Текст коментаря:' : 'Comment Text:'}
            </label>
            <textarea
              id="commentText"
              name="commentText"
              value={formData.commentText}
              onChange={handleInputChange}
              placeholder={language === 'uk' ? 'Напишіть коментар...' : 'Write a comment...'}
              rows="4"
            />
          </div>
          
          <div className={styles.formRow}>
            <label htmlFor="likes">
              {language === 'uk' ? 'Кількість лайків:' : 'Number of Likes:'}
            </label>
            <input
              type="number"
              id="likes"
              name="likes"
              value={formData.likes}
              onChange={handleInputChange}
              min="0"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            {language === 'uk' ? 'Налаштування експорту' : 'Export Settings'}
          </h3>
          
          <div className={styles.formRow}>
            <label htmlFor="format">
              {language === 'uk' ? 'Формат файлу:' : 'File Format:'}
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={exportSettings.format === 'png'}
                  onChange={handleExportSettingsChange}
                />
                <span>PNG (зображення)</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="svg"
                  checked={exportSettings.format === 'svg'}
                  onChange={handleExportSettingsChange}
                />
                <span>SVG (вектор)</span>
              </label>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <label htmlFor="presetSize">
              {language === 'uk' ? 'Розмір зображення:' : 'Image Size:'}
            </label>
            <select
              id="presetSize"
              name="presetSize"
              value={`${exportSettings.width}×${exportSettings.height}`}
              onChange={handleExportSettingsChange}
              className={styles.selectInput}
              disabled={exportSettings.customSize}
            >
              {presetSizes.map(size => (
                <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <span>
                {language === 'uk' ? 'Власний розмір' : 'Custom Size'}
              </span>
              <input
                type="checkbox"
                name="useCustomSize"
                checked={exportSettings.customSize}
                onChange={handleExportSettingsChange}
              />
            </label>
          </div>
          
          {exportSettings.customSize && (
            <div className={styles.dimensionsRow}>
              <div className={styles.dimensionInput}>
                <label htmlFor="customWidth">
                  {language === 'uk' ? 'Ширина:' : 'Width:'}
                </label>
                <input
                  type="number"
                  id="customWidth"
                  name="customWidth"
                  value={exportSettings.width}
                  onChange={handleExportSettingsChange}
                  min="100"
                  max="5000"
                  step="10"
                />
                <span>px</span>
              </div>
              <div className={styles.dimensionSeparator}>×</div>
              <div className={styles.dimensionInput}>
                <label htmlFor="customHeight">
                  {language === 'uk' ? 'Висота:' : 'Height:'}
                </label>
                <input
                  type="number"
                  id="customHeight"
                  name="customHeight"
                  value={exportSettings.height}
                  onChange={handleExportSettingsChange}
                  min="100"
                  max="5000"
                  step="10"
                />
                <span>px</span>
              </div>
            </div>
          )}
          
          <div className={styles.sizePreview}>
            <div className={styles.sizePreviewBox}>
              <span>{exportSettings.width} × {exportSettings.height} px</span>
            </div>
            <small>
              {exportSettings.format === 'svg' 
                ? language === 'uk' 
                  ? 'SVG — векторний формат, можна масштабувати без втрат якості' 
                  : 'SVG — vector format, scalable without quality loss'
                : language === 'uk'
                  ? 'PNG — растровий формат з підтримкою прозорості'
                  : 'PNG — raster format with transparency support'}
            </small>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            {language === 'uk' ? 'Згенерувати' : 'Generate'}
          </button>
          
          <button 
            type="button" 
            className={styles.resetBtn}
            onClick={handleResetForm}
          >
            {language === 'uk' ? 'Очистити все' : 'Clear All'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm