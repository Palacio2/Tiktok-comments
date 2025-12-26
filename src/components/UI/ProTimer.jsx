import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

export const ProTimer = ({ date, t }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!date) return;

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(date);
      const diff = end - now;

      if (diff <= 0) {
        return t.proExpired || 'Expired';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days} ${t.days || 'd'}`);
      if (hours > 0 || days > 0) parts.push(`${hours} ${t.hours || 'h'}`);
      parts.push(`${minutes} ${t.minutes || 'm'}`);

      return parts.slice(0, 2).join(' ');
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const result = calculateTime();
      setTimeLeft(result);
      if (result === (t.proExpired || 'Expired')) clearInterval(interval);
    }, 60000); // Оновлюємо раз на хвилину, щоб не навантажувати

    return () => clearInterval(interval);
  }, [date, t]);

  if (!date) return <span>PRO</span>;

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontVariantNumeric: 'tabular-nums' }}>
      {timeLeft} <FaClock size={12} style={{ opacity: 0.7 }} />
    </span>
  );
};