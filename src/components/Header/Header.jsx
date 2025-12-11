import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <h1>{t('title')}</h1>
        <button
          className={styles.languageToggle}
          onClick={toggleLanguage}
          aria-label={i18n.language === 'uk' ? t('switchToEnglish') : t('switchToUkrainian')}
        >
          <span className={styles.globeIcon}>🌐</span>
          <span>{i18n.language === 'uk' ? 'UA' : 'EN'}</span>
        </button>
      </div>
      <p className={styles.subtitle}>{t('subtitle')}</p>
    </header>
  );
};

export default Header;
