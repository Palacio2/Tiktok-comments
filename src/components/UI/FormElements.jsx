import { FaLock } from 'react-icons/fa';
import styles from '../CommentForm/CommentForm.module.css'; // Використовуємо існуючі стилі

// Звичайне поле вводу
export const FormInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className={styles.formRow}>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} />
  </div>
);

// Чекбокс з логікою PRO
export const ProCheckbox = ({ label, name, checked, onChange, isPro, onLockClick }) => (
  <div 
    className={styles.checkboxRow} 
    onClick={() => !isPro && onLockClick?.()} 
    style={{ cursor: 'pointer' }}
  >
    <label className={styles.checkboxLabel} style={{ cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {label} {!isPro && <FaLock size={12} style={{ opacity: 0.6 }} />}
      </span>
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange} 
        disabled={!isPro} 
      />
    </label>
  </div>
);

// Кнопка для AI (всередині лейбла)
export const AiLabelButton = ({ label, buttonText, onClick, isPro }) => (
  <div className={styles.labelWithAi}>
    <label htmlFor="commentText">{label}</label>
    <button 
      type="button" 
      className={styles.aiButton} 
      onClick={onClick}
      style={!isPro ? { background: '#f5f5f5', color: '#666', border: '1px solid #ddd', boxShadow: 'none' } : {}}
    >
      {buttonText} {!isPro && <FaLock size={10} />}
    </button>
  </div>
);