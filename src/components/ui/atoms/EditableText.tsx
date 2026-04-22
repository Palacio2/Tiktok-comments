import React from 'react';

interface EditableTextProps {
  text: string;
  onBlur: (value: string) => void;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  text, 
  onBlur, 
  className = '', 
  as = 'span' 
}) => {
  const Tag = as;
  
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => onBlur(e.currentTarget.textContent || '')}
      className={`outline-none cursor-text rounded transition-all duration-300 ease-out ${className}`}
    >
      {text}
    </Tag>
  );
};