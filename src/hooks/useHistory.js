import { useState, useEffect, useCallback } from 'react';
import { loadComments, saveComment, clearComments as clearStorage } from '@utils';

export const useHistory = () => {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState(null);

  useEffect(() => {
    let isMounted = true;
    loadComments().then(data => {
      if (isMounted) setComments(data);
    });
    return () => { isMounted = false; };
  }, []);

  const handleGenerateComment = useCallback(async (commentData) => {
    let finalDate = commentData.date ? new Date(commentData.date).toISOString() : new Date().toISOString();
    const newComment = { ...commentData, id: crypto.randomUUID(), date: finalDate };
    
    const updatedComments = await saveComment(newComment);
    setCurrentComment(newComment);
    setComments(updatedComments);
  }, []);

  const clearHistory = useCallback(async (t, language) => {
    if (comments.length === 0) return;
    const confirmMsg = language === 'uk' ? 'Видалити історію?' : 'Clear history?';
    if (window.confirm(confirmMsg)) {
      await clearStorage();
      setComments([]);
      setCurrentComment(null);
    }
  }, [comments.length]);

  return { comments, currentComment, handleGenerateComment, clearHistory };
};