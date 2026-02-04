import React, { useRef, useMemo } from 'react';
import { getDefaultAvatarData, formatLikeCount, calculatePreviewSizes, formatCommentDate } from '@utils';
import { useAutoHeight, useCommentExport, useCommentAudio, useLanguage } from '@hooks';
import styles from './CommentImageExporter.module.css';

// SVG Icons (Optimized for html2canvas export)
const Icons = {
  HeartEmpty: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  HeartFill: () => <svg viewBox="0 0 24 24" fill="#FE2C55" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Dislike: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>,
  Verified: () => <svg viewBox="0 0 24 24" fill="#20D5EC"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>, // Simplified Check
  Copy: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
};

const SingleComment = ({ data, sizes, replyLabel, t, isNested = false }) => {
  const avatarData = useMemo(() => !data.avatar ? getDefaultAvatarData(data.username) : null, [data.avatar, data.username]);
  const formattedLikes = useMemo(() => formatLikeCount(data.likes), [data.likes]);

  return (
    <div className={styles.commentMain} style={{ gap: `${sizes.gap}px`, marginTop: isNested ? `${sizes.gap / 2}px` : 0 }}>
      {/* Avatar Section */}
      <div className={styles.commentLeft}>
        {data.avatar ? (
          <img 
            src={data.avatar} 
            alt="avatar" 
            className={styles.commentAvatar} 
            style={{ width: `${sizes.avatarSize}px`, height: `${sizes.avatarSize}px` }} 
            crossOrigin="anonymous" // Important for export
          />
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

      {/* Content Section */}
      <div className={styles.commentRight} style={{ gap: `${sizes.gap / 4}px` }}>
        <div className={styles.usernameRow}>
          <span className={styles.username} style={{ fontSize: `${sizes.usernameFontSize}px` }}>
            {data.username}
          </span>
          {data.verified && (
            <span className={styles.verifiedIcon} style={{ width: `${sizes.verifiedSize}px`, height: `${sizes.verifiedSize}px` }}>
              <Icons.Verified />
            </span>
          )}
          {data.isCreator && (
            <span className={styles.creatorBadge} style={{ fontSize: `${sizes.verifiedFontSize}px` }}>
              • {t.creatorBadge || 'Creator'}
            </span>
          )}
        </div>

        <p className={styles.commentText} style={{ fontSize: `${sizes.textFontSize}px` }}>
          {data.commentText}
        </p>

        <div className={styles.metaRow} style={{ fontSize: `${sizes.dateFontSize}px`, gap: `${sizes.actionGap}px`, marginTop: `${sizes.gap / 4}px` }}>
          <span className={styles.date}>{formatCommentDate(data.date)}</span>
          <span className={styles.replyAction}>{isNested ? t.replyTextDefault : (replyLabel || t.replyTextDefault)}</span>
          
           {/* Hidden elements for layout spacing/realism in some views, usually empty in mobile list but kept for structure */}
        </div>
      </div>
      
      {/* Like Section (TikTok Style: Right Side) */}
      <div className={styles.likeSection}>
         <div className={styles.likeColumn}>
            <div className={styles.heartIconWrapper} style={{ width: `${sizes.iconFontSize}px`, height: `${sizes.iconFontSize}px` }}>
               <Icons.HeartEmpty />
            </div>
            <span className={styles.sideLikeCount} style={{ fontSize: `${sizes.likeFontSize}px` }}>
               {formattedLikes}
            </span>
         </div>
      </div>
    </div>
  );
};

function CommentImageExporter({ comment, exportSettings, isPro, onOpenPro }) {
  const { t, language } = useLanguage();
  const exportRef = useRef(null);
  
  const previewHeight = useAutoHeight(exportRef, exportSettings);
  
  const { handleExport, copyToClipboard, isExporting } = useCommentExport({ 
    exportRef, 
    exportSettings 
  });

  const { generateAndDownload, isGeneratingAudio } = useCommentAudio();

  const sizes = useMemo(() => calculatePreviewSizes(exportSettings.width), [exportSettings.width]);

  const handleVoiceOver = () => {
    if (!isPro) return onOpenPro();
    generateAndDownload(comment.commentText, language);
  };

  const isLocked = exportSettings.format === 'svg' && !isPro;

  return (
    <div className={styles.wrapper}>
      {/* Preview Workspace */}
      <div className={styles.previewContainer}>
        <div className={styles.workspaceLabel}>Preview</div>
        
        {/* The actual node to be exported */}
        <div 
          ref={exportRef}
          className={`${styles.exportArea} ${exportSettings.isDark ? styles.darkMode : styles.lightMode}`}
          style={{ 
            width: `${exportSettings.width}px`,
            minHeight: `${previewHeight}px`,
            padding: `${sizes.padding}px`
          }}
        >
          <SingleComment 
            data={comment} 
            sizes={sizes} 
            replyLabel={comment.reply ? null : t.replyTextDefault} 
            t={t} 
          />
          
          {comment.showReply && comment.reply && (
            <div className={styles.replyThread}>
              <div 
                 className={styles.replyConnector}
                 style={{ 
                   left: `${sizes.avatarSize / 2}px`, 
                   top: `${sizes.avatarSize + 4}px`,
                   bottom: '10px' // Connects visual flow
                 }} 
              />
              <div 
                className={styles.replyWrapper} 
                style={{ marginLeft: `${sizes.avatarSize + sizes.gap}px` }}
              >
                <SingleComment data={comment.reply} sizes={sizes} replyLabel={t.replyTextDefault} t={t} isNested />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Control Bar */}
      <div className={styles.controlsSection}>
        <button 
          onClick={copyToClipboard} 
          className={styles.actionBtnSecondary} 
          disabled={isExporting}
          title={t.copy}
        >
          <Icons.Copy />
          <span>{t.copy}</span>
        </button>

        <button 
          onClick={handleVoiceOver} 
          className={styles.actionBtnSecondary} 
          disabled={isGeneratingAudio}
        >
          {isGeneratingAudio ? <span className={styles.spinner}></span> : <Icons.Mic />}
          <span>{t.voiceBtn || 'Voice AI'}</span>
          {!isPro && <span className={styles.lockBadge}><Icons.Lock /></span>}
        </button>

        <button 
          onClick={handleExport} 
          className={`${styles.actionBtnPrimary} ${isLocked ? styles.locked : ''}`} 
          disabled={isExporting}
        >
          {isExporting ? (
             t.exporting 
          ) : (
            <>
              {isLocked ? <Icons.Lock /> : <Icons.Download />}
              <span>{t.download} {exportSettings.format.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>
      
      {exportSettings.format === 'svg' && !isPro && (
        <div className={styles.proBanner} onClick={onOpenPro}>
          <Icons.Lock /> Unlock SVG & AI Voice features
        </div>
      )}
    </div>
  );
}

export default CommentImageExporter;