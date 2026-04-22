import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useLanguage, usePro, useFileUploader } from '@/hooks';
import { ExportSettings, ReplyData } from '@/types';

import Header from '@/components/Header/Header';
import CommentImageExporter from '@/components/CommentImageExporter/CommentImageExporter';
import SubscriptionModal from '@/components/SubscriptionModal/SubscriptionModal';
import FloatingPanel from '@/components/FloatingPanel/FloatingPanel';
import BadgesSection from '@/components/FloatingPanel/BadgesSection';
import ExportSection from '@/components/EditorTools/ExportSection';
import AiToolsSection from '@/components/FloatingPanel/AiToolsSection';
import MediaLibrary from '@/components/MediaLibrary/MediaLibrary';
import Footer from '@/components/Footer/Footer';
import { Icons } from '@/components/ui';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { useEditorState } from '@/hooks/useEditorState';

const App = () => {
  const { isPro } = usePro(); 
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'editor' | 'library'>('editor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  
  const {
    commentData,
    activeEditId,
    setActiveEditId,
    handleLiveUpdate,
    handleActiveDataUpdate,
    handleAddReply,
    handleRandomize,
    handleClearAction,
    activeData
  } = useEditorState();

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    width: 500,
    height: 'auto',
    isDark: false,
    isTransparent: false,
    showWatermark: !isPro,
    customSize: false
  });

  useEffect(() => {
    setExportSettings(prev => ({ ...prev, showWatermark: !isPro }));
  }, [isPro]);

  const updateExportSettings = (settings: Partial<ExportSettings>) => {
    setExportSettings(prev => ({ ...prev, ...settings }));
  };

  const { fileInputRef, handlePick, handleFileChange } = useFileUploader((url) => 
    handleActiveDataUpdate('avatarUrl', url)
  );

  return (
    <div className="app-shell bg-[#F8FAFC] min-h-screen relative overflow-x-hidden flex flex-col">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'editor' ? (
        <main className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 pb-20">
          <div className="w-full max-w-2xl relative">
            <div className="absolute -top-14 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <div className="bg-slate-900 text-white text-[13px] font-bold py-2 px-5 rounded-full shadow-xl flex items-center gap-2">
                <Icons.Sparkles size={16} className="text-[#00f2ea]" />
                {t('liveEditHint')}
              </div>
            </div>

            <CommentImageExporter 
              data={commentData} 
              settings={exportSettings} 
              onLiveUpdate={handleLiveUpdate}
              activeEditId={activeEditId}
              onSelectEdit={setActiveEditId}
              onAddReply={handleAddReply}
              onAvatarClick={handlePick}
            />
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full p-4 sm:p-8 pb-20">
          <MediaLibrary />
        </main>
      )}

      {currentView === 'editor' && !isSettingsOpen && (
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="fixed bottom-8 left-8 z-50 bg-slate-900 text-white h-14 px-6 rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-700 hover:scale-105 hover:bg-slate-800 transition-all flex items-center gap-2 font-bold"
        >
          <Icons.Sparkles size={20} />
          {t('toolbar')}
        </button>
      )}

      {currentView === 'editor' && (
        <FloatingPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t('toolbar')}>
          <AiToolsSection 
            textToEdit={activeEditId === 'main' ? commentData.commentText : (activeData as ReplyData).text}
            onTextChange={(val) => handleActiveDataUpdate(activeEditId === 'main' ? 'commentText' : 'text', val)}
            onAvatarChange={(url) => handleActiveDataUpdate('avatarUrl', url)} 
            onAddReply={() => handleAddReply(activeEditId === 'main' ? undefined : (activeData as ReplyData).username)}
            onClear={handleClearAction}
            onRandomize={handleRandomize}
            isMainComment={activeEditId === 'main'}
          />
          <BadgesSection 
            formData={activeData} 
            onChange={handleActiveDataUpdate} 
            onAvatarChange={(url) => handleActiveDataUpdate('avatarUrl', url)} 
          />
          <ExportSection settings={exportSettings} onUpdate={updateExportSettings} />
        </FloatingPanel>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      <SubscriptionModal />
      
      <Toaster position="top-center" richColors closeButton />

      {/* Юридичний Футер та Банер Cookies */}
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default App;