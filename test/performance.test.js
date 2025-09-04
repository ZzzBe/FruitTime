// test/performance.test.js

// 模拟性能测试
console.log('开始性能测试...');

// 测试缓存机制
const { 
  getFruitDetail,
  getFruitComparison,
  getRecommendations,
  searchFruits,
  getIdentifyHistory,
  identifyImage,
  getUserHealthData,
  updateUserHealthData,
  getUserFavorites,
  addFavorite,
  removeFavorite
} = require('../utils/network/api.js');

console.log('测试API缓存机制...');

// 第一次请求
console.time('第一次请求');
api.getFruitDetail(1)
  .then(res => {
    console.timeEnd('第一次请求');
    console.log('第一次请求结果:', res.code);
    
    // 第二次请求（应该使用缓存）
    console.time('第二次请求（缓存）');
    return api.getFruitDetail(1);
  })
  .then(res => {
    console.timeEnd('第二次请求（缓存）');
    console.log('第二次请求结果:', res.code);
  })
  .catch(err => {
    console.error('请求失败:', err);
  });

// 测试网络检查
const { 
  showToast, 
  showModal,
  showLoading,
  hideLoading,
  formatPrice,
  formatRating,
  formatRelativeTime,
  formatTime,
  formatFileSize,
  debounce,
  throttle,
  deepClone,
  isEmptyObject,
  uniqueArray,
  querySelector,
  querySelectorAll,
  checkNetwork,
  getSystemInfo,
  getDeviceInfo,
  isIPhoneX,
  getRandomColor,
  generateGradientColors,
  validatePhone,
  validateEmail,
  getUrlParams,
  generateId
} = require('../utils/index.js');

console.log('测试网络检查...');
util.checkNetwork()
  .then(networkType => {
    console.log('当前网络类型:', networkType);
  })
  .catch(err => {
    console.error('网络检查失败:', err);
  });

console.log('性能测试完成');