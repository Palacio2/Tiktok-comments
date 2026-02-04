import { useState, useCallback, useEffect } from 'react';
import styles from './App.module.css';

import { 
  Header, 
  InfoSection, 
  CommentForm, 
  CommentImageExporter, 
  SubscriptionModal
} from '@components';

import { 
  usePro, 
  useHistory, 
  LanguageProvider 
} from '@hooks';

function MainContent() {
  const [generatedComment, setGeneratedComment] = useState(null);
  
  // Дефолтні налаштування експорту
  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    width: 1080,
    height: 'auto',
    isDark: false,
    customSize: false
  });

  const { 
    isPro, 
    activatePro, 
    isSubModalOpen, 
    setIsSubModalOpen, 
    isValidating, 
    handleBuyPro 
  } = usePro();

  const { handleGenerateComment } = useHistory();

  // Оновлюємо коментар для прев'ю
  const handlePreviewUpdate = useCallback((data) => {
    setGeneratedComment(prev => {
        // Захист від зайвих ререндерів (deep compare через stringify)
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
    });
  }, []);

  // Автозбереження в історію через 2 секунди після змін
  useEffect(() => {
    if (!generatedComment) return;

    const timeoutId = setTimeout(() => {
        handleGenerateComment(generatedComment);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [generatedComment, handleGenerateComment]);

  // Універсальна функція оновлення налаштувань (приймає об'єкт або ключ-значення)
  const updateExportSettings = useCallback((newSettings) => {
    setExportSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <div className={styles.app}>
      <Header 
        isPro={isPro} 
        onOpenPro={() => setIsSubModalOpen(true)}
      />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          
          {/* --- LEFT COLUMN (Form & Info) --- */}
          <div className={styles.formWrapper}>
            <div className={styles.scrollableContent}>
              
              <CommentForm 
                onGenerate={handlePreviewUpdate}
                exportSettings={exportSettings}
                updateExportSettings={updateExportSettings}
                isPro={isPro}
                onOpenPro={() => setIsSubModalOpen(true)}
              />
              
              <div className={styles.divider} />
              
              <InfoSection />
              
            </div>
          </div>

          {/* --- RIGHT COLUMN (Preview) --- */}
          <div className={styles.previewWrapper}>
            {generatedComment ? (
              <CommentImageExporter 
                comment={generatedComment}
                exportSettings={exportSettings}
                isPro={isPro}
                onOpenPro={() => setIsSubModalOpen(true)}
              />
            ) : (
              <div className={styles.emptyState}>
                 <div className={styles.emptyEmoji}>✨</div>
                 <p>Заповніть форму зліва, щоб побачити магію</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onBuy={handleBuyPro}
        onActivate={activatePro}
        isValidating={isValidating}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}

export default App;