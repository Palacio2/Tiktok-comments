import React from 'react';
import { useLanguage } from '@hooks';
import styles from './Header.module.css';
import { FlagIcon } from '@components'; // Перевірте шлях

// Локальні SVG іконки для єдиного стилю (Line Art)
const Icons = {
  MusicNote: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Crown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
};

function Header({ isPro, onOpenPro }) {
  const { 
    currentLangObj, 
    LANGUAGES, 
    selectLanguage, 
    isLangMenuOpen, 
    toggleLangMenu,
    t 
  } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIconWrapper}>
          <Icons.MusicNote />
        </div>
        <div className={styles.logoTextWrapper}>
          <h1 className={styles.logoTitle}>{t.appTitle || 'TikTok Gen'}</h1>
          {isPro && <span className={styles.proBadge}>PRO</span>}
        </div>
      </div>

      <div className={styles.controls}>
        {/* Кнопка PRO */}
        <button 
          className={`${styles.proBtn} ${isPro ? styles.proActive : ''}`}
          onClick={onOpenPro}
        >
          {isPro ? (
            <>
              <span className={styles.proIconActive}><Icons.Crown /></span>
              <span className={styles.proText}>{t.proActive || 'PRO Active'}</span>
            </>
          ) : (
            <>
              <Icons.Crown />
              <span className={styles.proText}>{t.getPro || 'Get PRO'}</span>
            </>
          )}
        </button>

        {/* Перемикач мови */}
        <div className={styles.langWrapper}>
          <button 
            className={`${styles.langBtn} ${isLangMenuOpen ? styles.langBtnActive : ''}`} 
            onClick={toggleLangMenu}
          >
            <div className={styles.flagWrapper}>
              <FlagIcon code={currentLangObj.countryCode} />
            </div>
            <span className={styles.langCode}>{currentLangObj.code.toUpperCase()}</span>
            <span className={` ${styles.chevron} ${isLangMenuOpen ? styles.chevronRotate : ''}`}>
              <Icons.ChevronDown />
            </span>
          </button>

          {isLangMenuOpen && (
            <div className={styles.langDropdown}>
              {LANGUAGES.map((lang) => (
                <button 
                  key={lang.code} 
                  className={`${styles.langOption} ${currentLangObj.code === lang.code ? styles.langOptionActive : ''}`}
                  onClick={() => selectLanguage(lang.code)}
                >
                  <span className={styles.optionFlag}>
                    <FlagIcon code={lang.countryCode} />
                  </span>
                  <span className={styles.optionLabel}>{lang.label}</span>
                  {currentLangObj.code === lang.code && <div className={styles.activeDot} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;