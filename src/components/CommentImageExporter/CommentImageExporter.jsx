import { useRef, useMemo } from 'react'
import { BiDislike, BiCopy } from "react-icons/bi"; 
import { IoMdHeartEmpty } from "react-icons/io"; 
import { FaLock } from 'react-icons/fa';
import { getDefaultAvatarData, formatLikeCount, calculatePreviewSizes, formatCommentDate } from '../../utils/helpers'
import { useAutoHeight } from '../../hooks/useAutoHeight'
import { useCommentExport } from '../../hooks/useCommentExport'
import styles from './CommentImageExporter.module.css'

const SingleComment = ({ data, sizes, replyLabel, t, isNested = false }) => {
  const avatarData = useMemo(() => !data.avatar ? getDefaultAvatarData(data.username) : null, [data.avatar, data.username]);
  const formattedLikes = useMemo(() => formatLikeCount(data.likes), [data.likes]);

  return (
    <div className={styles.commentMain} style={{ gap: `${sizes.gap}px`, marginTop: isNested ? `${sizes.gap / 2}px` : 0 }}>
      <div className={styles.commentLeft}>
        {data.avatar ? (
          <img src={data.avatar} alt="avatar" className={styles.commentAvatar} style={{ width: `${sizes.avatarSize}px`, height: `${sizes.avatarSize}px` }} />
        ) : (
          <div className={styles.defaultAvatar} style={{ 
            backgroundColor: avatarData.color, 
            width: `${sizes.avatarSize}px`, 
            height: `${sizes.avatarSize}px`, 
            fontSize: `${sizes.avatarFontSize}px` 
          }}>
            {avatarData.initial}
          </div>
        )}
      </div>
      
      <div className={styles.commentRight}>
        <div className={styles.commentHeader}>
          <div className={styles.usernameContainer}>
            <span className={styles.commentUsername} style={{ fontSize: `${sizes.usernameFontSize}px` }}>{data.username}</span>
            
            {data.verified && (
              <span className={styles.verifiedBadge} style={{ 
                width: `${sizes.verifiedSize}px`, 
                height: `${sizes.verifiedSize}px`, 
                fontSize: `${sizes.verifiedFontSize}px` 
              }}>✓</span>
            )}

            {data.isCreator && (
              <span className={styles.creatorBadge} style={{ fontSize: `${sizes.usernameFontSize}px` }}>
                · {t?.creatorBadge || 'Автор'}
              </span>
            )}
          </div>
          <div className={styles.commentText} style={{ fontSize: `${sizes.textFontSize}px` }}>
            {data.commentText}
          </div>
        </div>
        
        <div className={styles.commentFooter}>
          <div className={styles.footerLeft}>
            <span style={{ fontSize: `${sizes.dateFontSize}px` }}>{formatCommentDate(data.date)}</span>
            <span className={styles.commentReply} style={{ fontSize: `${sizes.dateFontSize}px` }}>{replyLabel}</span>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.actionRow} style={{ gap: `${sizes.actionGap}px` }}>
              <div className={styles.actionButton}>
                <IoMdHeartEmpty style={{ fontSize: `${sizes.iconFontSize}px` }} />
                {formattedLikes && <span style={{ fontSize: `${sizes.likeFontSize}px` }}>{formattedLikes}</span>}
              </div>
              <BiDislike style={{ fontSize: `${sizes.iconFontSize}px` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CommentImageExporter({ comment, language, translations: t, exportSettings, isPro, onOpenPro }) {
  const exportRef = useRef(null);
  const previewHeight = useAutoHeight(exportRef, exportSettings);
  const sizes = useMemo(() => calculatePreviewSizes(exportSettings.width), [exportSettings.width]);
  
  const { isExporting, handleExport, copyToClipboard } = useCommentExport({
    exportRef, exportSettings, isPro, onOpenPro, language, previewHeight, translations: t
  });

  const isLocked = exportSettings.format === 'svg' && !isPro;
  const replyLabel = comment?.replyLabelText || t.replyTextDefault || 'Reply';

  return (
    <div className={styles.exporterContainer}>
      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>{t.preview}</h3>
        <div className={styles.previewWrapper}>
          <div 
            ref={exportRef} 
            className={`${styles.exportContent} ${exportSettings.isDark ? styles.darkTheme : styles.lightTheme}`}
            style={{ 
              // ✅ ВИПРАВЛЕННЯ: Тепер ширина завжди фіксована (1080px за замовчуванням), 
              // навіть якщо користувач не PRO. Це прибирає стиснення на мобільному.
              width: `${exportSettings.width}px`, 
              minWidth: `${exportSettings.width}px`, // Гарантуємо, що блок не стиснеться
              
              height: exportSettings.customSize ? `${exportSettings.height}px` : 'auto',
              minHeight: '200px',
              padding: `${sizes.padding}px`,
            }}
          >
            {!isPro && <div className={styles.watermark}>TikTok Comment Generator</div>}
            
            <div className={styles.commentsWrapper}>
              <SingleComment data={comment} sizes={sizes} replyLabel={replyLabel} t={t} />

              {comment.showReply && comment.reply && (
                <div 
                  className={styles.nestedComment}
                  // Зсув для відповіді
                  style={{ paddingLeft: `${sizes.avatarSize + sizes.gap}px` }}
                >
                  <SingleComment data={comment.reply} sizes={sizes} replyLabel={replyLabel} t={t} isNested />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.controlsSection}>
        <button 
          onClick={copyToClipboard} 
          className={styles.copyButton} 
          disabled={isExporting}
        >
          <BiCopy size={20} />
          {t.copy}
        </button>
        <button 
          onClick={handleExport} 
          className={`${styles.exportButton} ${isLocked ? styles.locked : ''}`} 
          disabled={isExporting}
        >
          {isExporting ? t.exporting : (
            <>
              {isLocked ? <FaLock size={18} /> : <span className={styles.downloadIcon}>↓</span>}
              {isLocked ? t.unlockSvg : t.download}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CommentImageExporter;