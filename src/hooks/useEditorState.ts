import { useState, useCallback } from 'react';
import { CommentData } from '@/types';
import { toast } from 'sonner';
import { useLanguage } from './useLanguage';
import { INITIAL_COMMENT_STATE, RANDOM_DATA, APP_CONFIG } from '@/constants';

export const useEditorState = () => {
  const { t } = useLanguage();
  const [commentData, setCommentData] = useState<CommentData>(INITIAL_COMMENT_STATE);
  const [activeEditId, setActiveEditId] = useState<string>('main');

  const handleLiveUpdate = useCallback(<K extends keyof CommentData>(field: K, value: CommentData[K]) => {
    setCommentData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleActiveDataUpdate = useCallback((field: string, value: unknown) => {
    if (activeEditId === 'main') {
      setCommentData(prev => ({ ...prev, [field]: value as never }));
    } else {
      setCommentData(prev => ({
        ...prev,
        replies: prev.replies.map(r => r.id === activeEditId ? { ...r, [field]: value as never } : r)
      }));
    }
  }, [activeEditId]);

  const handleAddReply = useCallback((replyToUsername?: string) => {
    if (commentData.replies.length >= APP_CONFIG.MAX_REPLIES) {
      toast.error(t('limitReached'));
      return;
    }
    const newId = Date.now().toString();
    setCommentData(prev => ({
      ...prev,
      replies: [...prev.replies, {
        id: newId, 
        username: 'username', 
        replyingTo: replyToUsername,
        text: t('newReplyDefault'), 
        timeAgo: '1m', 
        likes: '0', 
        avatarUrl: null, 
        isLikedByCreator: false, 
        isAuthor: false, 
        isVerified: false
      }]
    }));
    setActiveEditId(newId);
  }, [commentData.replies.length, t]);

  const handleRandomize = useCallback(() => {
    const r = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    
    const randomBase = {
      username: r(RANDOM_DATA.NAMES),
      timeAgo: r(RANDOM_DATA.TIMES),
      likes: r(RANDOM_DATA.LIKES),
      avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${r(RANDOM_DATA.AVATARS)}`,
      isVerified: Math.random() > 0.7,
      isAuthor: Math.random() > 0.9,
    };

    if (activeEditId === 'main') {
      setCommentData(prev => ({ ...prev, ...randomBase, commentText: r(RANDOM_DATA.COMMENTS) }));
    } else {
      setCommentData(prev => ({
        ...prev,
        replies: prev.replies.map(rep => 
          rep.id === activeEditId ? { ...rep, ...randomBase, text: r(RANDOM_DATA.COMMENTS) } : rep
        )
      }));
    }
    toast.success(t('randomCommentApplied'));
  }, [activeEditId, t]);

  const handleClearAction = useCallback(() => {
    if (activeEditId === 'main') {
      setCommentData(INITIAL_COMMENT_STATE);
    } else {
      setCommentData(prev => ({
        ...prev,
        replies: prev.replies.filter(r => r.id !== activeEditId)
      }));
      setActiveEditId('main');
    }
    toast.success(t('clearSuccess'));
  }, [activeEditId, t]);

  const activeData = activeEditId === 'main' 
    ? commentData 
    : commentData.replies.find(r => r.id === activeEditId) || commentData;

  return {
    commentData,
    activeEditId,
    setActiveEditId,
    handleLiveUpdate,
    handleActiveDataUpdate,
    handleAddReply,
    handleRandomize,
    handleClearAction,
    activeData
  };
};