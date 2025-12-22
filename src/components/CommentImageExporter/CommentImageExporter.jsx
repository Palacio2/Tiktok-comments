import { useRef, useCallback, useState, useEffect } from 'react'
import { toPng, toSvg } from 'html-to-image'
import styles from './CommentImageExporter.module.css'
import { BiDislike } from "react-icons/bi"; 
import { IoMdHeartEmpty } from "react-icons/io"; 

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']

const getDefaultAvatarData = (username) => {
  if (!username || username.length < 2) {
    return { color: '#CCCCCC', initial: '?' }
  }
  const color = AVATAR_COLORS[username.length % AVATAR_COLORS.length]
  const initial = username.charAt(1).toUpperCase()
  return { color, initial }
}

const formatLikeCount = (count) => {
  if (!count || count === 0) return null
  if (count < 1000) return count.toString()
  if (count < 10000) return Math.floor(count / 1000) + 'k'
  return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace('.0', '') + 'k'
}

const calculateSizes = (baseWidth) => {
  const scale = baseWidth / 1080
  return {
    padding: Math.max(20, 40 * scale),
    avatarSize: Math.max(50, 110 * scale),
    avatarFontSize: Math.max(20, 48 * scale),
    usernameFontSize: Math.max(20, 38 * scale),
    verifiedSize: Math.max(16, 32 * scale),
    verifiedFontSize: Math.max(10, 18 * scale),
    textFontSize: Math.max(24, 42 * scale),
    dateFontSize: Math.max(20, 36 * scale),
    iconFontSize: Math.max(24, 46 * scale),
    likeFontSize: Math.max(18, 34 * scale),
    gap: Math.max(16, 32 * scale),
    actionGap: Math.max(20, 40 * scale)
  }
}

function CommentImageExporter({ comment, language, translations: t, exportSettings }) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [previewHeight, setPreviewHeight] = useState(exportSettings.height)
  
  const avatarData = !comment.avatar ? getDefaultAvatarData(comment.username) : null
  
  useEffect(() => {
    if (exportRef.current) {
      const updateHeight = () => {
        // Завжди вимірюємо реальну висоту контенту
        const contentHeight = exportRef.current.scrollHeight
        
        if (exportSettings.customSize) {
           // Якщо кастомний розмір - використовуємо його
           const fixedHeight = parseInt(exportSettings.height) || contentHeight
           setPreviewHeight(fixedHeight)
        } else {
           // Якщо авто - просто записуємо реальну висоту контенту
           setPreviewHeight(contentHeight)
        }
      }
      
      // Викликаємо оновлення одразу і з невеликою затримкою для надійності
      updateHeight()
      const timer = setTimeout(updateHeight, 50)
      return () => clearTimeout(timer)
    }
  }, [comment, exportSettings])
  
  const handleExport = useCallback(async () => {
    if (!exportRef.current || isExporting) return
    setIsExporting(true)
    
    try {
      const width = parseInt(exportSettings.width) || 1080
      const height = exportSettings.customSize 
        ? parseInt(exportSettings.height) 
        : previewHeight
      
      const pixelRatio = (exportSettings.customSize || exportSettings.format === 'svg') ? 1 : 2

      const options = {
        width: width,
        height: height,
        backgroundColor: 'white',
        quality: 1.0,
        pixelRatio: pixelRatio,
        cacheBust: true,
        style: {
           transform: 'none', 
           margin: 0
        }
      }
      
      let dataUrl
      let fileExtension
      
      if (exportSettings.format === 'svg') {
        dataUrl = await toSvg(exportRef.current, options)
        fileExtension = 'svg'
      } else {
        dataUrl = await toPng(exportRef.current, options)
        fileExtension = 'png'
      }
      
      const link = document.createElement('a')
      link.download = `tiktok-comment-${width}x${height}-${Date.now()}.${fileExtension}`
      link.href = dataUrl
      link.click()
      
    } catch (error) {
      console.error('Export error:', error)
      alert(language === 'uk' ? 'Помилка експорту' : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }, [isExporting, previewHeight, language, exportSettings])

  const formatDate = (dateString) => {
    if (!dateString) return '12-11'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '12-11'
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
  }
  
  if (!comment) return null
  
  const formattedLikes = formatLikeCount(comment.likes)

  // 👇 ГОЛОВНЕ ВИПРАВЛЕННЯ:
  // Якщо режим не кастомний і висота 'auto', ставимо CSS 'auto',
  // щоб браузер сам "сплюснув" блок до розміру тексту.
  const styleHeight = (exportSettings.customSize || exportSettings.height !== 'auto') 
      ? `${exportSettings.height}px` 
      : 'auto';

  const sizes = calculateSizes(exportSettings.width)
  
  const exportContentStyle = {
    width: `${exportSettings.width}px`,
    height: styleHeight, // Використовуємо правильний стиль
    backgroundColor: 'white'
  }

  return (
    <div className={styles.exporterContainer}>
      <div className={styles.previewSection}>
        <h3>{language === 'uk' ? 'Попередній перегляд' : 'Preview'}</h3>
        <div className={styles.exportSettingsInfo}>
          <p>
            {/* Для відображення інфо показуємо previewHeight, який вирахував useEffect */}
            <strong>{exportSettings.width}px × {exportSettings.customSize ? exportSettings.height : previewHeight}px</strong>
            {exportSettings.customSize && (
              <span className={styles.customSizeBadge}>Custom</span>
            )}
          </p>
        </div>
        
        <div className={styles.exportPreview}>
          <div className={styles.exportContent} ref={exportRef} style={exportContentStyle}>
            <div className={styles.tiktokComment} style={{ padding: `${sizes.padding}px` }}>
              <div className={styles.commentMain} style={{ gap: `${sizes.gap}px` }}>
                <div className={styles.commentLeft}>
                  <div className={styles.avatarContainer}>
                    {comment.avatar ? (
                      <img 
                        src={comment.avatar} 
                        className={styles.commentAvatar}
                        style={{ width: `${sizes.avatarSize}px`, height: `${sizes.avatarSize}px` }}
                      />
                    ) : (
                      <div 
                        className={styles.defaultAvatar} 
                        style={{ 
                          backgroundColor: avatarData.color,
                          width: `${sizes.avatarSize}px`,
                          height: `${sizes.avatarSize}px`,
                          fontSize: `${sizes.avatarFontSize}px`
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
                      <div className={styles.commentUsername} style={{ fontSize: `${sizes.usernameFontSize}px` }}>
                        {comment.username}
                      </div>
                      {comment.verified && (
                        <span className={styles.verifiedBadge} style={{
                            width: `${sizes.verifiedSize}px`, height: `${sizes.verifiedSize}px`, fontSize: `${sizes.verifiedFontSize}px`
                          }}>✓</span>
                      )}
                    </div>
                    <div className={styles.commentText} style={{ fontSize: `${sizes.textFontSize}px` }}>
                      {comment.commentText}
                    </div>
                  </div>
                  
                  <div className={styles.commentFooter}>
                    <div className={styles.footerLeft}>
                      <div className={styles.commentDate} style={{ fontSize: `${sizes.dateFontSize}px` }}>
                        {formatDate(comment.date)}
                      </div>
                      <div className={styles.commentReply} style={{ fontSize: `${sizes.dateFontSize}px` }}>
                        {language === 'uk' ? 'Відповісти' : 'Reply'}
                      </div>
                    </div>
                    
                    <div className={styles.footerRight}>
                      <div className={styles.actionRow} style={{ gap: `${sizes.actionGap}px` }}>
                        <div className={styles.actionButton}>
                          <IoMdHeartEmpty className={styles.heartIcon} style={{ fontSize: `${sizes.iconFontSize}px` }} />
                          {formattedLikes && (
                            <span className={styles.likeCount} style={{ fontSize: `${sizes.likeFontSize}px` }}>
                              {formattedLikes}
                            </span>
                          )}
                        </div>
                        <div className={styles.actionButton}>
                          <BiDislike className={styles.dislikeIcon} style={{ fontSize: `${sizes.iconFontSize}px` }} />
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
      
      <div className={styles.controlsSection}>
        <button 
          onClick={handleExport}
          className={styles.exportButton}
          disabled={isExporting}
        >
          {isExporting ? (
             language === 'uk' ? 'Експорт...' : 'Exporting...'
          ) : (
            <>
              <span className={styles.downloadIcon}>↓</span>
              {language === 'uk' ? 'Завантажити зображення' : 'Download Image'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CommentImageExporter