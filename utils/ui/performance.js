// utils/ui/performance.js
// 性能优化相关工具函数

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

module.exports = {
  debounce,
  throttle
};