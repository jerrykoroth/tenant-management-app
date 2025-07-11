export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-IN', defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX for Indian numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

export const formatRoomNumber = (roomNumber, prefix = 'Room ') => {
  if (!roomNumber) return '';
  return `${prefix}${roomNumber}`;
};

export const formatBedNumber = (bedNumber, prefix = 'Bed ') => {
  if (!bedNumber) return '';
  return `${prefix}${bedNumber}`;
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj);
  }
};

export const getPaymentStatus = (payment) => {
  if (!payment) return 'unknown';
  
  if (payment.status === 'completed') {
    return 'paid';
  } else if (payment.status === 'pending') {
    const dueDate = payment.dueDate?.toDate() || new Date();
    const now = new Date();
    
    if (dueDate < now) {
      return 'overdue';
    } else {
      return 'pending';
    }
  }
  
  return payment.status || 'unknown';
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#4CAF50',
    'checked-in': '#2196F3',
    'checked-out': '#FF9800',
    pending: '#FFC107',
    overdue: '#F44336',
    paid: '#4CAF50',
    completed: '#4CAF50',
    cancelled: '#9E9E9E',
    unknown: '#9E9E9E'
  };
  
  return colors[status] || colors.unknown;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};