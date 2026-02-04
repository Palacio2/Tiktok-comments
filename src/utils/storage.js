import { get, set } from 'idb-keyval';

const STORAGE_KEY = 'tiktok_comments_data_v3';
const MAX_COMMENTS = 50;

export const loadComments = async () => {
  try {
    const data = await get(STORAGE_KEY);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const saveComment = async (comment) => {
  try {
    const comments = (await loadComments()) || [];
    
    const isDuplicate = comments.some(
      c => c.username === comment.username && 
           c.commentText === comment.commentText &&
           c.date === comment.date
    );
    
    if (isDuplicate) return comments;
    
    const newComments = [comment, ...comments].slice(0, MAX_COMMENTS);
    await set(STORAGE_KEY, newComments);
    return newComments;
  } catch (error) {
    return [];
  }
};

export const clearComments = async () => {
  await set(STORAGE_KEY, []);
};

export const deleteComment = async (commentId) => {
  try {
    const comments = (await loadComments()) || [];
    const filteredComments = comments.filter(comment => comment.id !== commentId);
    await set(STORAGE_KEY, filteredComments);
    return filteredComments;
  } catch (error) {
    return [];
  }
};