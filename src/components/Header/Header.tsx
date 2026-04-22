import React from 'react';
import { useLanguage, usePro } from '@/hooks';
import { FlagIcon, Icons, ProTimer } from '@/components/ui';

interface HeaderProps {
  currentView: 'editor' | 'library';
  onViewChange: (view: 'editor' | 'library') => void;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onOpenSettings }) => {
  const { isPro, timeLeft, generationsLeft, openPro } = usePro();
  const { currentLangObj, LANGUAGES, selectLanguage, isLangMenuOpen, toggleLangMenu, t } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-[150] flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 transition-all">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('editor')}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform active:scale-95">
            <Icons.MusicNote size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-[15px] sm:text-lg font-black text-slate-900 tracking-tight m-0">
              {t('appTitle')}
            </h1>
            {isPro && (
              <span className="text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wider">
                {t('proLabel')}
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex bg-slate-100/80 p-1 rounded-2xl absolute left-1/2 -translate-x-1/2">
          <button 
            onClick={() => onViewChange('editor')}
            className={`px-5 py-2 text-[14px] font-bold rounded-xl transition-all ${currentView === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('generatorNav')}
          </button>
          <button 
            onClick={() => onViewChange('library')}
            className={`px-5 py-2 text-[14px] font-bold rounded-xl transition-all flex items-center gap-1.5 ${currentView === 'library' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icons.Video size={16} />
            {t('libraryNav')}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={openPro}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-[12px] sm:text-sm transition-all ${isPro ? 'bg-slate-50 text-slate-600 border border-slate-100' : 'bg-slate-900 text-white shadow-md active:scale-95'}`}
          >
            {isPro ? (
              <>
                <Icons.Crown size={14} className="text-amber-500" />
                {generationsLeft !== null && (
                  <span className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-md text-[10px]">{generationsLeft}</span>
                )}
                <div className="hidden sm:block"><ProTimer timeLeft={timeLeft} /></div>
              </>
            ) : (
              <><Icons.Crown size={14} /><span>{t('proLabel')}</span></>
            )}
          </button>

          <div className="relative">
            <button onClick={toggleLangMenu} className="flex items-center gap-2 px-2 py-2 rounded-xl border border-transparent bg-slate-50 hover:bg-white hover:border-slate-100 transition-all active:scale-95">
              <FlagIcon code={currentLangObj.countryCode} />
              <Icons.ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Замінили умовний рендер на CSS-анімацію */}
            <div className={`absolute top-[calc(100%+8px)] right-0 bg-white border border-slate-100 rounded-2xl p-1.5 min-w-[160px] shadow-xl origin-top-right transition-all duration-200 ease-out ${isLangMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {LANGUAGES.map((lang: any) => (
                <button key={lang.code} onClick={() => { selectLanguage(lang.code); toggleLangMenu(); }} className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all ${currentLangObj.code === lang.code ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <FlagIcon code={lang.countryCode} />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/60 pb-safe z-[150]">
        <div className="flex justify-around items-center px-2 py-2">
          <button 
            onClick={() => onViewChange('editor')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${currentView === 'editor' ? 'text-[#FE2C55]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Icons.Topic size={22} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('generatorNav')}</span>
          </button>

          {currentView === 'editor' && onOpenSettings && (
            <div className="flex-shrink-0 -mt-8 mx-2 relative z-10">
              <button 
                onClick={onOpenSettings}
                className="w-14 h-14 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-[0_8px_30px_-5px_rgba(15,23,42,0.4)] border-4 border-white transition-transform active:scale-95"
              >
                <Icons.Sparkles size={22} className="text-[#00f2ea]" />
              </button>
            </div>
          )}

          <button 
            onClick={() => onViewChange('library')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${currentView === 'library' ? 'text-[#FE2C55]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Icons.Video size={22} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('libraryNav')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;