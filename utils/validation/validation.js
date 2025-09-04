// utils/validation/validation.js
// 数据验证相关工具函数

// 验证手机号
function validatePhone(phone) {
  if (!phone) return false;
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

// 验证邮箱
function validateEmail(email) {
  if (!email) return false;
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg.test(email);
}

// 获取URL参数
function getUrlParams(url) {
  const params = {};
  const queryString = url ? url.split('?')[1] : window.location.search.substring(1);
  
  if (queryString) {
    const pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1] || '');
      params[key] = value;
    }
  }
  return params;
}

// 生成随机ID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  validatePhone,
  validateEmail,
  getUrlParams,
  generateId
};