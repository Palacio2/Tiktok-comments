import React from 'react';
import { ReplyData } from '@/types';
import { Icons, Avatar, EditableText } from '@/components/ui';
import { useLanguage } from '@/hooks';

interface ReplyItemProps {
  reply: ReplyData;
  isDark: boolean;
  isActive?: boolean;
  onSelect?: () => void;
  onLiveUpdate?: (field: keyof ReplyData, value: string) => void;
  onAddReply?: (replyToUsername?: string) => void;
  onAvatarClick?: () => void;
}

const ReplyItem = ({ reply, isDark, isActive, onSelect, onLiveUpdate, onAddReply, onAvatarClick }: ReplyItemProps) => {
  const { t } = useLanguage();

  const handleUpdate = (field: keyof ReplyData) => (value: string) => {
    if (onLiveUpdate) onLiveUpdate(field, value);
  };

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); if (onSelect) onSelect(); }}
      className={`font-tiktok flex gap-2.5 sm:gap-3.5 animate-in fade-in slide-in-from-top-2 p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl cursor-default transition-all border border-transparent ${isActive ? (isDark ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm') : 'hover:bg-slate-50/50'}`}
    >
      <Avatar 
        url={reply.avatarUrl} 
        size="sm" 
        isDark={isDark} 
        onClick={(e) => { e.stopPropagation(); onSelect?.(); onAvatarClick?.(); }} 
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap leading-tight mb-1">
          <EditableText 
            text={reply.username}
            onBlur={handleUpdate('username')}
            className={`text-[14px] font-semibold truncate max-w-[120px] sm:max-w-[150px] px-1 -ml-1 hover:bg-slate-200/50 focus:bg-slate-200/50 ${isDark ? 'text-white/70 hover:bg-white/10 focus:bg-white/10' : 'text-[#6b6f76]'}`}
          />
          
          {reply.replyingTo && (
            <>
              <Icons.Play size={8} className={`mx-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
              <EditableText 
                text={reply.replyingTo}
                onBlur={handleUpdate('replyingTo')}
                className={`text-[14px] font-semibold truncate max-w-[120px] sm:max-w-[150px] px-1 hover:bg-slate-200/50 focus:bg-slate-200/50 ${isDark ? 'text-white/70 hover:bg-white/10 focus:bg-white/10' : 'text-[#6b6f76]'}`}
              />
            </>
          )}

          {reply.isVerified && <Icons.Verified size={13} className="text-[#20D5EC] shrink-0 ml-1" />}
          {reply.isAuthor && <span className={`text-[13px] font-semibold ml-1 ${isDark ? 'text-[#20D5EC]' : 'text-[#00a896]'}`}>{t('authorBadgeLabel')}</span>}
        </div>

        <EditableText 
          as="p"
          text={reply.text}
          onBlur={handleUpdate('text')}
          className={`text-[15px] leading-[1.35] whitespace-pre-wrap break-words px-1 -ml-1 hover:bg-slate-200/50 focus:bg-slate-200/50 ${isDark ? 'text-white/95 hover:bg-white/10 focus:bg-white/10' : 'text-[#161722]'}`}
        />
        
        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <EditableText 
              text={reply.timeAgo}
              onBlur={handleUpdate('timeAgo')}
              className={`text-[12.5px] font-medium px-1 -ml-1 hover:bg-slate-200/50 focus:bg-slate-200/50 ${isDark ? 'text-white/50 hover:bg-white/10 focus:bg-white/10' : 'text-[#8a8b91]'}`}
            />
            <span 
              onClick={(e) => { e.stopPropagation(); onAddReply?.(reply.username); }}
              className={`text-[12.5px] font-bold cursor-pointer hover:underline ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}
            >
              {t('replyAction')}
            </span>
            
            {reply.isLikedByCreator && (
              <div className="relative flex items-center justify-center ml-0.5">
                <div className={`w-[16px] h-[16px] rounded-full overflow-hidden border-[0.5px] ${isDark ? 'border-white/10 bg-slate-800' : 'border-black/10 bg-slate-100'}`}>
                  <Icons.User size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                </div>
                <div className={`absolute -bottom-1 -right-1 rounded-full p-[2px] ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
                  <Icons.Heart size={8} className="text-[#ff3b5c] fill-[#ff3b5c]" />
                </div>
              </div>
            )}
          </div>
          
          <div className={`flex items-center gap-3 sm:gap-4 ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
            <div className="flex items-center gap-1">
              <Icons.HeartOutline size={18} />
              <EditableText 
                text={reply.likes && reply.likes !== '0' ? reply.likes : ''}
                onBlur={handleUpdate('likes')}
                className={`text-[12px] font-medium px-1 hover:bg-slate-200/50 focus:bg-slate-200/50 ${isDark ? 'hover:bg-white/10 focus:bg-white/10' : ''}`}
              />
            </div>
            <Icons.CommentBubble size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;