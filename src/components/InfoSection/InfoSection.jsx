import styles from './InfoSection.module.css';

function InfoSection({ t }) {
  if (!t || !t.faq) return null;

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.column}>
        <h3 className={styles.sectionTitle}>{t.updatesTitle}</h3>
        <div className={styles.list}>
          {t.updates.map((item, i) => (
            <div key={i} className={styles.updateItem}>
              <span className={styles.date}>{item.date}</span>
              <p className={styles.text}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <h3 className={styles.sectionTitle}>{t.faqTitle}</h3>
        <div className={styles.list}>
          {t.faq.map((item, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.question}>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;