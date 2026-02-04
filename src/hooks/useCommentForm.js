import { useState } from 'react';
// ✅ Використовуємо аліас
import { validateCommentData } from '@utils';

export const useCommentForm = (onGenerate, isPro, onOpenPro) => {
  const [formData, setFormData] = useState({
    username: 'tiktok_user', 
    verified: false,
    isCreator: false,
    avatar: null,
    commentText: 'TikTok Comment Generator', 
    likes: 1200,
    date: new Date().toISOString().split('T')[0],
    showReply: false,
    reply: {
      username: 'reply_user',
      verified: false,
      isCreator: false,
      avatar: null,
      commentText: 'TikTok Comment Generator', 
      likes: 50,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('main');

  const handleInputChange = (e, section = 'main') => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (section === 'main') return { ...prev, [name]: value };
      return { ...prev, reply: { ...prev.reply, [name]: value } };
    });
  };

  const toggleVerified = (section = 'main') => {
    if (!isPro) {
      onOpenPro();
      return;
    }
    setFormData(prev => {
      if (section === 'main') return { ...prev, verified: !prev.verified };
      return { ...prev, reply: { ...prev.reply, verified: !prev.reply.verified } };
    });
  };

  const toggleCreator = (section = 'main') => {
    setFormData(prev => {
      if (section === 'main') return { ...prev, isCreator: !prev.isCreator };
      return { ...prev, reply: { ...prev.reply, isCreator: !prev.reply.isCreator } };
    });
  };

  const toggleReplySection = () => {
    setFormData(prev => ({ ...prev, showReply: !prev.showReply }));
  };

  const setAvatar = (img, section = 'main') => {
    setFormData(prev => {
      if (section === 'main') return { ...prev, avatar: img };
      return { ...prev, reply: { ...prev.reply, avatar: img } };
    });
  };

  const handleAiApply = (text) => {
    setFormData(prev => {
      if (activeSection === 'main') return { ...prev, commentText: text };
      return { ...prev, reply: { ...prev.reply, commentText: text } };
    });
    setIsAiModalOpen(false);
  };

  const handleAiTextClick = (section) => {
    setActiveSection(section);
    setIsAiModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateCommentData(formData);
    if (!isValid) {
      alert(Object.values(errors)[0]);
      return;
    }
    onGenerate(formData);
  };

  const handleResetForm = () => {
    setFormData({
      username: 'tiktok_user', 
      verified: false, 
      isCreator: false, 
      avatar: null, 
      commentText: 'TikTok Comment Generator', 
      likes: 0, 
      date: new Date().toISOString().split('T')[0], 
      showReply: false,
      reply: { 
        username: 'reply_user', 
        verified: false, 
        isCreator: false, 
        avatar: null, 
        commentText: 'TikTok Comment Generator', 
        likes: 0, 
        date: new Date().toISOString().split('T')[0] 
      }
    });
  };

  return { 
    formData, isAiModalOpen, setIsAiModalOpen, 
    handleInputChange, toggleVerified, toggleCreator, toggleReplySection,
    setAvatar, handleAiApply, handleAiTextClick, 
    handleSubmit, handleResetForm 
  };
};