import { useState, useCallback } from 'react';
import { validateCommentData } from '../utils/helpers';

export const useCommentForm = (onGenerate, isPro, onOpenPro) => {
  const [formData, setFormData] = useState({
    // Основний коментар
    username: 'user123',
    commentText: 'TikTok Comment Generator! 🔥',
    likes: 120,
    avatar: null,
    verified: false,
    date: '',
    replyLabelText: '', // Текст кнопки "Reply" (маленький сірий)

    // 🆕 Вкладена відповідь
    showReply: false, 
    reply: {
      username: 'author_reply',
      commentText: 'Thanks for generated comment! 🤝',
      likes: 5,
      avatar: null, // Тут буде аватар відповіді
      verified: true,
      date: ''
    }
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeAiField, setActiveAiField] = useState('main'); // 'main' або 'reply'

  // Обробник для основного коментаря
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'verified' && !isPro) return;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'likes' ? parseInt(value) || 0 : value)
    }));
  }, [isPro]);

  // 🆕 Обробник для вкладеної відповіді
  const handleReplyChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'verified' && !isPro) return;

    setFormData(prev => ({
      ...prev,
      reply: {
        ...prev.reply,
        [name]: type === 'checkbox' ? checked : (name === 'likes' ? parseInt(value) || 0 : value)
      }
    }));
  }, [isPro]);

  // Перемикання відображення відповіді
  const toggleReplySection = useCallback(() => {
    setFormData(prev => ({ ...prev, showReply: !prev.showReply }));
  }, []);

  const setAvatar = useCallback((img) => {
    setFormData(prev => ({ ...prev, avatar: img }));
  }, []);

  // 🆕 Сеттер для аватара відповіді
  const setReplyAvatar = useCallback((img) => {
    setFormData(prev => ({ ...prev, reply: { ...prev.reply, avatar: img } }));
  }, []);

  const handleAiApply = useCallback((text) => {
    setFormData(prev => {
      if (activeAiField === 'reply') {
        return { ...prev, reply: { ...prev.reply, commentText: text } };
      }
      return { ...prev, commentText: text };
    });
  }, [activeAiField]);

  const handleAiTextClick = useCallback((field = 'main') => {
    if (isPro) {
      setActiveAiField(field);
      setIsAiModalOpen(true);
    } else {
      onOpenPro();
    }
  }, [isPro, onOpenPro]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validation = validateCommentData(formData);
    if (!validation.isValid) {
      alert(Object.values(validation.errors).join('\n'));
      return;
    }
    onGenerate(formData);
  }, [formData, onGenerate]);

  const handleResetForm = useCallback(() => {
    setFormData({
      username: 'user123',
      commentText: '',
      likes: 0,
      avatar: null,
      verified: false,
      date: '',
      replyLabelText: '',
      showReply: false,
      reply: {
        username: 'reply_user',
        commentText: '',
        likes: 0,
        avatar: null,
        verified: false,
        date: ''
      }
    });
  }, []);

  return {
    formData,
    isAiModalOpen,
    setIsAiModalOpen,
    handleInputChange,
    handleReplyChange, // 🆕
    toggleReplySection, // 🆕
    setAvatar,
    setReplyAvatar, // 🆕
    handleAiApply,
    handleAiTextClick,
    handleSubmit,
    handleResetForm
  };
};