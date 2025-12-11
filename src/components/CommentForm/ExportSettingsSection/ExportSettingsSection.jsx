import { useTranslation } from 'react-i18next';
import styles from './ExportSettingsSection.module.css';

const ExportSettingsSection = ({ exportSettings, handleExportSettingsChange, presetSizes }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>{t('exportSettings')}</h3>
      <div className={styles.formRow}>
        <label htmlFor="format">{t('fileFormat')}</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="png"
              checked={exportSettings.format === 'png'}
              onChange={handleExportSettingsChange}
            />
            <span>{t('pngFormat')}</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="svg"
              checked={exportSettings.format === 'svg'}
              onChange={handleExportSettingsChange}
            />
            <span>{t('svgFormat')}</span>
          </label>
        </div>
      </div>
      <div className={styles.formRow}>
        <label htmlFor="presetSize">{t('imageSize')}</label>
        <select
          id="presetSize"
          name="presetSize"
          value={`${exportSettings.width}×${exportSettings.height}`}
          onChange={handleExportSettingsChange}
          className={styles.selectInput}
          disabled={exportSettings.customSize}
        >
          {presetSizes.map(size => (
            <option key={`${size.width}×${size.height}`} value={`${size.width}×${size.height}`}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <span>{t('customSize')}</span>
          <input
            type="checkbox"
            name="useCustomSize"
            checked={exportSettings.customSize}
            onChange={handleExportSettingsChange}
          />
        </label>
      </div>
      {exportSettings.customSize && (
        <div className={styles.dimensionsRow}>
          <div className={styles.dimensionInput}>
            <label htmlFor="customWidth">{t('width')}</label>
            <input
              type="number"
              id="customWidth"
              name="customWidth"
              value={exportSettings.width}
              onChange={handleExportSettingsChange}
              min="100"
              max="5000"
              step="10"
            />
            <span>px</span>
          </div>
          <div className={styles.dimensionSeparator}>×</div>
          <div className={styles.dimensionInput}>
            <label htmlFor="customHeight">{t('height')}</label>
            <input
              type="number"
              id="customHeight"
              name="customHeight"
              value={exportSettings.height}
              onChange={handleExportSettingsChange}
              min="100"
              max="5000"
              step="10"
            />
            <span>px</span>
          </div>
        </div>
      )}
      <div className={styles.sizePreview}>
        <div className={styles.sizePreviewBox}>
          <span>{exportSettings.width} × {exportSettings.height} px</span>
        </div>
        <small>
          {exportSettings.format === 'svg'
            ? t('svgHint')
            : t('pngHint')}
        </small>
      </div>
    </div>
  );
};

export default ExportSettingsSection;
