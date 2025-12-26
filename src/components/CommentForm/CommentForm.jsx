import { useCallback } from 'react'
import AvatarUploader from '../AvatarUploader/AvatarUploader'
import AiGeneratorModal from '../AiGeneratorModal/AiGeneratorModal'
import styles from './CommentForm.module.css'
import { useCommentForm } from '../../hooks/useCommentForm'
import { FormInput } from '../UI/FormElements'
import { MdVerified } from "react-icons/md"; 
// ✅ 1. Додаємо LuSun та LuMoon до імпорту
import { LuCrown, LuCheck, LuX, LuKeyRound, LuArrowRight, LuSun, LuMoon } from "react-icons/lu";
import { FaReply, FaTrash, FaCog, FaEye, FaLock } from 'react-icons/fa'

const PRESET_SIZES = [
  { width: 1080, height: 'auto', labelKey: 'Standard (1080×auto)' },
  { width: 1200, height: 'auto', labelKey: 'Social Media (1200×auto)' },
  { width: 'custom', height: 'custom', labelKey: 'custom' } 
];

function CommentForm({ onGenerate, language, translations: t, exportSettings, updateExportSettings, isPro, onOpenPro }) {
  const { 
    formData, isAiModalOpen, setIsAiModalOpen, 
    handleInputChange, toggleVerified, toggleCreator, toggleReplySection,
    setAvatar, handleAiApply, handleAiTextClick, 
    handleSubmit, handleResetForm 
  } = useCommentForm(onGenerate, isPro, onOpenPro);

  const handleSizeChange = useCallback((e) => {
    const value = e.target.value;
    const selected = PRESET_SIZES.find(s => `${s.width}×${s.height}` === value);
    
    if (selected?.width === 'custom') {
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
      <FormInput label={t.username} name="username" value={data.username} onChange={(e) => handleInputChange(e, section)} />

      <div className={styles.togglesRow}>
        <div className={styles.toggleItem}>
          <label 
            onClick={() => toggleVerified(section)} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            {t.verified} 
            <MdVerified style={{ color: '#20d5ec', fontSize: '16px' }} />
          </label>
          <div className={styles.switchWrapper}>
            <label className={styles.switch}>
              <input type="checkbox" checked={data.verified} onChange={() => toggleVerified(section)} />
              <span className={styles.slider}></span>
            </label>
            {!isPro && <FaLock className={styles.proLock} onClick={onOpenPro} />}
          </div>
        </div>

        <div className={styles.toggleItem}>
          <label onClick={() => toggleCreator(section)}>{t.isCreator || 'Автор'}</label>
          <div className={styles.switchWrapper}>
            <label className={styles.switch}>
              <input type="checkbox" checked={data.isCreator} onChange={() => toggleCreator(section)} />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <label>{t.avatar}</label>
        <AvatarUploader 
          onAvatarSelect={(img) => setAvatar(img, section)} 
          currentAvatar={data.avatar} 
          t={t} 
          isPro={isPro} 
          onOpenPro={onOpenPro} 
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.labelWithAiWrapper}>
          <label>{t.text}</label>
          <button type="button" className={styles.aiButton} onClick={() => handleAiTextClick(section)}>
            {t.aiBtn}
          </button>
        </div>
        <textarea 
          name="commentText" 
          value={data.commentText} 
          onChange={(e) => handleInputChange(e, section)} 
          rows="4" 
          placeholder={t.textPlaceholder || "..."} 
        />
      </div>

      <div className={styles.gridRowCompact}>
        <FormInput label={t.likes} name="likes" type="number" value={data.likes} onChange={(e) => handleInputChange(e, section)} />
        <FormInput label={t.date} name="date" type="date" value={data.date} onChange={(e) => handleInputChange(e, section)} />
      </div>
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <AiGeneratorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onApply={handleAiApply} language={language} />
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><FaEye /> {t.info}</h3>
          {renderCommentFields(formData, 'main')}
        </section>

        <button 
          type="button" 
          className={`${styles.replyToggle} ${formData.showReply ? styles.replyActive : ''}`} 
          onClick={toggleReplySection}
        >
          {formData.showReply ? <><FaTrash /> {t.removeReplyThread}</> : <><FaReply /> {t.addReplyThread}</>}
        </button>

        {formData.showReply && (
          <section className={`${styles.section} ${styles.replySection}`}>
            <h3 className={styles.sectionTitle}>{t.replySection}</h3>
            {renderCommentFields(formData.reply, 'reply')}
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><FaCog /> {t.export}</h3>

          <div className={styles.exportOptions}>
            <div className={styles.optionRow}>
              <label>{t.mood}</label>
              
              {/* ✅ 2. Оновлена група кнопок з іконками */}
              <div className={styles.toggleGroup}>
                <button 
                  type="button" 
                  className={!exportSettings.isDark ? styles.active : ''} 
                  onClick={() => updateExportSettings({ isDark: false })}
                  title="Light Mode"
                >
                  <LuSun size={18} />
                </button>
                <button 
                  type="button" 
                  className={exportSettings.isDark ? styles.active : ''} 
                  onClick={() => updateExportSettings({ isDark: true })}
                  title="Dark Mode"
                >
                  <LuMoon size={18} />
                </button>
              </div>

            </div>

            <div className={styles.optionRow}>
              <label>Format</label>
              <div className={styles.toggleGroup}>
                <button type="button" className={exportSettings.format === 'png' ? styles.active : ''} onClick={() => updateExportSettings({ format: 'png' })}>PNG</button>
                <button type="button" className={exportSettings.format === 'svg' ? styles.active : ''} onClick={() => !isPro ? onOpenPro() : updateExportSettings({ format: 'svg' })}>
                  SVG {!isPro && <FaLock className={styles.lockIcon} />}
                </button>
              </div>
            </div>

            <div className={styles.optionRow}>
              <label>{t.size}</label>
              <select 
                className={styles.select} 
                value={exportSettings.customSize ? 'custom×custom' : `${exportSettings.width}×${exportSettings.height}`} 
                onChange={handleSizeChange}
              >
                {PRESET_SIZES.map(size => (
                  <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>
                    {size.labelKey === 'custom' ? `📐 ${t.proFeatureCustom || 'Custom'}` : size.labelKey}
                  </option>
                ))}
              </select>
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
          <button type="submit" className={styles.submitBtn}>{t.create}</button>
          <button type="button" className={styles.resetBtn} onClick={handleResetForm}>{t.reset}</button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm;