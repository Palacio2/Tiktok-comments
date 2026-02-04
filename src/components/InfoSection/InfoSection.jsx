import React from 'react';
import { useLanguage } from '@hooks';
import { Icons } from '@components/UI/Icons'; // Імпорт
import styles from './InfoSection.module.css';

const InfoSection = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.infoWrapper}>
      {/* Updates Column */}
      <section className={styles.column}>
        <div className={styles.columnHeader}>
          <div className={`${styles.iconBox} ${styles.iconPurple}`}>
            <Icons.Bell />
          </div>
          <h3 className={styles.sectionTitle}>{t.updatesTitle || 'Updates'}</h3>
        </div>
        
        <div className={styles.updatesList}>
          {t.updates?.map((item, i) => (
            <div key={i} className={styles.updateItem}>
              <div className={styles.updateHeader}>
                <span className={styles.dateBadge}>
                  <Icons.Clock size={12} /> {item.date}
                </span>
              </div>
              <p className={styles.updateText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Column */}
      <section className={styles.column}>
        <div className={styles.columnHeader}>
          <div className={`${styles.iconBox} ${styles.iconBlue}`}>
            <Icons.Question />
          </div>
          <h3 className={styles.sectionTitle}>{t.faqTitle || 'FAQ'}</h3>
        </div>

        <div className={styles.faqList}>
          {t.faq?.map((item, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.question}>
                <span>{item.q}</span>
                <span className={styles.chevron}>
                  <Icons.ChevronDown />
                </span>
              </summary>
              <div className={styles.answerWrapper}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InfoSection;