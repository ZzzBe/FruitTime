// utils/util.js

// 防抖函数
function debounce(func, wait, immediate = false) {
  let timeout;
  return function (...args) {
    const context = this;
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    
    if (callNow) func.apply(context, args);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  return function (...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

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
function showToast(title, icon = 'none', duration = 1500) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  });
}

// 显示模态对话框
function showModal(options) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: options.title || '',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      cancelText: options.cancelText || '取消',
      cancelColor: options.cancelColor || '#000000',
      confirmText: options.confirmText || '确定',
      confirmColor: options.confirmColor || '#10b981',
      success: (res) => {
        if (res.confirm) {
          resolve({ confirm: true });
        } else if (res.cancel) {
          resolve({ cancel: true });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
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
  
  if (obj instanceof Object) {
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

// 检查是否为空对象
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// 数组去重
function uniqueArray(arr) {
  return [...new Set(arr)];
}

// 节点查询
function querySelector(selector, scope) {
  return new Promise((resolve, reject) => {
    const query = scope ? wx.createSelectorQuery().in(scope) : wx.createSelectorQuery();
    query
      .select(selector)
      .boundingClientRect(res => {
        if (res) {
          resolve(res);
        } else {
          reject(new Error('未找到节点'));
        }
      })
      .exec();
  });
}

// 批量节点查询
function querySelectorAll(selector, scope) {
  return new Promise((resolve, reject) => {
    const query = scope ? wx.createSelectorQuery().in(scope) : wx.createSelectorQuery();
    query
      .selectAll(selector)
      .boundingClientRect(res => {
        if (res) {
          resolve(res);
        } else {
          reject(new Error('未找到节点'));
        }
      })
      .exec();
  });
}

// 获取系统信息
function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 获取用户设备信息
function getDeviceInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        resolve({
          brand: res.brand, // 设备品牌
          model: res.model, // 设备型号
          pixelRatio: res.pixelRatio, // 设备像素比
          screenWidth: res.screenWidth, // 屏幕宽度
          screenHeight: res.screenHeight, // 屏幕高度
          windowWidth: res.windowWidth, // 可使用窗口宽度
          windowHeight: res.windowHeight, // 可使用窗口高度
          statusBarHeight: res.statusBarHeight, // 状态栏高度
          language: res.language, // 微信设置的语言
          version: res.version, // 微信版本号
          system: res.system, // 操作系统版本
          platform: res.platform, // 客户端平台
          fontSizeSetting: res.fontSizeSetting, // 用户字体大小设置
          SDKVersion: res.SDKVersion // 客户端基础库版本
        });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 检查是否为iPhone X系列刘海屏
function isIPhoneX() {
  return new Promise((resolve) => {
    wx.getSystemInfo({
      success: (res) => {
        const model = res.model.toLowerCase();
        const iphoneXSeries = [
          'iphone x', 'iphone xs', 'iphone xs max', 
          'iphone xr', 'iphone 11', 'iphone 11 pro', 
          'iphone 11 pro max', 'iphone 12', 'iphone 12 mini',
          'iphone 12 pro', 'iphone 12 pro max', 'iphone 13',
          'iphone 13 mini', 'iphone 13 pro', 'iphone 13 pro max',
          'iphone 14', 'iphone 14 plus', 'iphone 14 pro', 
          'iphone 14 pro max'
        ];
        
        const isIPhoneX = iphoneXSeries.some(series => model.includes(series));
        resolve(isIPhoneX);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
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

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 生成颜色渐变
function generateGradientColors(startColor, endColor, steps) {
  // 解析十六进制颜色
  function parseColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  
  // 将RGB转换为十六进制
  function toHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  const start = parseColor(startColor);
  const end = parseColor(endColor);
  
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(start[0] + ratio * (end[0] - start[0]));
    const g = Math.round(start[1] + ratio * (end[1] - start[1]));
    const b = Math.round(start[2] + ratio * (end[2] - start[2]));
    colors.push(toHex(r, g, b));
  }
  
  return colors;
}

module.exports = {
  debounce,
  throttle,
  formatPrice,
  formatRating,
  formatRelativeTime,
  checkNetwork,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  formatTime,
  deepClone,
  validatePhone,
  validateEmail,
  getUrlParams,
  generateId,
  isEmptyObject,
  uniqueArray,
  querySelector,
  querySelectorAll,
  getSystemInfo,
  getDeviceInfo,
  isIPhoneX,
  formatFileSize,
  getRandomColor,
  generateGradientColors
};