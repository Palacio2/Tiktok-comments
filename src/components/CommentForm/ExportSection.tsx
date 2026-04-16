import React, { useState, useEffect } from 'react';
import { Toggle, Icons, FormSection, Input } from '@/components/ui';
import { ExportSettings } from '@/types';
import { TranslationSchema } from '@/utils/translations';

interface ExportSectionProps {
  settings: ExportSettings;
  onUpdate: (settings: Partial<ExportSettings>) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: TranslationSchema;
}

const ExportSection: React.FC<ExportSectionProps> = ({ 
  settings, 
  onUpdate, 
  isPro, 
  onOpenPro, 
  t 
}) => {
  const [activePreset, setActivePreset] = useState<string>('auto');

  useEffect(() => {
    if (!settings.customSize || settings.width === 'auto') {
      setActivePreset('auto');
    } else if (settings.width === 1080 && settings.height === 1080) {
      setActivePreset('square');
    } else if (settings.width === 1080 && settings.height === 1920) {
      setActivePreset('story');
    } else {
      setActivePreset('custom');
    }
  }, [settings.customSize, settings.width, settings.height]);

  const handlePresetChange = (preset: string) => {
    if (preset === 'auto') {
      onUpdate({ customSize: false, width: 'auto', height: 'auto' });
    } else if (preset === 'square') {
      onUpdate({ customSize: true, width: 1080, height: 1080 });
    } else if (preset === 'story') {
      onUpdate({ customSize: true, width: 1080, height: 1920 });
    } else if (preset === 'custom') {
      onUpdate({ 
        customSize: true, 
        width: (settings.width === 'auto' || !settings.width) ? 1080 : settings.width, 
        height: (settings.height === 'auto' || !settings.height) ? 1080 : settings.height 
      });
    }
  };

  const handleCustomChange = (field: 'width' | 'height', value: string) => {
    if (value === '') {
      onUpdate({ [field]: '' });
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onUpdate({ [field]: numValue });
    }
  };

  const getPresetLabel = (preset: string) => {
    switch (preset) {
      case 'auto': return t.presetAuto;
      case 'square': return t.presetSquare;
      case 'story': return t.presetStory;
      case 'custom': return t.presetCustom;
      default: return preset;
    }
  };

  return (
    <FormSection title={t.exportSettings || "Експорт"} icon={<Icons.Download size={18} className="text-slate-400" />}>
      <div className="flex flex-col gap-6">
        
        <div className="grid grid-cols-2 gap-4">
          <Toggle 
            label={<span className="flex items-center gap-2 text-[13px] font-medium text-slate-700">🌙 {t.darkMode}</span>} 
            checked={settings.isDark} 
            onChange={(c) => onUpdate({ isDark: c })} 
          />
          <Toggle 
            label={<span className="flex items-center gap-2 text-[13px] font-medium text-slate-700"><Icons.Sparkles size={14} /> SVG</span>} 
            checked={settings.format === 'svg'} 
            onChange={(c) => { 
              if (!isPro && c) return onOpenPro(); 
              onUpdate({ format: c ? 'svg' : 'png' }); 
            }} 
          />
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
            {['auto', 'square', 'story', 'custom'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                  activePreset === preset 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                {getPresetLabel(preset)}
              </button>
            ))}
          </div>

          {activePreset === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-top-2">
              <Input 
                label={t.width || "Ширина"} 
                type="number"
                value={settings.width === 'auto' ? '' : String(settings.width)} 
                onChange={(e) => handleCustomChange('width', e.target.value)} 
                className="py-2.5 text-[13px] bg-slate-50/50 border-slate-100 shadow-sm"
              />
              <Input 
                label={t.height || "Висота"} 
                type="number"
                value={settings.height === 'auto' ? '' : String(settings.height)} 
                onChange={(e) => handleCustomChange('height', e.target.value)} 
                className="py-2.5 text-[13px] bg-slate-50/50 border-slate-100 shadow-sm"
              />
            </div>
          )}
        </div>

      </div>
    </FormSection>
  );
};

export default ExportSection;