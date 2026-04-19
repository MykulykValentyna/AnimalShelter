const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat('uk-UA', defaultOptions).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'щойно';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} хв. тому`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} год. тому`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'вчора';
  if (diffInDays < 7) return `${diffInDays} дн. тому`;

  return formatDate(dateString, { month: 'short', day: 'numeric' });
};

export const formatTime = (dateString) => {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
    year: undefined,
    month: undefined,
    day: undefined
  });
};

export default formatDate;