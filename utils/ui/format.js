// utils/ui/format.js
// 格式化相关工具函数

// 格式化价格
function formatPrice(price) {
  if (price == null) return '¥0.00';
  return '¥' + parseFloat(price).toFixed(2);
}

// 格式化评分
function formatRating(rating) {
  if (rating == null) return '0.0';
  return parseFloat(rating).toFixed(1);
}

// 格式化时间
function formatTime(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 格式化相对时间
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}小时前`;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days}天前`;
  
  // 超过30天显示具体日期
  return formatTime(timestamp);
}

// 格式化文件大小
function formatFileSize(size) {
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
}

module.exports = {
  formatPrice,
  formatRating,
  formatTime,
  formatRelativeTime,
  formatFileSize
};