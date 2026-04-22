import React from 'react';
import { Toggle, Icons, FormSection, Input } from '@/components/ui';
import { ExportSettings } from '@/types';
import { useLanguage, usePro } from '@/hooks';

interface ExportSectionProps {
  settings: ExportSettings;
  onUpdate: (settings: Partial<ExportSettings>) => void;
}

const ExportSection: React.FC<ExportSectionProps> = ({ settings, onUpdate }) => {
  const { t } = useLanguage();
  const { isPro, openPro } = usePro();

  const handlePresetChange = (preset: string) => {
    if (preset === 'auto') onUpdate({ customSize: false, width: 'auto', height: 'auto' });
    else if (preset === 'square') onUpdate({ customSize: true, width: 1080, height: 1080 });
    else if (preset === 'story') onUpdate({ customSize: true, width: 1080, height: 1920 });
  };

  const currentPreset = !settings.customSize ? 'auto' : 
                  (settings.width === 1080 && settings.height === 1080) ? 'square' :
                  (settings.width === 1080 && settings.height === 1920) ? 'story' : '';

  return (
    <FormSection title={t('exportSettings')} icon={<Icons.Download size={18} className="text-slate-400" />}>
      <div className="flex flex-col gap-4">
        
        <div className="grid grid-cols-2 gap-3 mb-1">
          <Toggle label={<span className="text-[13px] font-medium text-slate-700">{t('darkModeLabel')}</span>} checked={settings.isDark} onChange={(c) => onUpdate({ isDark: c })} />
          <Toggle label={<span className="text-[13px] font-medium text-slate-700">{t('transparentLabel')}</span>} checked={settings.isTransparent} onChange={(c) => onUpdate({ isTransparent: c })} />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Toggle label={<span className="text-[13px] font-medium text-slate-700">{t('svgFormatLabel')}</span>} checked={settings.format === 'svg'} onChange={(c) => isPro ? onUpdate({ format: c ? 'svg' : 'png' }) : openPro()} />
          <Toggle label={<span className="text-[13px] font-medium text-slate-700">{t('watermarkLabel')}</span>} checked={settings.showWatermark} onChange={(c) => isPro ? onUpdate({ showWatermark: c }) : openPro()} />
        </div>

        <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
          {['auto', 'square', 'story'].map((p) => (
            <button
              key={p}
              onClick={() => handlePresetChange(p)}
              className={`flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all ${currentPreset === p ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {p === 'auto' ? t('presetAuto') : p === 'square' ? t('presetSquare') : t('presetStory')}
            </button>
          ))}
        </div>

        {settings.customSize && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-200">
            <Input 
              type="number" 
              value={settings.width === 'auto' ? '' : settings.width} 
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 0 })} 
              placeholder={t('width')}
            />
            <Input 
              type="number" 
              value={settings.height === 'auto' ? '' : settings.height} 
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })} 
              placeholder={t('height')}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default ExportSection;