import { useTranslation } from 'react-i18next';
import styles from './CommentPreview.module.css';
import { BiDislike } from "react-icons/bi";
import { IoMdHeartEmpty } from "react-icons/io";

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

const getDefaultAvatarData = (username) => {
  if (!username || username.length < 2) {
    return { color: '#CCCCCC', initial: '?' };
  }
  const color = AVATAR_COLORS[username.length % AVATAR_COLORS.length];
  const initial = username.charAt(1).toUpperCase();
  return { color, initial };
};

const formatLikeCount = (count) => {
  if (!count || count === 0) return null;
  if (count < 1000) return count.toString();
  if (count < 10000) return Math.floor(count / 1000) + 'k';
  return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace('.0', '') + 'k';
};

const CommentPreview = ({ comment, exportSettings, finalHeight, exportRef }) => {
  const { t } = useTranslation();
  const avatarData = !comment.avatar ? getDefaultAvatarData(comment.username) : null;
  const formattedLikes = formatLikeCount(comment.likes);

  const formatDate = (dateString) => {
    if (!dateString) return '12-11';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '12-11';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  return (
    <div className={styles.previewSection} data-testid="comment-preview">
      <h3>{t('exportPreview')}</h3>
      <div className={styles.exportSettingsInfo}>
        <p>
          <strong>{t('format')}</strong> {exportSettings.format.toUpperCase()}
          <span className={styles.separator}>•</span>
          <strong>{t('dimensions')}</strong> {exportSettings.width}px × {finalHeight}px
          {exportSettings.customSize && (
            <span className={styles.customSizeBadge}>{t('customSize')}</span>
          )}
        </p>
      </div>
      <div className={styles.exportPreview}>
        <div className={styles.exportContent} ref={exportRef}>
          <div className={styles.tiktokComment} style={{ padding: `${Math.min(40, 40 * (exportSettings.width / 1080))}px` }}>
            <div className={styles.commentMain} style={{ gap: `${Math.min(32, 32 * (exportSettings.width / 1080))}px` }}>
              <div className={styles.commentLeft}>
                <div className={styles.avatarContainer}>
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt={`${t('profileAvatar')} ${comment.username}`}
                      className={styles.commentAvatar}
                      style={{
                        width: `${Math.min(110, 110 * (exportSettings.width / 1080))}px`,
                        height: `${Math.min(110, 110 * (exportSettings.width / 1080))}px`
                      }}
                    />
                  ) : (
                    <div
                      className={styles.defaultAvatar}
                      style={{
                        backgroundColor: avatarData.color,
                        width: `${Math.min(110, 110 * (exportSettings.width / 1080))}px`,
                        height: `${Math.min(110, 110 * (exportSettings.width / 1080))}px`,
                        fontSize: `${Math.min(48, 48 * (exportSettings.width / 1080))}px`
                      }}
                    >
                      {avatarData.initial}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.commentRight}>
                <div className={styles.commentHeader}>
                  <div className={styles.usernameContainer}>
                    <div className={styles.commentUsername} style={{ fontSize: `${Math.min(38, 38 * (exportSettings.width / 1080))}px` }}>
                      {comment.username}
                    </div>
                    {comment.verified && (
                      <span className={styles.verifiedBadge} style={{
                        width: `${Math.min(32, 32 * (exportSettings.width / 1080))}px`,
                        height: `${Math.min(32, 32 * (exportSettings.width / 1080))}px`,
                        fontSize: `${Math.min(18, 18 * (exportSettings.width / 1080))}px`
                      }}>✓</span>
                    )}
                  </div>
                  <div className={styles.commentText} style={{ fontSize: `${Math.min(42, 42 * (exportSettings.width / 1080))}px` }}>
                    {comment.commentText}
                  </div>
                </div>
                <div className={styles.commentFooter}>
                  <div className={styles.footerLeft}>
                    <div className={styles.commentDate} style={{ fontSize: `${Math.min(36, 36 * (exportSettings.width / 1080))}px` }}>
                      {formatDate(comment.date)}
                    </div>
                    <div className={styles.commentReply} style={{ fontSize: `${Math.min(36, 36 * (exportSettings.width / 1080))}px` }}>
                      {t('reply')}
                    </div>
                  </div>
                  <div className={styles.footerRight}>
                    <div className={styles.actionRow} style={{ gap: `${Math.min(40, 40 * (exportSettings.width / 1080))}px` }}>
                      <div className={styles.actionButton}>
                        <IoMdHeartEmpty className={styles.heartIcon} style={{ fontSize: `${Math.min(46, 46 * (exportSettings.width / 1080))}px` }} />
                        {formattedLikes && (
                          <span className={styles.likeCount} style={{ fontSize: `${Math.min(34, 34 * (exportSettings.width / 1080))}px` }}>
                            {formattedLikes}
                          </span>
                        )}
                      </div>
                      <div className={styles.actionButton}>
                        <BiDislike className={styles.dislikeIcon} style={{ fontSize: `${Math.min(48, 48 * (exportSettings.width / 1080))}px` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPreview;
