export const formatLastDone = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const date = new Date(timestamp);
  const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前 ${timeStr}`;
  if (days === 1) return `昨天 ${timeStr}`;
  if (days < 30) return `${days}天前 ${timeStr}`;
  
  return date.toLocaleDateString('zh-CN') + ' ' + timeStr;
};
