import React from 'react';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';

export type MediaType = 'videos' | 'sounds' | 'memes';

interface MediaTabsProps {
  activeType: MediaType;
  onChange: (type: MediaType) => void;
}

export const MediaTabs: React.FC<MediaTabsProps> = ({ activeType, onChange }) => {
  const { t } = useLanguage();

  const TABS: { id: MediaType; label: string; icon: React.ReactNode }[] = [
    { id: 'videos', label: t('tabVideos'), icon: <Icons.Video size={18} /> },
    { id: 'sounds', label: t('tabSounds'), icon: <Icons.MusicNote size={18} /> },
    { id: 'memes', label: t('tabMemes'), icon: <Icons.Topic size={18} /> }
  ];

  return (
    <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2 snap-x mb-2 sm:justify-center">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-[16px] text-[14px] font-bold whitespace-nowrap transition-all snap-start shadow-sm border ${
            activeType === tab.id 
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <span className={activeType === tab.id ? 'text-[#00f2ea]' : 'text-slate-400'}>
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};