import React, { useState, useEffect } from 'react';
import styles from './FormElements.module.css';

// --- Icons System ---
// Збираємо всі іконки в один об'єкт для чистоти коду
const Icons = {
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Sparkles: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  Clock: ({ size = 12, style }) => (
    <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )
};

// --- Flag Component ---
export const FlagIcon = ({ code }) => {
  if (!code) return null;
  return (
    <img 
      src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`} 
      width="20" 
      height="15" 
      alt={code} 
      style={{ borderRadius: '3px', objectFit: 'cover', display: 'block' }} 
    />
  );
};

// --- Input Component ---
export const FormInput = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className={styles.inputGroup}>
    {label && <label className={styles.label}>{label}</label>}
    <input 
      className={styles.input}
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

// --- Pro Timer Component ---
export const ProTimer = ({ date, t = {} }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  // Дефолтні тексти, якщо t не передано
  const text = {
    expired: t.proExpired || 'Expired',
    days: t.days || 'd',
    hours: t.hours || 'h',
    minutes: t.minutes || 'm'
  };

  useEffect(() => {
    if (!date) return;

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(date);
      const diff = end - now;

      if (diff <= 0) return text.expired;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}${text.days}`);
      // Показуємо години, якщо є дні або самі години > 0
      if (hours > 0 || days > 0) parts.push(`${hours}${text.hours}`);
      // Хвилини показуємо завжди, якщо не залишилось лише днів
      if (days === 0) parts.push(`${minutes}${text.minutes}`);

      return parts.slice(0, 2).join(' ');
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      const result = calculateTime();
      setTimeLeft(result);
      if (result === text.expired) clearInterval(interval);
    }, 60000);

    return () => clearInterval(interval);
  }, [date, text.days, text.hours, text.minutes, text.expired]);

  if (!date) return <span className={styles.timerWrapper}>PRO</span>;

  return (
    <span className={styles.timerWrapper}>
      {timeLeft} <Icons.Clock style={{ opacity: 0.7 }} />
    </span>
  );
};

// --- Toggle Component ---
export const ProToggle = ({ label, name, checked, onChange, isPro, onLockClick, timerDate }) => (
  <div 
    className={`${styles.toggleRow} ${!isPro ? styles.disabledRow : ''}`}
    onClick={() => !isPro && onLockClick?.()}
  >
    <div className={styles.toggleLabelGroup}>
      <span className={styles.toggleLabelText}>{label}</span>
      {!isPro ? (
        <span className={styles.lockIcon}><Icons.Lock /></span>
      ) : timerDate ? (
        <ProTimer date={timerDate} />
      ) : null}
    </div>
    
    <label className={styles.switch}>
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange} 
        disabled={!isPro} 
      />
      <span className={styles.slider}></span>
    </label>
  </div>
);

// --- AI Button Component ---
export const AiLabelButton = ({ label, buttonText, onClick, isPro, isLoading }) => (
  <div className={styles.aiLabelRow}>
    <label className={styles.label}>{label}</label>
    <button 
      type="button" 
      className={`${styles.aiButton} ${!isPro ? styles.aiButtonLocked : ''}`} 
      onClick={isPro ? onClick : undefined}
      disabled={isLoading || !isPro}
    >
      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : (
        <>
          <Icons.Sparkles />
          <span>{buttonText}</span>
          {!isPro && <Icons.Lock />}
        </>
      )}
    </button>
  </div>
);