import { useRef } from 'react'
import styles from './CommentImageExporter.module.css'
import { BiDislike, BiCopy } from "react-icons/bi"; 
import { IoMdHeartEmpty } from "react-icons/io"; 
import { FaLock } from 'react-icons/fa';
import { getDefaultAvatarData, formatLikeCount, calculatePreviewSizes } from '../../utils/helpers'
import { useAutoHeight } from '../../hooks/useAutoHeight'
import { useCommentExport } from '../../hooks/useCommentExport'

// 🆕 Внутрішній компонент для рендеру ОДНОГО коментаря
// Він приймає дані, розміри та прапорці
const SingleCommentRender = ({ data, sizes, formatDate, replyLabelText, isDark, isNested = false }) => {
    const avatarData = !data.avatar ? getDefaultAvatarData(data.username) : null;
    const formattedLikes = formatLikeCount(data.likes);

    return (
        <div className={styles.commentMain} style={{ gap: `${sizes.gap}px`, marginTop: isNested ? `${sizes.gap}px` : 0 }}>
            {/* Ліва частина: Аватар */}
            <div className={styles.commentLeft}>
                <div className={styles.avatarContainer}>
                {data.avatar ? (
                    <img src={data.avatar} alt="avatar" className={styles.commentAvatar} style={{ width: `${sizes.avatarSize}px`, height: `${sizes.avatarSize}px` }} />
                ) : (
                    <div className={styles.defaultAvatar} style={{ backgroundColor: avatarData.color, width: `${sizes.avatarSize}px`, height: `${sizes.avatarSize}px`, fontSize: `${sizes.avatarFontSize}px` }}>
                    {avatarData.initial}
                    </div>
                )}
                </div>
            </div>
            
            {/* Права частина: Текст та інфо */}
            <div className={styles.commentRight}>
                <div className={styles.commentHeader}>
                    <div className={styles.usernameContainer}>
                        <div className={styles.commentUsername} style={{ fontSize: `${sizes.usernameFontSize}px` }}>
                        {data.username}
                        </div>
                        {data.verified && (
                        <span className={styles.verifiedBadge} style={{ width: `${sizes.verifiedSize}px`, height: `${sizes.verifiedSize}px`, fontSize: `${sizes.verifiedFontSize}px` }}>✓</span>
                        )}
                    </div>
                    <div className={styles.commentText} style={{ fontSize: `${sizes.textFontSize}px` }}>
                        {data.commentText}
                    </div>
                </div>
                
                <div className={styles.commentFooter}>
                    <div className={styles.footerLeft}>
                        <div className={styles.commentDate} style={{ fontSize: `${sizes.dateFontSize}px` }}>
                        {formatDate(data.date)}
                        </div>
                        {/* Текст кнопки "Reply" */}
                        <div className={styles.commentReply} style={{ fontSize: `${sizes.dateFontSize}px` }}>
                        {replyLabelText}
                        </div>
                    </div>
                    
                    <div className={styles.footerRight}>
                        <div className={styles.actionRow} style={{ gap: `${sizes.actionGap}px` }}>
                            <div className={styles.actionButton}>
                                <IoMdHeartEmpty className={styles.heartIcon} style={{ fontSize: `${sizes.iconFontSize}px` }} />
                                {formattedLikes && <span className={styles.likeCount} style={{ fontSize: `${sizes.likeFontSize}px` }}>{formattedLikes}</span>}
                            </div>
                            <div className={styles.actionButton}>
                                <BiDislike className={styles.dislikeIcon} style={{ fontSize: `${sizes.iconFontSize}px` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CommentImageExporter({ comment, language, translations: t, exportSettings, isPro, onOpenPro }) {
  const exportRef = useRef(null)
  const previewHeight = useAutoHeight(exportRef, exportSettings);

  const { isExporting, handleExport, copyToClipboard } = useCommentExport({
    exportRef, exportSettings, isPro, onOpenPro, language, previewHeight, translations: t
  });

  if (!comment) return null;

  const sizes = calculatePreviewSizes(exportSettings.width);
  const isLocked = exportSettings.format === 'svg' && !isPro;
  const styleHeight = (exportSettings.customSize || exportSettings.height !== 'auto') ? `${exportSettings.height}px` : 'auto';

  const exportContentStyle = {
    width: `${exportSettings.width}px`,
    height: styleHeight,
    backgroundColor: exportSettings.isDark ? '#121212' : 'white' 
  };

  const formatDate = (dateString) => { 
    if (!dateString) return '12-11';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '12-11';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  // Визначаємо текст кнопки "Reply"
  const replyLabel = comment.replyLabelText || t.replyTextDefault || 'Reply';

  return (
    <div className={styles.exporterContainer}>
      <div className={styles.previewSection}>
        <h3>{t.preview}</h3>
        <div className={styles.exportSettingsInfo}>
          <p>
            <strong>{exportSettings.format.toUpperCase()} • {exportSettings.width}px × {exportSettings.customSize ? exportSettings.height : previewHeight}px</strong>
            {exportSettings.isDark && <span style={{marginLeft: 8}}>🌙 Dark</span>}
          </p>
        </div>
        
        <div className={styles.exportPreview}>
          <div className={styles.exportContent} ref={exportRef} style={exportContentStyle}>
            
            {/* Основний контейнер */}
            <div className={`${styles.tiktokComment} ${exportSettings.isDark ? styles.darkTheme : ''}`} 
                 style={{ 
                     padding: `${sizes.padding}px`, 
                     flexDirection: 'column', // 🆕 Елементи йдуть зверху вниз
                     alignItems: 'flex-start' 
                 }}>
              
              {!isPro && <div className={styles.watermark} style={{fontSize: `${sizes.textFontSize * 0.5}px`}}>TikTok Comment Generator</div>}

              {/* 1. Рендер основного коментаря */}
              <SingleCommentRender 
                data={comment} 
                sizes={sizes} 
                formatDate={formatDate} 
                replyLabelText={replyLabel} 
                isDark={exportSettings.isDark}
              />

              {/* 2. Рендер відповіді (якщо showReply === true) */}
              {comment.showReply && comment.reply && (
                  <div style={{ 
                      width: '100%', 
                      paddingLeft: `${sizes.avatarSize + sizes.gap}px` // 🆕 Зміщення вліво
                  }}>
                      <SingleCommentRender 
                        data={comment.reply} 
                        sizes={sizes} 
                        formatDate={formatDate} 
                        replyLabelText={replyLabel} 
                        isDark={exportSettings.isDark}
                        isNested={true}
                      />
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.controlsSection} style={{display: 'flex', gap: 10}}>
        <button onClick={copyToClipboard} className={`${styles.exportButton} ${styles.copyButton}`} disabled={isExporting} style={{flex: 1, background: '#fff', color: '#333', border: '1px solid #ddd'}}>
           <BiCopy /> {t.copy}
        </button>

        <button onClick={handleExport} className={styles.exportButton} disabled={isExporting} style={{ flex: 2, background: isLocked ? '#444' : undefined }}>
          {isExporting ? t.exporting : (
            <>
              {isLocked ? <FaLock /> : <span className={styles.downloadIcon}>↓</span>}
              {isLocked ? t.unlockSvg : t.download}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CommentImageExporter;