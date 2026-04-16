export const formatLikeCount = (count: number | string): string | null => {
  const numeric = typeof count === 'string' ? Number(count.replace(/[^0-9.]/g, '')) : count;
  if (!numeric || numeric === 0) return null;
  if (numeric < 1000) return numeric.toString();
  if (numeric < 10000) return `${Math.floor(numeric / 1000)}k`;
  return `${(numeric / 1000).toFixed(numeric % 1000 === 0 ? 0 : 1)}`.replace('.0', '') + 'k';
};