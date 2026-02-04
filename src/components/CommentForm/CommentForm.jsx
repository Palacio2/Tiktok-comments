import React, { useCallback } from 'react';

// ВИПРАВЛЕНО: Використовуємо прямі шляхи замість @components щоб уникнути циклічної помилки
import AvatarUploader from '../AvatarUploader/AvatarUploader';
import AiGeneratorModal from '../AiGeneratorModal/AiGeneratorModal';
import { FormInput, ProToggle, AiLabelButton } from '../UI/FormElements';
import { Icons } from '../UI/Icons';

import { useCommentForm, useLanguage } from '@hooks';
import styles from './CommentForm.module.css';

const PRESET_SIZES = [
  { width: 1080, height: 'auto', labelKey: 'Standard (1080×auto)' },
  { width: 1200, height: 'auto', labelKey: 'Social Media (1200×auto)' },
  { width: 'custom', height: 'custom', labelKey: 'custom' } 
];

function CommentForm({ onGenerate, exportSettings, updateExportSettings, isPro, onOpenPro, externalAvatar }) {
  const { t, language } = useLanguage();

  const { 
    formData, isAiModalOpen, setIsAiModalOpen, 
    handleInputChange, toggleVerified, toggleCreator, toggleReplySection,
    setAvatar, handleAiApply, handleAiTextClick, 
    handleSubmit, handleResetForm, activeSection
  } = useCommentForm(onGenerate, isPro, onOpenPro);

  const handleSizeChange = useCallback((e) => {
    const value = e.target.value;
    const selected = PRESET_SIZES.find(s => `${s.width}×${s.height}` === value);
    
    if (selected?.labelKey === 'custom') {
      if (!isPro) return onOpenPro();
      updateExportSettings({ width: 1080, height: 600, customSize: true });
    } else if (selected) {
      updateExportSettings({ width: selected.width, height: selected.height, customSize: false });
    }
  }, [updateExportSettings, isPro, onOpenPro]);

  const handleCustomDimensionChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    const field = name === 'customWidth' ? 'width' : 'height';
    updateExportSettings({ [field]: numValue, customSize: true });
  };

  const renderCommentFields = (data, section = 'main') => (
    <div className={styles.fieldsGroup}>
      <div className={styles.topRow}>
        <AvatarUploader 
           onAvatarSelect={(img) => setAvatar(img, section)} 
           currentAvatar={externalAvatar && section === 'main' ? externalAvatar : data.avatar} 
           isPro={isPro} 
           onOpenPro={onOpenPro} 
        />
        
        <div className={styles.inputsColumn}>
            <FormInput 
                label={t.username} 
                name="username" 
                value={data.username} 
                onChange={(e) => handleInputChange(e, section)} 
            />
            
            <ProToggle 
                label={t.verified}
                checked={data.verified}
                onChange={() => toggleVerified(section)}
                isPro={isPro}
                onLockClick={onOpenPro}
            />

            <ProToggle 
                label={t.isCreator || 'Author'}
                checked={data.isCreator}
                onChange={() => toggleCreator(section)}
                isPro={true}
            />
        </div>
      </div>

      <div className={styles.textAreaWrapper}>
        <AiLabelButton
            label={t.text}
            buttonText={t.aiBtn || "AI Magic"}
            isPro={isPro}
            onClick={() => handleAiTextClick(section)}
        />
        <textarea 
          name="commentText" 
          value={data.commentText} 
          onChange={(e) => handleInputChange(e, section)} 
          rows="4" 
          placeholder={t.textPlaceholder || "..."} 
          className={styles.textarea}
        />
      </div>

      <div className={styles.gridRowCompact}>
        <FormInput 
            label={t.likes} 
            name="likes" 
            type="number" 
            value={data.likes} 
            onChange={(e) => handleInputChange(e, section)} 
        />
        <FormInput 
            label={t.date} 
            name="date" 
            type="text" 
            placeholder="YYYY-MM-DD"
            value={data.date} 
            onChange={(e) => handleInputChange(e, section)} 
        />
      </div>
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <AiGeneratorModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onApply={handleAiApply} 
        language={language}
        initialPrompt={activeSection === 'main' ? formData.commentText : formData.reply.commentText}
      />
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Icons.Eye size={18} /> 
            {t.info || 'Comment Info'}
          </h3>
          {renderCommentFields(formData, 'main')}
        </section>

        <button 
          type="button" 
          className={`${styles.replyToggle} ${formData.showReply ? styles.replyActive : ''}`} 
          onClick={toggleReplySection}
        >
          {formData.showReply ? (
            <><Icons.Trash size={16} /> {t.removeReplyThread || 'Remove Reply'}</>
          ) : (
            <><Icons.Reply size={16} /> {t.addReplyThread || 'Add Reply'}</>
          )}
        </button>

        {formData.showReply && (
          <section className={`${styles.section} ${styles.replySection}`}>
            <h3 className={styles.sectionTitle}>
              <Icons.Reply size={18} />
              {t.replySection || 'Reply'}
            </h3>
            {renderCommentFields(formData.reply, 'reply')}
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Icons.Cog size={18} /> 
            {t.export || 'Export Settings'}
          </h3>

          <div className={styles.exportOptions}>
            <div className={styles.optionRow}>
              <label className={styles.optionLabel}>{t.mood || 'Theme'}</label>
              <div className={styles.toggleGroup}>
                <button 
                  type="button" 
                  className={!exportSettings.isDark ? styles.active : ''} 
                  onClick={() => updateExportSettings({ isDark: false })}
                >
                  <Icons.Sun size={16} /> Light
                </button>
                <button 
                  type="button" 
                  className={exportSettings.isDark ? styles.active : ''} 
                  onClick={() => updateExportSettings({ isDark: true })}
                >
                  <Icons.Moon size={16} /> Dark
                </button>
              </div>
            </div>

            <div className={styles.optionRow}>
              <label className={styles.optionLabel}>Format</label>
              <div className={styles.toggleGroup}>
                <button type="button" className={exportSettings.format === 'png' ? styles.active : ''} onClick={() => updateExportSettings({ format: 'png' })}>
                  PNG
                </button>
                <button 
                    type="button" 
                    className={exportSettings.format === 'svg' ? styles.active : ''} 
                    onClick={() => !isPro ? onOpenPro() : updateExportSettings({ format: 'svg' })}
                >
                  SVG {!isPro && <span className={styles.lockIcon}><Icons.Lock size={12}/></span>}
                </button>
              </div>
            </div>

            <div className={styles.optionRow}>
              <label className={styles.optionLabel}>{t.size || 'Size'}</label>
              <div className={styles.selectWrapper}>
                <select 
                  className={styles.select} 
                  value={exportSettings.customSize ? 'custom' : `${exportSettings.width}×${exportSettings.height}`} 
                  onChange={handleSizeChange}
                >
                  {PRESET_SIZES.map(size => (
                    <option key={size.labelKey} value={size.labelKey === 'custom' ? 'custom' : `${size.width}×${size.height}`}>
                      {size.labelKey === 'custom' ? `Pro Custom` : size.labelKey}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {exportSettings.customSize && (
              <div className={styles.customSizeRow}>
                <div className={styles.dimension}>
                  <span>W</span>
                  <input type="number" name="customWidth" value={exportSettings.width} onChange={handleCustomDimensionChange} min="100"/>
                </div>
                <span className={styles.separator}>×</span>
                <div className={styles.dimension}>
                  <span>H</span>
                  <input type="number" name="customHeight" value={exportSettings.height} onChange={handleCustomDimensionChange} min="100"/>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            <Icons.Sparkles /> {t.create || 'Generate'}
          </button>
          <button type="button" className={styles.resetBtn} onClick={handleResetForm}>
            {t.reset || 'Reset'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm;