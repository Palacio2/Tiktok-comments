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

  const [tempCustomWidth, setTempCustomWidth] = useState(1080)
  const [tempCustomHeight, setTempCustomHeight] = useState(600)

  const presetSizes = [
    { width: 1080, height: 'auto', label: 'Standard (1080×auto)' },
    { width: 1200, height: 'auto', label: 'Social Media (1200×auto)' },
    { width: 800, height: 'auto', label: 'Square-ish (800×auto)' },
    { width: 1920, height: 'auto', label: 'Full HD (1920×auto)' },
    { width: 1080, height: 1920, label: 'Stories (1080×1920)' },
    { width: 'custom', height: 'custom', label: 'Custom Size' }
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
      if (value === 'custom×custom') {
        // Якщо вибрали "Custom Size"
        updateExportSettings({
          width: tempCustomWidth,
          height: tempCustomHeight,
          customSize: true
        })
      } else {
        const selectedSize = presetSizes.find(size => 
          `${size.width}×${size.height}` === value
        )
        if (selectedSize) {
          updateExportSettings({
            width: selectedSize.width === 'custom' ? tempCustomWidth : selectedSize.width,
            height: selectedSize.height === 'custom' ? tempCustomHeight : selectedSize.height,
            customSize: selectedSize.width === 'custom'
          })
        }
      }
    } else if (name === 'customWidth') {
      const newValue = parseInt(value) || 100
      setTempCustomWidth(newValue)
      if (exportSettings.customSize) {
        updateExportSettings({
          width: newValue,
          customSize: true
        })
      }
    } else if (name === 'customHeight') {
      const newValue = parseInt(value) || 100
      setTempCustomHeight(newValue)
      if (exportSettings.customSize) {
        updateExportSettings({
          height: newValue,
          customSize: true
        })
      }
    }
  }, [updateExportSettings, presetSizes, exportSettings.customSize, tempCustomWidth, tempCustomHeight])

  const handleCustomSizeToggle = useCallback(() => {
    if (exportSettings.customSize) {
      // Переключаємо на стандартний розмір
      updateExportSettings({
        width: 1080,
        height: 'auto',
        customSize: false
      })
    } else {
      // Переключаємо на власний розмір
      updateExportSettings({
        width: tempCustomWidth,
        height: tempCustomHeight,
        customSize: true
      })
    }
  }, [exportSettings.customSize, updateExportSettings, tempCustomWidth, tempCustomHeight])

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
    setTempCustomWidth(1080)
    setTempCustomHeight(600)
    updateExportSettings({
      format: 'png',
      width: 1080,
      height: 'auto',
      customSize: false
    })
  }, [language, updateExportSettings])

  const getCurrentPresetValue = () => {
    if (exportSettings.customSize) {
      return 'custom×custom'
    }
    return `${exportSettings.width}×${exportSettings.height}`
  }

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
              value={getCurrentPresetValue()}
              onChange={handleExportSettingsChange}
              className={styles.selectInput}
            >
              {presetSizes.map(size => (
                <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          
          {(exportSettings.customSize || getCurrentPresetValue() === 'custom×custom') && (
            <div className={styles.dimensionsRow}>
              <div className={styles.dimensionInput}>
                <label htmlFor="customWidth">
                  {language === 'uk' ? 'Ширина:' : 'Width:'}
                </label>
                <input
                  type="number"
                  id="customWidth"
                  name="customWidth"
                  value={exportSettings.customSize ? exportSettings.width : tempCustomWidth}
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
                  value={exportSettings.customSize ? exportSettings.height : tempCustomHeight}
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
              <span>
                {exportSettings.width} × 
                {exportSettings.customSize ? exportSettings.height : 'auto'} px
                {!exportSettings.customSize && (
                  <span className={styles.autoBadge}>
                    {language === 'uk' ? ' (авто)' : ' (auto)'}
                  </span>
                )}
              </span>
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
            {!exportSettings.customSize && (
              <small className={styles.autoHint}>
                {language === 'uk' 
                  ? 'Висота автоматично підлаштовується під текст коментаря'
                  : 'Height automatically adjusts to comment content'}
              </small>
            )}
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