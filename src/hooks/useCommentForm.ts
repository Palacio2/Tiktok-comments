import { useState, useCallback, useEffect } from 'react';
import { CommentData, ReplyData } from '@/types';

export const useCommentForm = (
  onGenerate: (data: CommentData) => void,
  externalAvatar?: string | null
) => {
  const [formData, setFormData] = useState<CommentData>({
    username: 'tiktok_star',
    isVerified: false,
    isAuthor: false,
    avatarUrl: null,
    commentText: 'This is an awesome video! 🔥',
    likes: '12K',
    timeAgo: '2h',
    isLikedByCreator: false,
    replies: []
  });

  // Передаємо стартові дані при першому завантаженні
  useEffect(() => {
    onGenerate(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (externalAvatar !== undefined) {
      setFormData(prev => {
        const next = { ...prev, avatarUrl: externalAvatar };
        onGenerate(next);
        return next;
      });
    }
  }, [externalAvatar, onGenerate]);

  const handleInputChange = useCallback(<K extends keyof CommentData>(field: K, value: CommentData[K]) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      onGenerate(next);
      return next;
    });
  }, [onGenerate]);

  const handleAvatarChange = useCallback((newAvatarUrl: string | null) => {
    setFormData(prev => {
      const next = { ...prev, avatarUrl: newAvatarUrl };
      onGenerate(next);
      return next;
    });
  }, [onGenerate]);

  const handleRepliesChange = useCallback((newReplies: ReplyData[]) => {
    setFormData(prev => {
      const next = { ...prev, replies: newReplies };
      onGenerate(next);
      return next;
    });
  }, [onGenerate]);

  return {
    formData,
    handleInputChange,
    handleAvatarChange,
    handleRepliesChange
  };
};