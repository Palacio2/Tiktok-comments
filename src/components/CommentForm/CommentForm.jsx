import { useState, useCallback } from 'react'
import AvatarUploader from '../AvatarUploader/AvatarUploader'
import AiGeneratorModal from '../AiGeneratorModal/AiGeneratorModal'
import styles from './CommentForm.module.css'
import { useCommentForm } from '../../hooks/useCommentForm'
import { FormInput, ProCheckbox, AiLabelButton } from '../UI/FormElements'
import { FaReply, FaTrash, FaLock } from 'react-icons/fa'

function CommentForm({ onGenerate, language, translations: t, exportSettings, updateExportSettings, isPro, onOpenPro }) {
  const { 
    formData, isAiModalOpen, setIsAiModalOpen, 
    handleInputChange, handleReplyChange, toggleReplySection,
    setAvatar, setReplyAvatar,
    handleAiApply, handleAiTextClick, 
    handleSubmit, handleResetForm 
  } = useCommentForm(onGenerate, isPro, onOpenPro);

  const [tempCustomWidth, setTempCustomWidth] = useState(1080)
  const [tempCustomHeight, setTempCustomHeight] = useState(600)

  const presetSizes = [
    { width: 1080, height: 'auto', label: 'Standard (1080×auto)' },
    { width: 1200, height: 'auto', label: 'Social Media (1200×auto)' },
    { width: 'custom', height: 'custom', label: 'Custom Size' }
  ]

  const handleExportSettingsChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'presetSize') {
      const selectedSize = presetSizes.find(size => `${size.width}×${size.height}` === value);
      if (selectedSize) {
        if (selectedSize.width === 'custom') {
          if (!isPro) { onOpenPro(); return; }
          updateExportSettings({ width: tempCustomWidth, height: tempCustomHeight, customSize: true });
        } else {
          updateExportSettings({ width: selectedSize.width, height: selectedSize.height, customSize: false });
        }
      }
    } else if (name === 'customWidth') {
        const val = parseInt(value) || 100;
        setTempCustomWidth(val);
        if (exportSettings.customSize) updateExportSettings({ width: val, customSize: true });
    } else if (name === 'customHeight') {
        const val = parseInt(value) || 100;
        setTempCustomHeight(val);
        if (exportSettings.customSize) updateExportSettings({ height: val, customSize: true });
    }
  }, [updateExportSettings, presetSizes, exportSettings.customSize, tempCustomWidth, tempCustomHeight, isPro, onOpenPro]);

  const getCurrentPresetValue = () => exportSettings.customSize ? 'custom×custom' : `${exportSettings.width}×${exportSettings.height}`;

  // Допоміжна функція для рендеру полів (використовується для основного коментаря та відповіді)
  const renderFields = (data, handler, avatarHandler, isReply = false) => (
    <>
      <FormInput label={t.username} name="username" value={data.username} onChange={handler} />
      
      <ProCheckbox 
        label={t.verified} name="verified" checked={data.verified} 
        onChange={handler} isPro={isPro} onLockClick={onOpenPro} 
      />
      
      <div className={styles.formRow}>
        <label>{t.avatar}</label>
        <AvatarUploader 
          onAvatarSelect={avatarHandler} currentAvatar={data.avatar}
          language={language} t={t} isPro={isPro} onOpenPro={onOpenPro}
        />
      </div>

      <div className={styles.formRow}>
        <AiLabelButton 
            label={t.text} 
            buttonText={t.aiBtn} 
            onClick={() => handleAiTextClick(isReply ? 'reply' : 'main')} 
            isPro={isPro} 
        />
        <textarea name="commentText" value={data.commentText} onChange={handler} rows="3"/>
      </div>
      
      <div style={{display: 'flex', gap: 10}}>
        <FormInput label={t.likes} name="likes" type="number" value={data.likes} onChange={handler} />
        <FormInput label={t.date} name="date" type="date" value={data.date} onChange={handler} />
      </div>
    </>
  );

  return (
    <div className={styles.formContainer}>
      <AiGeneratorModal 
        isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} 
        onApply={handleAiApply} language={language}
      />

      <form className={styles.simpleForm} onSubmit={handleSubmit}>
        
        {/* === СЕКЦІЯ 1: ОСНОВНИЙ КОМЕНТАР === */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t.info}</h3>
          {renderFields(formData, handleInputChange, setAvatar, false)}
          {/* ❌ Поле 'replyLabelText' видалено звідси */}
        </div>

        {/* === КНОПКА ДОДАТИ ВІДПОВІДЬ === */}
        <button 
            type="button" 
            onClick={toggleReplySection}
            style={{
                width: '100%', padding: '14px', borderRadius: '12px', 
                border: '2px dashed #ddd',
                background: formData.showReply ? '#fff0f2' : 'white',
                color: formData.showReply ? '#FE2C55' : '#555',
                fontWeight: 'bold', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s'
            }}
        >
            {formData.showReply ? <><FaTrash /> {t.removeReplyThread || 'Remove Reply'}</> : <><FaReply /> {t.addReplyThread || 'Add Reply Thread'}</>}
        </button>

        {/* === СЕКЦІЯ 2: ВІДПОВІДЬ (ВКЛАДЕНИЙ КОМЕНТАР) === */}
        {formData.showReply && (
            <div className={styles.formSection} style={{ borderLeft: '4px solid #FE2C55', background: '#fffcfc' }}>
                <h3 className={styles.sectionTitle} style={{color: '#FE2C55'}}>{t.replySection || 'Reply Info'}</h3>
                {renderFields(formData.reply, handleReplyChange, setReplyAvatar, true)}
            </div>
        )}

        {/* === ЕКСПОРТ === */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t.export}</h3>
          
          <div className={styles.formRow}>
            <label>{t.mood || 'Theme'}</label>
            <div style={{display: 'flex', gap: 10}}>
                <button type="button" 
                  onClick={() => updateExportSettings({ isDark: false })}
                  style={{flex:1, padding: 10, borderRadius: 8, border: !exportSettings.isDark ? '2px solid #25F4EE' : '1px solid #ddd', background: 'white', cursor: 'pointer'}}
                >☀️ Light</button>
                <button type="button" 
                  onClick={() => updateExportSettings({ isDark: true })}
                  style={{flex:1, padding: 10, borderRadius: 8, border: exportSettings.isDark ? '2px solid #25F4EE' : '1px solid #ddd', background: '#333', color: 'white', cursor: 'pointer'}}
                >🌙 Dark</button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Format</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => updateExportSettings({ format: 'png' })}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: exportSettings.format === 'png' ? '2px solid #25F4EE' : '1px solid #ddd', background: exportSettings.format === 'png' ? '#f0fffe' : 'white', fontWeight: '600', cursor: 'pointer' }}
              >PNG</button>
              <button 
                type="button"
                onClick={() => !isPro ? onOpenPro() : updateExportSettings({ format: 'svg' })}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: exportSettings.format === 'svg' ? '2px solid #FE2C55' : '1px solid #ddd', background: !isPro ? '#f5f5f5' : (exportSettings.format === 'svg' ? '#fff0f2' : 'white'), color: !isPro ? '#666' : 'inherit', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >SVG {!isPro && <FaLock size={12} />}</button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>{t.size}</label>
            <select name="presetSize" value={getCurrentPresetValue()} onChange={handleExportSettingsChange} className={styles.selectInput}>
              {presetSizes.map(size => (
                <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>
                  {size.label} {size.width === 'custom' && !isPro ? `(${t.onlyPro || 'PRO'})` : ''}
                </option>
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

export default CommentForm;