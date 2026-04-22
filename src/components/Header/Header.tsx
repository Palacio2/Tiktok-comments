import React from 'react';
import { useLanguage, usePro } from '@/hooks';
import { FlagIcon, Icons, ProTimer } from '@/components/ui';

interface HeaderProps {
  currentView: 'editor' | 'library';
  onViewChange: (view: 'editor' | 'library') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { isPro, timeLeft, generationsLeft, openPro } = usePro();
  const { currentLangObj, LANGUAGES, selectLanguage, isLangMenuOpen, toggleLangMenu, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 transition-all">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('editor')}>
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 shadow-sm">
          <Icons.MusicNote size={20} />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <h1 className="text-lg font-black text-slate-900 tracking-tight m-0">
            {t('appTitle')}
          </h1>
          {isPro && (
            <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wider mt-0.5">
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

      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={openPro}
          className={`
            relative overflow-hidden flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all duration-300
            ${isPro 
              ? 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100' 
              : 'bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md'
            }
          `}
        >
          {isPro ? (
            <>
              <Icons.Crown size={16} className="text-amber-500 hidden sm:block" />
              <span className="hidden sm:inline">{t('proActive')}</span>
              
              {generationsLeft !== undefined && generationsLeft !== null && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 rounded-md border border-violet-200">
                  <Icons.Sparkles size={10} className="text-violet-500" />
                  <span className="text-[11px] font-black text-violet-700">{generationsLeft}</span>
                </div>
              )}

              {timeLeft && <ProTimer timeLeft={timeLeft} />}
            </>
          ) : (
            <>
              <Icons.Crown size={16} />
              <span className="hidden sm:inline">{t('getPro')}</span>
              <span className="sm:hidden">{t('proLabel')}</span>
            </>
          )}
        </button>

        <div className="relative">
          <button onClick={toggleLangMenu} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${isLangMenuOpen ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50/80 border-transparent hover:bg-white hover:border-slate-100'}`}>
            <FlagIcon code={currentLangObj.countryCode} />
            <span className="hidden sm:block font-bold text-slate-800 text-sm">
              {currentLangObj.code.toUpperCase()}
            </span>
            <Icons.ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-2 min-w-[180px] shadow-lg shadow-slate-200/40 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 origin-top-right">
              {LANGUAGES.map((lang: any) => (
                <button key={lang.code} onClick={() => selectLanguage(lang.code)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all ${currentLangObj.code === lang.code ? 'bg-slate-50 text-slate-900 font-bold shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium border border-transparent'}`}>
                  <FlagIcon code={lang.countryCode} className="w-5 h-5 rounded-md" />
                  <span>{lang.label}</span>
                  {currentLangObj.code === lang.code && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;