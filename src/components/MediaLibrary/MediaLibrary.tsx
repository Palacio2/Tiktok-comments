import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { Icons, Button, Input } from '@/components/ui';
import { useLanguage, usePro } from '@/hooks';
import { MEDIA_CATEGORIES } from '@/constants';
import { toast } from 'sonner';

interface BackgroundVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
}

const MediaLibrary: React.FC = () => {
  const { t } = useLanguage();
  const { isPro, openPro } = usePro();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

  const { data: backgrounds = [], isLoading } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backgrounds')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BackgroundVideo[];
    }
  });

  const filteredVideos = useMemo(() => {
    return backgrounds.filter(bg => {
      const matchesSearch = bg.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCat === 'All' || bg.category === activeCat;
      return matchesSearch && matchesCat;
    });
  }, [backgrounds, searchQuery, activeCat]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedVideos);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedVideos(newSet);
  };

  const handleDownloadSelected = () => {
    if (!isPro) {
      toast.error(t.getProModalTitle || 'Ця функція доступна лише для PRO користувачів.');
      openPro();
      return;
    }
    
    toast.success(t.downloadStarted?.replace('{count}', selectedVideos.size.toString()) || `Почалося завантаження ${selectedVideos.size} відео`);
    
    selectedVideos.forEach(id => {
      const bg = backgrounds.find(b => b.id === id);
      if (bg) {
        const link = document.createElement('a');
        link.href = bg.video_url; 
        link.download = `${bg.title.replace(/\s+/g, '_').toLowerCase()}.mp4`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    setSelectedVideos(new Set());
  };

  const handleVideoHover = (e: React.MouseEvent<HTMLVideoElement>, play: boolean) => {
    const vid = e.currentTarget;
    if (play) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col items-center text-center mb-10 mt-6">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icons.Video size={32} className="text-[#FE2C55]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{t.libraryNav || 'Бібліотека фонів'}</h1>
        <p className="text-slate-500 text-[16px] max-w-xl">
          {t.libraryDesc || 'Шукай, вибирай та завантажуй високоякісні відео-фони для своїх TikTok. Наведи курсор для попереднього перегляду.'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-24 z-40">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {MEDIA_CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all ${activeCat === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {cat === 'All' ? (t.allCategories || 'Усі категорії') : cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full sm:w-auto items-center">
          <div className="w-full sm:w-64">
            <Input 
              placeholder={t.search || "Пошук фонів..."}
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="h-11 bg-slate-50 border-slate-100"
            />
          </div>
          {selectedVideos.size > 0 && (
            <Button onClick={handleDownloadSelected} className="h-11 whitespace-nowrap rounded-xl shadow-md">
              <Icons.Download size={16} className="mr-2" />
              {t.downloadSelected?.replace('{count}', selectedVideos.size.toString()) || `Завантажити (${selectedVideos.size})`}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="w-10 h-10 border-4 border-slate-200 border-t-[#FE2C55] rounded-full animate-spin"></span>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Topic size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">{t.noResults || 'Нічого не знайдено'}</h3>
          <p className="text-slate-500">{t.tryAnotherSearch || 'Спробуй змінити запит або категорію.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((bg) => (
            <div 
              key={bg.id} 
              className={`bg-white rounded-[24px] p-2 shadow-sm border transition-all group relative ${selectedVideos.has(bg.id) ? 'border-[#FE2C55] shadow-md ring-2 ring-[#FE2C55]/20' : 'border-slate-100 hover:shadow-xl hover:border-slate-200'}`}
            >
              <div 
                onClick={() => toggleSelect(bg.id)}
                className={`absolute top-5 left-5 z-20 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all border-2 ${selectedVideos.has(bg.id) ? 'bg-[#FE2C55] border-[#FE2C55] text-white scale-110' : 'bg-black/20 border-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100'}`}
              >
                {selectedVideos.has(bg.id) && <Icons.Verified size={14} className="text-white" />}
              </div>

              <div className="relative w-full aspect-[9/16] rounded-[18px] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => toggleSelect(bg.id)}>
                <video 
                  src={bg.video_url} 
                  poster={bg.thumbnail_url}
                  muted loop playsInline
                  onMouseEnter={(e) => handleVideoHover(e, true)}
                  onMouseLeave={(e) => handleVideoHover(e, false)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 z-10 pointer-events-none">
                  <Icons.Clock size={12} className="text-white" />
                  <span className="text-white text-[11px] font-bold">{bg.duration}</span>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl z-10 pointer-events-none">
                  <span className="text-slate-900 text-[11px] font-black uppercase tracking-wider">{bg.category}</span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-slate-800 truncate">{bg.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;