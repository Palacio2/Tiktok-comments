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
    commentData, activeEditId, setActiveEditId, handleLiveUpdate,
    handleActiveDataUpdate, handleAddReply, handleRandomize,
    handleClearAction, activeData
  } = useEditorState();

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png', width: 500, height: 'auto', isDark: false,
    isTransparent: false, showWatermark: !isPro, customSize: false
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
    <div className="app-shell bg-[#FDFDFD] min-h-screen relative overflow-x-hidden flex flex-col">
      {/* ПЕРЕДАЄМО onOpenSettings У ХЕДЕР */}
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <main className={`flex-1 w-full flex flex-col p-4 sm:p-8 ${currentView === 'editor' ? 'justify-center items-center pb-32 sm:pb-20' : 'pb-24 sm:pb-20'}`}>
        {currentView === 'editor' ? (
          <div className="w-full max-w-2xl relative">
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur text-white text-[11px] font-black uppercase py-2 px-5 rounded-full shadow-lg flex items-center gap-2">
                <Icons.Sparkles size={14} className="text-[#00f2ea]" />
                {t('liveEditHint')}
              </div>
            </div>

            <CommentImageExporter 
              data={commentData} settings={exportSettings} onLiveUpdate={handleLiveUpdate}
              activeEditId={activeEditId} onSelectEdit={setActiveEditId}
              onAddReply={handleAddReply} onAvatarClick={handlePick}
            />
          </div>
        ) : (
          <MediaLibrary />
        )}
      </main>

      {/* Кнопка тепер прихована на мобільному (hidden md:flex) */}
      {currentView === 'editor' && !isSettingsOpen && (
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hidden md:flex fixed z-[180] bg-slate-900 text-white h-14 px-8 rounded-2xl shadow-2xl transition-all items-center gap-3 font-black uppercase text-[12px] tracking-widest bottom-8 left-8 hover:scale-105 active:scale-95"
        >
          <Icons.Sparkles size={18} />
          {t('toolbar')}
        </button>
      )}

      <FloatingPanel isOpen={isSettingsOpen && currentView === 'editor'} onClose={() => setIsSettingsOpen(false)} title={t('toolbar')}>
        <AiToolsSection 
          textToEdit={activeEditId === 'main' ? commentData.commentText : (activeData as ReplyData).text}
          onTextChange={(val) => handleActiveDataUpdate(activeEditId === 'main' ? 'commentText' : 'text', val)}
          onAvatarChange={(url) => handleActiveDataUpdate('avatarUrl', url)} 
          onAddReply={() => handleAddReply(activeEditId === 'main' ? undefined : (activeData as ReplyData).username)}
          onClear={handleClearAction} onRandomize={handleRandomize} isMainComment={activeEditId === 'main'}
        />
        <BadgesSection formData={activeData} onChange={handleActiveDataUpdate} onAvatarChange={(url) => handleActiveDataUpdate('avatarUrl', url)} />
        <ExportSection settings={exportSettings} onUpdate={updateExportSettings} />
      </FloatingPanel>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <SubscriptionModal />
      <Toaster position="top-center" richColors closeButton />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default App;