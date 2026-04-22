import React, { useRef, useState } from 'react';
import { Icons } from '@/components/ui';
import { MediaType } from './MediaTabs';

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  duration?: string;
  url: string;
  thumbnail_url?: string;
}

interface MediaCardProps {
  item: MediaItem;
  type: MediaType;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, type, isSelected, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Логіка відтворення
  const togglePlay = (forcePlay?: boolean) => {
    const shouldPlay = forcePlay !== undefined ? forcePlay : !isPlaying;

    if (type === 'videos' && videoRef.current) {
      shouldPlay ? videoRef.current.play().catch(()=>{}) : (videoRef.current.pause(), videoRef.current.currentTime = 0);
    } else if (type === 'sounds' && audioRef.current) {
      shouldPlay ? audioRef.current.play().catch(()=>{}) : (audioRef.current.pause(), audioRef.current.currentTime = 0);
    }
    setIsPlaying(shouldPlay);
  };

  const handleMouseEnter = () => togglePlay(true);
  const handleMouseLeave = () => togglePlay(false);
  const handleClickPreview = () => togglePlay(); // Для мобільних (відтворення по кліку)

  // Відео довгі, звуки та меми - квадратні для компактності
  const ratioClass = type === 'videos' ? 'aspect-[9/16]' : 'aspect-square';

  return (
    <div className={`bg-white rounded-[16px] p-1.5 shadow-sm border transition-all relative group flex flex-col ${isSelected ? 'border-[#FE2C55] shadow-md ring-1 ring-[#FE2C55]/20' : 'border-slate-100 hover:border-slate-200 hover:shadow-lg'}`}>

      {/* КНОПКА ВИДІЛЕННЯ (Тільки вона тепер виділяє файл) */}
      <div 
        onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
        className={`absolute top-3 left-3 z-30 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all border-2 ${
          isSelected 
            ? 'bg-[#FE2C55] border-[#FE2C55] text-white scale-110' 
            : 'bg-black/30 border-white/60 backdrop-blur-md text-transparent hover:bg-black/50 hover:text-white/50'
        }`}
      >
        <Icons.Verified size={14} className={isSelected ? "text-white" : "currentColor"} />
      </div>

      {/* ЗОНА ПРЕВ'Ю (Відтворення) */}
      <div 
        className={`relative w-full rounded-[12px] overflow-hidden bg-slate-100 cursor-pointer ${ratioClass}`} 
        onClick={handleClickPreview}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {type === 'videos' && (
          <video ref={videoRef} src={item.url} poster={item.thumbnail_url} muted loop playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}

        {type === 'memes' && (
          <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}

        {type === 'sounds' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-300 ${isPlaying ? 'scale-110 animate-pulse' : 'group-hover:scale-110'}`}>
              {isPlaying ? <Icons.MusicNote size={20} className="text-white" /> : <Icons.Play size={20} className="text-white ml-1" />}
            </div>
            <audio ref={audioRef} src={item.url} loop />
          </div>
        )}
        
        {/* Іконка Play для відео на мобільному */}
        {type === 'videos' && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100 sm:opacity-0'}`}>
            <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Icons.Play size={18} className="text-white ml-1" />
            </div>
          </div>
        )}

        {item.duration && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center gap-1 z-10 pointer-events-none">
            <Icons.Clock size={8} className="text-white" />
            <span className="text-white text-[9px] font-bold">{item.duration}</span>
          </div>
        )}
      </div>
      
      {/* Текст теж став компактнішим */}
      <div className="pt-2 px-1 pb-0.5">
        <h3 className="text-[12px] font-bold text-slate-800 truncate leading-tight">{item.title}</h3>
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-0.5">{item.category}</p>
      </div>
    </div>
  );
};