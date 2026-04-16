import React from 'react';
import { ReplyData } from '@/types';
import { Input, Button, Icons, Toggle } from '@/components/ui';
import AvatarUploader from './AvatarUploader';
import AiGenerator from './AiGenerator';
import { TranslationSchema } from '@/utils/translations';

interface RepliesManagerProps {
  replies: ReplyData[];
  onChange: (replies: ReplyData[]) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: TranslationSchema;
}

const RepliesManager: React.FC<RepliesManagerProps> = ({ replies, onChange, isPro, onOpenPro, t }) => {
  const addReply = () => {
    if (replies.length >= 5) return;
    const newReply: ReplyData = {
      id: Date.now().toString(),
      username: 'tiktok_gen',
      text: 'Me too! 🙌',
      timeAgo: '1h',
      likes: '10',
      avatarUrl: null,
      isLikedByCreator: false,
      isAuthor: false,
      isVerified: false
    };
    onChange([...replies, newReply]);
  };

  const removeReply = (id: string) => {
    onChange(replies.filter(r => r.id !== id));
  };

  const updateReply = (id: string, field: keyof ReplyData, value: any) => {
    onChange(replies.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply, index) => (
        <div key={reply.id} className="relative bg-slate-50/50 border border-slate-100 p-5 rounded-[20px] shadow-[0_1px_5px_-3px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-left-4">
          
          <div className="flex justify-between items-center mb-5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {t.replyNumber || 'Відповідь'} #{index + 1}
            </span>
            <button 
              onClick={() => removeReply(reply.id)} 
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all"
            >
              <Icons.Trash size={15} />
            </button>
          </div>
          
          <div className="flex flex-row gap-5 items-start">
            <div className="shrink-0 w-16">
              <AvatarUploader 
                currentAvatar={reply.avatarUrl} 
                onUpload={(url) => updateReply(reply.id, 'avatarUrl', url)} 
                isPro={isPro} 
                onOpenPro={onOpenPro} 
                t={t} 
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t.username || "Username"}
                  value={reply.username}
                  onChange={(e) => updateReply(reply.id, 'username', e.target.value)}
                  onBlur={(e) => {
                    if (!e.target.value.trim()) updateReply(reply.id, 'username', 'tiktok_gen');
                  }}
                  className="py-2.5 text-[13px] bg-white border-slate-100 shadow-sm"
                />
                <Input
                  label={t.time || "Час"}
                  value={reply.timeAgo}
                  onChange={(e) => updateReply(reply.id, 'timeAgo', e.target.value)}
                  className="py-2.5 text-[13px] bg-white border-slate-100 shadow-sm"
                />
              </div>
              
              <div className="relative">
                <textarea
                  value={reply.text}
                  onChange={(e) => updateReply(reply.id, 'text', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-white text-slate-800 text-[14px] outline-none focus:border-slate-300 transition-all resize-none min-h-[70px] shadow-sm"
                />
                <div className="absolute bottom-2 right-2">
                  <AiGenerator 
                    onGenerate={(text) => updateReply(reply.id, 'text', text)} 
                    isPro={isPro} 
                    onOpenPro={onOpenPro} 
                    t={t} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Toggle
                  label={<span className="text-[12px] font-semibold flex items-center gap-1.5"><Icons.Heart size={13} className="text-[#FE2C55]"/> {t.likes || 'Лайк'}</span>}
                  checked={reply.isLikedByCreator}
                  onChange={(c) => updateReply(reply.id, 'isLikedByCreator', c)}
                />
                <Toggle
                  label={<span className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5"><Icons.Verified size={13} className="text-[#20D5EC]" /> {t.verified || 'Галочка'}</span>}
                  checked={reply.isVerified || false}
                  onChange={(c) => updateReply(reply.id, 'isVerified', c)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {replies.length < 5 && (
        <Button variant="secondary" onClick={addReply} className="w-full py-4 border-dashed border-2 border-slate-200 bg-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 shadow-none transition-all">
          <Icons.Plus size={18} className="mr-2" />
          {t?.addReply || 'Додати відповідь'}
        </Button>
      )}
    </div>
  );
};

export default RepliesManager;