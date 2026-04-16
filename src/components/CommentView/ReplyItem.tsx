import { ReplyData } from '@/types';
import { Icons } from '@/components/ui';
import { TranslationSchema } from '@/utils/translations';

interface ReplyItemProps {
  reply: ReplyData;
  isDark: boolean;
  t: TranslationSchema;
}

const ReplyItem = ({ reply, isDark, t }: ReplyItemProps) => {
  return (
    <div className="font-tiktok flex gap-3.5 animate-in fade-in slide-in-from-top-2 mt-1">
      <div className="shrink-0 pt-0.5">
        <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border-[0.5px] ${isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-100 border-black/5'}`}>
          {reply.avatarUrl ? (
            <img src={reply.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Icons.User size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap leading-tight mb-1.5">
          <span className={`text-[15px] font-semibold truncate max-w-[150px] ${isDark ? 'text-white/70' : 'text-[#6b6f76]'}`}>
            {reply.username}
          </span>
          
          {reply.isVerified && (
            <Icons.Verified size={15} className="text-[#20D5EC] shrink-0 ml-1.5" />
          )}
          
          {reply.isAuthor && (
            <span className={`text-[14px] font-semibold ml-1.5 ${isDark ? 'text-[#20D5EC]' : 'text-[#00a896]'}`}>
              {t.authorBadgeLabel || '· Автор'}
            </span>
          )}
        </div>
        <p className={`text-[16px] leading-[1.35] whitespace-pre-wrap break-words ${isDark ? 'text-white/95' : 'text-[#161722]'}`}>
          {reply.text}
        </p>
        
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-4">
            <span className={`text-[13.5px] font-medium ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
              {reply.timeAgo}
            </span>
            <span className={`text-[13.5px] font-bold cursor-pointer ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
              {t.replyAction || 'Відповісти'}
            </span>
            
            {reply.isLikedByCreator && (
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
          
          <div className={`flex items-center gap-4 ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
            <div className="flex items-center gap-1.5">
              <Icons.HeartOutline size={20} />
              {reply.likes && reply.likes !== '0' && <span className="text-[13px] font-medium">{reply.likes}</span>}
            </div>
            <Icons.CommentBubble size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;