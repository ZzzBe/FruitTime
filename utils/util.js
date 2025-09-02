// utils/util.js

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 格式化价格
function formatPrice(price) {
  return '¥' + parseFloat(price).toFixed(2);
}

// 格式化评分
function formatRating(rating) {
  return parseFloat(rating).toFixed(1);
}

// 检查网络状态
function checkNetwork() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res.networkType);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 显示加载提示
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

// 隐藏加载提示
function hideLoading() {
  wx.hideLoading();
}

// 显示提示信息
function showToast(title, icon = 'none') {
  wx.showToast({
    title: title,
    icon: icon
  });
}

// 格式化时间
function formatTime(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 深拷贝对象
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// 验证手机号
function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

// 验证邮箱
function validateEmail(email) {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg.test(email);
}

// 获取URL参数
function getUrlParams(url) {
  const params = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
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

// 检查是否为空对象
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// 数组去重
function uniqueArray(arr) {
  return [...new Set(arr)];
}

// 节点查询
function querySelector(selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect(res => {
      if (res) {
        resolve(res);
      } else {
        reject(new Error('未找到节点'));
      }
    });
    query.exec();
  });
}

module.exports = {
  debounce,
  throttle,
  formatPrice,
  formatRating,
  checkNetwork,
  showLoading,
  hideLoading,
  showToast,
  formatTime,
  deepClone,
  validatePhone,
  validateEmail,
  getUrlParams,
  generateId,
  isEmptyObject,
  uniqueArray,
  querySelector
};