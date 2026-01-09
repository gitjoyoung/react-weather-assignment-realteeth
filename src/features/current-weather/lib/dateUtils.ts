export const formatTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric', 
    weekday: 'short' 
  });
};

export const getCurrentDateTime = () => {
  const now = new Date();
  return {
    timeText: formatTime(now),
    dateText: formatDate(now),
    date: now,
  };
};
