import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { usePro } from '@/hooks/usePro';
import { useLoader } from '@/hooks/useLoader';
import { CommentData, ExportSettings } from '@/types';
import Header from '@/components/Header/Header';
import CommentForm from '@/components/CommentForm/CommentForm';
import CommentImageExporter from '@/components/CommentImageExporter/CommentImageExporter';
import SubscriptionModal from '@/components/SubscriptionModal/SubscriptionModal';

const App = () => {
  const { isPro, timeLeft, openPro, closePro, showProModal, activatePro, handleBuyPro, isValidating } = usePro();
  const { t } = useLanguage();
  const { showLoader, hideLoader } = useLoader();
  
  const [commentData, setCommentData] = useState<CommentData | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    width: 500,
    height: 'auto',
    isDark: false,
    customSize: false
  });

  // Ефект початкового завантаження сайту
  useEffect(() => {
    showLoader(t.loading || 'Завантаження...');
    // Імітуємо ініціалізацію (шрифти, перевірка сесії тощо)
    const timer = setTimeout(() => {
      hideLoader();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const updateExportSettings = (settings: Partial<ExportSettings>) => {
    setExportSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <div className="app-shell bg-[#F8FAFC]">
      <Header 
        isPro={isPro} 
        timeLeft={timeLeft}
        onOpenPro={openPro} 
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-20 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-4">
            <CommentForm 
              onGenerate={setCommentData}
              exportSettings={exportSettings}
              updateExportSettings={updateExportSettings}
              isPro={isPro}
              onOpenPro={openPro}
            />
          </div>
          
          <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-8 lg:sticky lg:top-28">
            {commentData && (
              <CommentImageExporter data={commentData} settings={exportSettings} t={t} />
            )}
          </div>

        </div>
      </main>

      <SubscriptionModal 
        isOpen={showProModal} 
        onClose={closePro}
        onActivate={activatePro}
        onBuy={handleBuyPro}
        isValidating={isValidating}
        isPro={isPro}
        timeLeft={timeLeft}
        t={t}
      />
    </div>
  );
};

export default App;