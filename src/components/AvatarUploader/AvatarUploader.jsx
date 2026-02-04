import React, { useState } from 'react';
import { useFileUploader, useLanguage } from '@hooks';
import AvatarGeneratorModal from '../AvatarGeneratorModal/AvatarGeneratorModal';
import styles from './AvatarUploader.module.css';

// --- Icons ---
const Icons = {
  Upload: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  User: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
};

const AvatarUploader = ({ currentAvatar, onUpload, isPro, onOpenPro }) => {
  const { t } = useLanguage();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  // Hook for handling standard file uploads
  const { fileInputRef, handlePick, handleFileChange } = useFileUploader(onUpload);

  const handleAiClick = () => {
    if (!isPro) {
      onOpenPro?.();
    } else {
      setIsAiModalOpen(true);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onUpload(null);
  };

  const handleAiApply = (base64Image) => {
    onUpload(base64Image);
    setIsAiModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        {/* Preview Circle */}
        <div className={styles.previewWrapper} onClick={handlePick}>
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt="Avatar" 
              className={styles.avatarImage} 
            />
          ) : (
            <div className={styles.placeholder}>
              <Icons.User />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className={styles.overlay}>
            <Icons.Upload />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsColumn}>
          <div className={styles.primaryActions}>
            <button 
              type="button" 
              className={styles.uploadBtn} 
              onClick={handlePick}
              title={t.upload || "Upload Image"}
            >
              <Icons.Upload />
              <span>{t.upload || "Upload"}</span>
            </button>

            <button 
              type="button" 
              className={`${styles.aiBtn} ${!isPro ? styles.locked : ''}`}
              onClick={handleAiClick}
              title={!isPro ? (t.proRequired || "Pro Required") : (t.aiAvatar || "Generate AI Avatar")}
            >
              <Icons.Sparkles />
              <span className={styles.aiBtnText}>AI Avatar</span>
              {!isPro && <span className={styles.lockBadge}><Icons.Lock /></span>}
            </button>
          </div>

          {currentAvatar && (
            <button 
              type="button" 
              className={styles.removeBtn} 
              onClick={handleRemove}
            >
              <Icons.Trash />
              {t.remove || "Remove"}
            </button>
          )}
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      {/* AI Modal */}
      <AvatarGeneratorModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleAiApply}
      />
    </>
  );
};

export default AvatarUploader;