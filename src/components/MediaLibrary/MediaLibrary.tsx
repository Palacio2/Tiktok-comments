import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { Icons, Button, Input } from '@/components/ui';
import { useLanguage, usePro } from '@/hooks';
import { MEDIA_CATEGORIES } from '@/constants';
import { toast } from 'sonner';
import { MediaTabs, MediaType } from './MediaTabs';
import { MediaCard, MediaItem } from './MediaCard';

const MediaLibrary: React.FC = () => {
  const { t } = useLanguage();
  const { isPro, openPro } = usePro();
  
  const [activeType, setActiveType] = useState<MediaType>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Динамічний запит до різних таблиць Supabase залежно від вибраного ТАБу
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['media', activeType],
    queryFn: async () => {
      // Зкидаємо виділення при перемиканні табів
      setSelectedItems(new Set()); 

      let tableName = 'backgrounds';
      if (activeType === 'sounds') tableName = 'sounds';
      if (activeType === 'memes') tableName = 'memes';

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Уніфікуємо дані для MediaCard
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        duration: item.duration,
        url: item.video_url || item.audio_url || item.image_url,
        thumbnail_url: item.thumbnail_url
      })) as MediaItem[];
    }
  });

  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCat === 'All' || item.category === activeCat;
      return matchesSearch && matchesCat;
    });
  }, [mediaItems, searchQuery, activeCat]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleDownloadSelected = () => {
    if (!isPro) {
      toast.error(t('proOnlyFeature'));
      openPro();
      return;
    }
    
    toast.success(t('downloadStarted', { count: selectedItems.size }));
    
    selectedItems.forEach(id => {
      const item = mediaItems.find(b => b.id === id);
      if (item) {
        const link = document.createElement('a');
        link.href = item.url; 
        
        // Визначаємо правильне розширення файлу
        const ext = activeType === 'videos' ? 'mp4' : activeType === 'sounds' ? 'mp3' : 'png';
        link.download = `${item.title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
        
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    setSelectedItems(new Set());
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ОНОВЛЕНИЙ ЗАГОЛОВОК HUB */}
      <div className="flex flex-col items-center text-center mb-8 mt-2 sm:mt-6 px-4">
        <div className="w-16 h-16 bg-slate-900 rounded-[20px] flex items-center justify-center mb-4 shadow-xl shadow-slate-900/20">
          <Icons.Crown size={32} className="text-[#00f2ea]" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">{t('hubTitle')}</h1>
        <p className="text-slate-500 text-[14px] sm:text-[16px] max-w-lg leading-relaxed">
          {t('hubDesc')}
        </p>
      </div>

      <MediaTabs activeType={activeType} onChange={setActiveType} />

      <div className="bg-white p-3 sm:p-4 rounded-[24px] shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-3 items-center justify-between sticky top-[64px] sm:top-24 z-40">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 snap-x">
          {MEDIA_CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all snap-start ${
                activeCat === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? t('allCategories') : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          <div className="w-full sm:w-64 shrink-0">
            <Input 
              placeholder={t('search')}
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="h-11 bg-slate-50 border-slate-100 w-full !rounded-xl"
            />
          </div>
          {selectedItems.size > 0 && (
            <Button onClick={handleDownloadSelected} className="h-11 w-full sm:w-auto whitespace-nowrap !rounded-xl shadow-md text-[14px]">
              <Icons.Download size={16} className="mr-2" />
              {t('downloadSelected', { count: selectedItems.size })}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="w-10 h-10 border-4 border-slate-200 border-t-[#00f2ea] rounded-full animate-spin"></span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Icons.Topic size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">{t('noResults')}</h3>
          <p className="text-slate-500 text-sm mt-1">{t('tryAnotherSearch')}</p>
        </div>
      ) : (
        /* ОНОВЛЕНА ЩІЛЬНА СІТКА */
        <div className={`grid gap-2 sm:gap-4 ${
          activeType === 'videos' 
            ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'
        }`}>
          {filteredItems.map((item) => (
            <MediaCard 
              key={item.id} 
              item={item} 
              type={activeType} 
              isSelected={selectedItems.has(item.id)} 
              onToggle={toggleSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;