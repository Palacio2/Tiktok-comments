import { useState, useEffect, RefObject } from 'react';

export const useDraggable = (handleRef: RefObject<HTMLElement>) => {
  const [position, setPosition] = useState({ x: 40, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (handleRef.current && handleRef.current.contains(e.target as Node)) {
        setIsDragging(true);
        setOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, position, handleRef]);

  return { position, isDragging };
};