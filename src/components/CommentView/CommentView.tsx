import React from 'react';
import { CommentData, ReplyData } from '@/types';
import { Icons, Avatar, EditableText } from '@/components/ui';
import { useLanguage } from '@/hooks';
import ReplyItem from './ReplyItem';

interface CommentViewProps {
  data: CommentData;
  isDark?: boolean;
  onLiveUpdate?: (field: keyof CommentData, value: string | ReplyData[]) => void;
  activeEditId?: string;
  onSelectEdit?: (id: string) => void;
  onAddReply?: (replyToUsername?: string) => void;
  onAvatarClick?: () => void;
}

const CommentView = ({ data, isDark = false, onLiveUpdate, activeEditId, onSelectEdit, onAddReply, onAvatarClick }: CommentViewProps) => {
  const { t } = useLanguage();

  const handleUpdate = (field: keyof CommentData) => (value: string) => {
    if (onLiveUpdate) onLiveUpdate(field, value);
  };

  const handleReplyUpdate = (replyId: string, field: keyof ReplyData, value: string) => {
    if (onLiveUpdate && data.replies) {
      const updated = data.replies.map(r => r.id === replyId ? { ...r, [field]: value } : r);
      onLiveUpdate('replies', updated);
    }
  };

  return (
    <div 
      onClick={() => onSelectEdit?.('main')}
      className={`font-tiktok w-full p-6 sm:p-8 rounded-[28px] shadow-sm overflow-hidden border-2 cursor-default transition-all ${isDark ? 'bg-[#121212] text-white' : 'bg-white text-black'} border-transparent`}
    >
      <div className="flex gap-4">
        <Avatar 
          url={data.avatarUrl} 
          size="md" 
          isDark={isDark} 
          hasGradient 
          onClick={(e: any) => { e.stopPropagation(); onSelectEdit?.('main'); onAvatarClick?.(); }} 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap leading-tight mb-1.5">
            <EditableText 
              text={data.username}
              onBlur={handleUpdate('username')}
              className={`text-[16px] sm:text-[18px] font-semibold truncate max-w-[250px] px-1 -ml-1 ${isDark ? 'text-white/70 hover:bg-white/10 focus:bg-white/10' : 'text-[#6b6f76] hover:bg-slate-100/80 focus:bg-slate-100/80'}`}
            />
            {data.isVerified && <Icons.Verified size={16} className="text-[#20D5EC] shrink-0 ml-1.5" />}
            {data.isAuthor && <span className={`text-[15px] sm:text-[16px] font-semibold ml-1.5 ${isDark ? 'text-[#20D5EC]' : 'text-[#00a896]'}`}>{t('authorBadgeLabel')}</span>}
          </div>

          <EditableText 
            as="p"
            text={data.commentText}
            onBlur={handleUpdate('commentText')}
            className={`text-[17px] sm:text-[19px] leading-[1.35] whitespace-pre-wrap break-words px-1 -ml-1 ${isDark ? 'text-white/95 hover:bg-white/10 focus:bg-white/10' : 'text-[#161722] hover:bg-slate-100/80 focus:bg-slate-100/80'}`}
          />

          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <div className="flex items-center gap-4">
              <EditableText 
                text={data.timeAgo}
                onBlur={handleUpdate('timeAgo')}
                className={`text-[14px] sm:text-[15px] font-medium px-1 -ml-1 ${isDark ? 'text-white/50 hover:bg-white/10 focus:bg-white/10' : 'text-[#8a8b91] hover:bg-slate-100/80 focus:bg-slate-100/80'}`}
              />
              <span 
                onClick={(e) => { e.stopPropagation(); onAddReply?.(); }}
                className={`text-[14px] sm:text-[15px] font-bold cursor-pointer hover:underline ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}
              >
                {t('replyAction')}
              </span>

              {data.isLikedByCreator && (
                <div className="relative flex items-center justify-center ml-1">
                  <div className={`w-[20px] h-[20px] rounded-full overflow-hidden border-[0.5px] ${isDark ? 'border-white/10 bg-slate-800' : 'border-black/10 bg-slate-100'}`}>
                    <Icons.User size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 rounded-full p-[2px] ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
                    <Icons.Heart size={10} className="text-[#ff3b5c] fill-[#ff3b5c]" />
                  </div>
                </div>
              )}
            </div>
            <div className={`flex items-center gap-5 ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
              <div className="flex items-center gap-1.5">
                <Icons.HeartOutline size={22} />
                <EditableText 
                  text={data.likes !== '0' ? data.likes : ''}
                  onBlur={handleUpdate('likes')}
                  className={`text-[14px] font-medium px-1 ${isDark ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-slate-100/80 focus:bg-slate-100/80'}`}
                />
              </div>
              <Icons.CommentBubble size={22} />
            </div>
          </div>

          {data.replies && data.replies.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-[30px] border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}></div>
                <div className={`text-[14px] sm:text-[15px] font-semibold flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
                  {t('viewReplies', { count: data.replies.length })} <Icons.ChevronDown size={18} />
                </div>
              </div>
              {data.replies.map((reply) => (
                <ReplyItem 
                  key={reply.id} 
                  reply={reply} 
                  isDark={isDark} 
                  isActive={activeEditId === reply.id}
                  onSelect={() => onSelectEdit?.(reply.id)}
                  onLiveUpdate={(field, val) => handleReplyUpdate(reply.id, field, val)}
                  onAddReply={(name) => onAddReply?.(name)}
                  onAvatarClick={onAvatarClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentView;