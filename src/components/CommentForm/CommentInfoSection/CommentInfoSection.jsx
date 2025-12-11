import { useTranslation } from 'react-i18next';
import AvatarUploader from '../../AvatarUploader/AvatarUploader';
import styles from './CommentInfoSection.module.css';

const CommentInfoSection = ({ formData, handleInputChange, handleAvatarSelect }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>{t('commentInfo')}</h3>
      <div className={styles.formRow}>
        <label htmlFor="username">{t('username')}</label>
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
          <span>{t('verification')}</span>
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div className={styles.formRow}>
        <label>{t('profileAvatar')}</label>
        <AvatarUploader
          onAvatarSelect={handleAvatarSelect}
          currentAvatar={formData.avatar}
        />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="date">{t('commentDate')}</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={styles.dateInput}
        />
        <small className={styles.dateHint}>{t('dateHint')}</small>
      </div>
      <div className={styles.formRow}>
        <label htmlFor="commentText">{t('commentText')}</label>
        <textarea
          id="commentText"
          name="commentText"
          value={formData.commentText}
          onChange={handleInputChange}
          placeholder={t('writeComment')}
          rows="4"
        />
      </div>
      <div className={styles.formRow}>
        <label htmlFor="likes">{t('likes')}</label>
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
  );
};

export default CommentInfoSection;
