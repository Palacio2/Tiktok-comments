import { useTranslation } from 'react-i18next';
import styles from './ExportControls.module.css';

const ExportControls = ({ exportSettings, finalHeight, isExporting, handleExport }) => {
  const { t } = useTranslation();

  return (
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
            {t('exporting')}
          </>
        ) : (
          <>
            <span className={styles.downloadIcon}>↓</span>
            {t('downloadAs', { format: exportSettings.format.toUpperCase() })}
          </>
        )}
      </button>
      <div className={styles.exportInfo}>
        <p>
          <strong>{t('dimensions')}</strong> {exportSettings.width} × {finalHeight} {t('pixels')}
        </p>
        <p>
          <strong>{t('format')}</strong> {exportSettings.format.toUpperCase()}
          {exportSettings.format === 'svg'
            ? t('svgHint')
            : t('pngHint')}
        </p>
        {!exportSettings.customSize && (
          <p>
            <strong>{t('height')}</strong> {t('heightAuto')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExportControls;
