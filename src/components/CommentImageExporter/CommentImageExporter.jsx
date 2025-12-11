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
  
  if (count < 1000) {
    return count.toString()
  }
  
  if (count < 10000) {
    return Math.floor(count / 1000) + 'k'
  }
  
  return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace('.0', '') + 'k'
}

// Функція для розрахунку розмірів на основі ширини
const calculateSizes = (baseWidth) => {
  const scale = baseWidth / 1080 // Стандартна ширина
  
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

function CommentImageExporter({ comment, language, exportSettings }) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [previewHeight, setPreviewHeight] = useState(exportSettings.height)
  
  const avatarData = !comment.avatar ? getDefaultAvatarData(comment.username) : null
  
  useEffect(() => {
    if (exportRef.current) {
      const updateHeight = () => {
        const height = exportRef.current.scrollHeight
        const minHeight = exportSettings.customSize ? exportSettings.height : Math.max(600, exportSettings.height)
        setPreviewHeight(Math.max(minHeight, height))
      }
      
      updateHeight()
      const timer = setTimeout(updateHeight, 100)
      return () => clearTimeout(timer)
    }
  }, [comment, exportSettings])
  
  const handleExport = useCallback(async () => {
    if (!exportRef.current || isExporting) return
    
    setIsExporting(true)
    
    try {
      const width = exportSettings.width || 1080
      const height = exportSettings.customSize ? exportSettings.height : previewHeight
      
      const options = {
        width: width,
        height: height,
        backgroundColor: 'white',
        quality: 1.0,
        pixelRatio: exportSettings.format === 'svg' ? 1 : 2,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
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
      link.download = `tiktok-comment-${Date.now()}.${fileExtension}`
      link.href = dataUrl
      link.click()
      
    } catch (error) {
      console.error('Export error:', error)
      alert(language === 'uk' 
        ? `Не вдалося експортувати як ${exportSettings.format.toUpperCase()}. Спробуйте ще раз.` 
        : `Failed to export as ${exportSettings.format.toUpperCase()}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  }, [isExporting, previewHeight, language, exportSettings])

  const formatDate = (dateString) => {
    if (!dateString) return language === 'uk' ? '12-11' : '12-11'

    const date = new Date(dateString)

    if (isNaN(date.getTime())) return language === 'uk' ? '12-11' : '12-11'

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${month}-${day}`
  }
  
  if (!comment) return null
  
  const formattedLikes = formatLikeCount(comment.likes)
  const finalHeight = exportSettings.customSize || exportSettings.height !== 'auto' 
  ? (exportSettings.height === 'auto' ? previewHeight : exportSettings.height) 
  : previewHeight
  const sizes = calculateSizes(exportSettings.width)
  
  // Стилі для контейнера експорту
  const exportContentStyle = {
    width: `${exportSettings.width}px`,
    height: `${finalHeight}px`,
    backgroundColor: 'white'
  }

  return (
    <div className={styles.exporterContainer}>
      <div className={styles.previewSection}>
        <h3>
          {language === 'uk' ? 'Попередній перегляд для експорту' : 'Export Preview'}
        </h3>
        <div className={styles.exportSettingsInfo}>
          <p>
            <strong>{language === 'uk' ? 'Формат:' : 'Format:'}</strong> {exportSettings.format.toUpperCase()}
            <span className={styles.separator}>•</span>
            <strong>{language === 'uk' ? 'Розміри:' : 'Dimensions:'}</strong> {exportSettings.width}px × {finalHeight}px
            {exportSettings.customSize && (
              <span className={styles.customSizeBadge}>
                {language === 'uk' ? 'Власний розмір' : 'Custom Size'}
              </span>
            )}
          </p>
        </div>
        
        <div className={styles.exportPreview}>
          <div 
            className={styles.exportContent} 
            ref={exportRef}
            style={exportContentStyle}
          >
            <div 
              className={styles.tiktokComment}
              style={{ padding: `${sizes.padding}px` }}
            >
              <div 
                className={styles.commentMain}
                style={{ gap: `${sizes.gap}px` }}
              >
                <div className={styles.commentLeft}>
                  <div className={styles.avatarContainer}>
                    {comment.avatar ? (
                      <img 
                        src={comment.avatar} 
                        alt={`${language === 'uk' ? 'Аватар' : 'Avatar'} ${comment.username}`}
                        className={styles.commentAvatar}
                        style={{
                          width: `${sizes.avatarSize}px`,
                          height: `${sizes.avatarSize}px`
                        }}
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
                      <div 
                        className={styles.commentUsername}
                        style={{ fontSize: `${sizes.usernameFontSize}px` }}
                      >
                        {comment.username}
                      </div>
                      {comment.verified && (
                        <span 
                          className={styles.verifiedBadge}
                          style={{
                            width: `${sizes.verifiedSize}px`,
                            height: `${sizes.verifiedSize}px`,
                            fontSize: `${sizes.verifiedFontSize}px`
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div 
                      className={styles.commentText}
                      style={{ fontSize: `${sizes.textFontSize}px` }}
                    >
                      {comment.commentText}
                    </div>
                  </div>
                  
                  <div className={styles.commentFooter}>
                    <div className={styles.footerLeft}>
                      <div 
                        className={styles.commentDate}
                        style={{ fontSize: `${sizes.dateFontSize}px` }}
                      >
                        {formatDate(comment.date)}
                      </div>
                      <div 
                        className={styles.commentReply}
                        style={{ fontSize: `${sizes.dateFontSize}px` }}
                      >
                        {language === 'uk' ? 'Відповісти' : 'Reply'}
                      </div>
                    </div>
                    
                    <div className={styles.footerRight}>
                      <div 
                        className={styles.actionRow}
                        style={{ gap: `${sizes.actionGap}px` }}
                      >
                        <div className={styles.actionButton}>
                          <IoMdHeartEmpty 
                            className={styles.heartIcon}
                            style={{ fontSize: `${sizes.iconFontSize}px` }}
                          />
                          {formattedLikes && (
                            <span 
                              className={styles.likeCount}
                              style={{ fontSize: `${sizes.likeFontSize}px` }}
                            >
                              {formattedLikes}
                            </span>
                          )}
                        </div>
                        <div className={styles.actionButton}>
                          <BiDislike 
                            className={styles.dislikeIcon}
                            style={{ fontSize: `${sizes.iconFontSize}px` }}
                          />
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
          style={{
            background: exportSettings.format === 'svg' 
              ? 'linear-gradient(to right, #FFA726, #FF9800)'
              : 'linear-gradient(to right, var(--tiktok-pink), #FF6B6B)'
          }}
        >
          {isExporting ? (
            <>
              <span className={styles.spinner}></span>
              {language === 'uk' ? 'Експорт...' : 'Exporting...'}
            </>
          ) : (
            <>
              <span className={styles.downloadIcon}>↓</span>
              {language === 'uk' 
                ? `Завантажити як ${exportSettings.format.toUpperCase()}`
                : `Download as ${exportSettings.format.toUpperCase()}`}
            </>
          )}
        </button>
        
        <div className={styles.exportInfo}>
          <p>
            <strong>{language === 'uk' ? 'Розміри:' : 'Dimensions:'}</strong> {exportSettings.width} × {finalHeight} {language === 'uk' ? 'пікселів' : 'pixels'}
          </p>
          <p>
            <strong>{language === 'uk' ? 'Формат:' : 'Format:'}</strong> {exportSettings.format.toUpperCase()} 
            {exportSettings.format === 'svg' 
              ? language === 'uk' 
                ? ' (векторний, масштабується без втрат)' 
                : ' (vector, scales without loss)'
              : language === 'uk'
                ? ' (з високою якістю)'
                : ' (high quality)'}
          </p>
          {!exportSettings.customSize && (
            <p>
              <strong>{language === 'uk' ? 'Висота:' : 'Height:'}</strong> {language === 'uk' ? 'Автоматично підлаштовується' : 'Auto-adjusts to content'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentImageExporter