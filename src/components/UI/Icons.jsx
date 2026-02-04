import React from 'react';

const SvgIcon = ({ size = 20, children, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {children}
  </svg>
);

export const Icons = {
  Lock: (props) => (
    <SvgIcon size={12} strokeWidth={2.5} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </SvgIcon>
  ),
  Sparkles: (props) => (
    <SvgIcon size={14} {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </SvgIcon>
  ),
  Clock: (props) => (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </SvgIcon>
  ),
  Copy: (props) => (
    <SvgIcon {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </SvgIcon>
  ),
  Download: (props) => (
    <SvgIcon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </SvgIcon>
  ),
  Mic: (props) => (
    <SvgIcon {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </SvgIcon>
  ),
  ChevronDown: (props) => (
    <SvgIcon {...props}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </SvgIcon>
  ),
  Question: (props) => (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </SvgIcon>
  ),
  Bell: (props) => (
    <SvgIcon {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </SvgIcon>
  ),
  Eye: (props) => (
    <SvgIcon {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </SvgIcon>
  ),
  Trash: (props) => (
    <SvgIcon {...props}>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </SvgIcon>
  ),
  Reply: (props) => (
    <SvgIcon {...props}>
      <polyline points="9 17 4 12 9 7"/>
      <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
    </SvgIcon>
  ),
  Cog: (props) => (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </SvgIcon>
  ),
  Sun: (props) => (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
    </SvgIcon>
  ),
  Moon: (props) => (
    <SvgIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </SvgIcon>
  ),
  Verified: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" color="#20D5EC">
      <path d="M10.602 3.008c-1.114.425-1.956 1.306-2.38 2.379a.992.992 0 0 1-1.353.49L5.3 5.302a2.98 2.98 0 0 0-3.92 3.92l.575 1.568a.993.993 0 0 1-.49 1.353C.392 12.567-.49 13.41.085 14.524a2.98 2.98 0 0 0 3.92 3.92l1.568-.575a.993.993 0 0 1 1.353.49l.575 1.568a2.98 2.98 0 0 0 3.92 3.92l1.568.575a.992.992 0 0 1 1.353.49l.575 1.568a2.98 2.98 0 0 0 3.92 3.92l1.568-.575c1.114-.425 1.956-1.306 2.38-2.379a.993.993 0 0 1 1.353-.49l1.568.575a2.98 2.98 0 0 0 3.92-3.92l-.575-1.568a.993.993 0 0 1 .49-1.353c1.07-1.424 1.953-2.267 1.378-3.38a2.98 2.98 0 0 0-3.92-3.92l-1.568.575a.992.992 0 0 1-1.353-.49l-.575-1.568a2.98 2.98 0 0 0-3.92-3.92l-1.568.575a.992.992 0 0 1-1.353-.49l-.575-1.568Z"/>
      <path fill="white" d="m10.5 15.5-3.5-3.5 1.5-1.5 2 2 5-5 1.5 1.5z"/>
    </svg>
  ),
  HeartEmpty: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  HeartFill: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FE2C55" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  )
};