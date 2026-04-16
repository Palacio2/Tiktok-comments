import { CommentData } from '@/types';
import { Icons } from '@/components/ui';
import { formatLikeCount } from '@/utils/helpers';
import ReplyItem from './ReplyItem';
import { TranslationSchema } from '@/utils/translations';

interface CommentViewProps {
  data: CommentData;
  isDark?: boolean;
  t: TranslationSchema;
}

const CommentView = ({ data, isDark = false, t }: CommentViewProps) => {
  const displayLikes = formatLikeCount(data.likes) || '0';

  return (
    <div className={`font-tiktok w-full p-6 sm:p-8 rounded-3xl shadow-sm overflow-hidden ${isDark ? 'bg-[#121212] text-white' : 'bg-white text-black'}`}>
      <div className="flex gap-4">
        
        <div className="shrink-0 pt-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#00f2ea] to-[#00ff85]">
            <div className={`w-full h-full rounded-full border-[1.5px] overflow-hidden flex items-center justify-center ${isDark ? 'border-[#121212] bg-slate-800' : 'border-white bg-slate-100'}`}>
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt={data.username} className="w-full h-full object-cover" />
              ) : (
                <Icons.User size={26} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap leading-tight mb-1.5">
            <span className={`text-[16px] sm:text-[18px] font-semibold truncate max-w-[250px] ${isDark ? 'text-white/70' : 'text-[#6b6f76]'}`}>
              {data.username}
            </span>
            
            {data.isVerified && (
              <Icons.Verified size={16} className="text-[#20D5EC] shrink-0 ml-1.5" />
            )}
            
            {data.isAuthor && (
              <span className={`text-[15px] sm:text-[16px] font-semibold ml-1.5 ${isDark ? 'text-[#20D5EC]' : 'text-[#00a896]'}`}>
                {t.authorBadgeLabel || '· Автор'}
              </span>
            )}
          </div>

          <p className={`text-[17px] sm:text-[19px] leading-[1.35] whitespace-pre-wrap break-words ${isDark ? 'text-white/95' : 'text-[#161722]'}`}>
            {data.commentText}
          </p>

          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <div className="flex items-center gap-4">
              <span className={`text-[14px] sm:text-[15px] font-medium ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
                {data.timeAgo}
              </span>
              <span className={`text-[14px] sm:text-[15px] font-bold cursor-pointer ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
                {t.replyAction || 'Відповісти'}
              </span>
              
              {data.isLikedByCreator && (
                <div className="relative flex items-center justify-center ml-1">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border-[0.5px] ${isDark ? 'border-white/10 bg-slate-800' : 'border-black/10 bg-slate-100'}`}>
                    {data.avatarUrl ? (
                      <img src={data.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icons.User size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    )}
                  </div>
                  <div className={`absolute -bottom-1.5 -right-1.5 rounded-full p-[2px] ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
                    <Icons.Heart size={12} className="text-[#ff3b5c] fill-[#ff3b5c]" />
                  </div>
                </div>
              )}
            </div>
            
            <div className={`flex items-center gap-5 ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
              <div className="flex items-center gap-1.5">
                <Icons.HeartOutline size={22} />
                {displayLikes !== '0' && <span className="text-[14px] font-medium">{displayLikes}</span>}
              </div>
              <Icons.CommentBubble size={22} />
            </div>
          </div>

          {data.replies && data.replies.length > 0 && (
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className={`w-[30px] border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}></div>
                <div className={`text-[14px] sm:text-[15px] font-semibold flex items-center gap-1 cursor-pointer ${isDark ? 'text-white/50' : 'text-[#8a8b91]'}`}>
                  {(t.viewReplies || 'Подивитись {count} відповіді').replace('{count}', data.replies.length.toString())} <Icons.ChevronDown size={18} />
                </div>
              </div>
              {data.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} isDark={isDark} t={t} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CommentView;