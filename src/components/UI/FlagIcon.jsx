export const FlagIcon = ({ code }) => (
  <img 
    src={`https://flagcdn.com/24x18/${code}.png`} 
    width="20" 
    height="15" 
    alt={code} 
    style={{ borderRadius: '2px', objectFit: 'cover' }} 
  />
);