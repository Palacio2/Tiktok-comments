import { useRef, useState, useEffect } from 'react'
import { useCommentExporter } from '../../hooks/useCommentExporter'
import CommentPreview from './CommentPreview/CommentPreview'
import ExportControls from './ExportControls/ExportControls'
import styles from './CommentImageExporter.module.css'

function CommentImageExporter({ comment, exportSettings }) {
  const exportRef = useRef(null)
  const [previewHeight, setPreviewHeight] = useState(exportSettings.height)
  const { isExporting, handleExport } = useCommentExporter(exportRef, exportSettings, previewHeight);

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

  if (!comment) return null
  
  const finalHeight = exportSettings.customSize ? exportSettings.height : previewHeight

  return (
    <div className={styles.exporterContainer}>
      <CommentPreview
        comment={comment}
        exportSettings={exportSettings}
        finalHeight={finalHeight}
        exportRef={exportRef}
      />
      <ExportControls
        exportSettings={exportSettings}
        finalHeight={finalHeight}
        isExporting={isExporting}
        handleExport={handleExport}
      />
    </div>
  )
}

export default CommentImageExporter