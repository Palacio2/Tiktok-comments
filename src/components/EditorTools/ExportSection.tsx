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
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Toggle label={<span className="text-[12px] font-bold text-slate-700">{t('darkModeLabel')}</span>} checked={settings.isDark} onChange={(c) => onUpdate({ isDark: c })} />
          <Toggle label={<span className="text-[12px] font-bold text-slate-700">{t('transparentLabel')}</span>} checked={settings.isTransparent} onChange={(c) => onUpdate({ isTransparent: c })} />
          <Toggle label={<span className="text-[12px] font-bold text-slate-700">{t('svgFormatLabel')}</span>} checked={settings.format === 'svg'} onChange={(c) => isPro ? onUpdate({ format: c ? 'svg' : 'png' }) : openPro()} />
          <Toggle label={<span className="text-[12px] font-bold text-slate-700">{t('watermarkLabel')}</span>} checked={settings.showWatermark} onChange={(c) => isPro ? onUpdate({ showWatermark: c }) : openPro()} />
        </div>

        <div className="flex p-1 bg-slate-100/50 rounded-xl mt-2">
          {['auto', 'square', 'story'].map((p) => (
            <button
              key={p} onClick={() => handlePresetChange(p)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${currentPreset === p ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {p === 'auto' ? t('presetAuto') : p === 'square' ? t('presetSquare') : t('presetStory')}
            </button>
          ))}
        </div>

        {settings.customSize && (
          <div className="grid grid-cols-2 gap-3 mt-1 animate-in slide-in-from-top-1">
            <Input type="number" value={settings.width === 'auto' ? '' : settings.width} onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 0 })} placeholder={t('width')} className="h-10 text-xs" />
            <Input type="number" value={settings.height === 'auto' ? '' : settings.height} onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })} placeholder={t('height')} className="h-10 text-xs" />
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default ExportSection;