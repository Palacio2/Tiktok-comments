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

function CommentImageExporter({ comment, language, exportSettings }) {
  const exportRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [previewHeight, setPreviewHeight] = useState(exportSettings.height)
  
  const avatarData = !comment.avatar ? getDefaultAvatarData(comment.username) : null
  
  useEffect(() => {
    if (exportRef.current) {
      const updateHeight = () => {
        const height = exportRef.current.scrollHeight
        const minHeight = exportSettings.height || 600
        setPreviewHeight(Math.max(minHeight, height + 60))
      }
      
      updateHeight()
      const timer = setTimeout(updateHeight, 100)
      return () => clearTimeout(timer)
    }
  }, [comment, exportSettings.height])
  
  const handleExport = useCallback(async () => {
    if (!exportRef.current || isExporting) return
    
    setIsExportting(true)
    
    try {
      const width = exportSettings.width || 1080
      const height = exportSettings.customSize ? exportSettings.height : previewHeight
      
      const options = {
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'white',
        },
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
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
      setIsExportting(false)
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
  const finalHeight = exportSettings.customSize ? exportSettings.height : previewHeight

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
          <div className={styles.exportContent} ref={exportRef}>
            <div className={styles.tiktokComment} style={{
              padding: `${Math.min(40, 40 * (exportSettings.width / 1080))}px`
            }}>
              <div className={styles.commentMain} style={{
                gap: `${Math.min(32, 32 * (exportSettings.width / 1080))}px`
              }}>
                <div className={styles.commentLeft}>
                  <div className={styles.avatarContainer}>
                    {comment.avatar ? (
                      <img 
                        src={comment.avatar} 
                        alt={`${language === 'uk' ? 'Аватар' : 'Avatar'} ${comment.username}`}
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
                      <div className={styles.commentUsername} style={{
                        fontSize: `${Math.min(38, 38 * (exportSettings.width / 1080))}px`
                      }}>
                        {comment.username}
                      </div>
                      {comment.verified && (
                        <span className={styles.verifiedBadge} style={{
                          width: `${Math.min(32, 32 * (exportSettings.width / 1080))}px`,
                          height: `${Math.min(32, 32 * (exportSettings.width / 1080))}px`,
                          fontSize: `${Math.min(18, 18 * (exportSettings.width / 1080))}px`
                        }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <div className={styles.commentText} style={{
                      fontSize: `${Math.min(42, 42 * (exportSettings.width / 1080))}px`
                    }}>
                      {comment.commentText}
                    </div>
                  </div>
                  
                  <div className={styles.commentFooter}>
                    <div className={styles.footerLeft}>
                      <div className={styles.commentDate} style={{
                        fontSize: `${Math.min(36, 36 * (exportSettings.width / 1080))}px`
                      }}>
                        {formatDate(comment.date)}
                      </div>
                      <div className={styles.commentReply} style={{
                        fontSize: `${Math.min(36, 36 * (exportSettings.width / 1080))}px`
                      }}>
                        {language === 'uk' ? 'Відповісти' : 'Reply'}
                      </div>
                    </div>
                    
                    <div className={styles.footerRight}>
                      <div className={styles.actionRow} style={{
                        gap: `${Math.min(40, 40 * (exportSettings.width / 1080))}px`
                      }}>
                        <div className={styles.actionButton}>
                          <IoMdHeartEmpty className={styles.heartIcon} style={{
                            fontSize: `${Math.min(46, 46 * (exportSettings.width / 1080))}px`
                          }} />
                          {formattedLikes && (
                            <span className={styles.likeCount} style={{
                              fontSize: `${Math.min(34, 34 * (exportSettings.width / 1080))}px`
                            }}>
                              {formattedLikes}
                            </span>
                          )}
                        </div>
                        <div className={styles.actionButton}>
                          <BiDislike className={styles.dislikeIcon} style={{
                            fontSize: `${Math.min(48, 48 * (exportSettings.width / 1080))}px`
                          }} />
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