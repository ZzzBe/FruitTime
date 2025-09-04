// pages/base/BasePage.js
// 页面基类，提供通用功能

const {
  showToast,
  showModal,
  showLoading,
  hideLoading,
  checkNetwork,
  getDeviceInfo
} = require('../../utils/index.js');

class BasePage {
  constructor() {
    // 页面数据
    this.data = {};
  }

  // 页面加载
  onLoad(options) {
    console.log('页面加载:', this.route, options);
  }

  // 页面显示
  onShow() {
    console.log('页面显示:', this.route);
  }

  // 页面隐藏
  onHide() {
    console.log('页面隐藏:', this.route);
  }

  // 页面卸载
  onUnload() {
    console.log('页面卸载:', this.route);
  }

  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新:', this.route);
    // 隐藏刷新状态
    wx.stopPullDownRefresh();
  }

  // 上拉触底
  onReachBottom() {
    console.log('上拉触底:', this.route);
  }

  // 页面滚动
  onPageScroll(scroll) {
    // console.log('页面滚动:', this.route, scroll);
  }

  // 分享功能
  onShareAppMessage() {
    return {
      title: '果识通',
      path: '/pages/homepage/homepage'
    };
  }

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '果识通',
      query: ''
    };
  }

  // 检查网络状态
  async checkNetworkStatus() {
    try {
      const networkType = await checkNetwork();
      if (networkType === 'none') {
        showToast('网络连接已断开');
        return false;
      }
      return true;
    } catch (error) {
      console.error('检查网络状态失败:', error);
      return false;
    }
  }

  // 获取设备信息
  async getDeviceInfo() {
    try {
      return await getDeviceInfo();
    } catch (error) {
      console.error('获取设备信息失败:', error);
      return null;
    }
  }

  // 显示确认对话框
  async showConfirmDialog(title, content, confirmText = '确定', cancelText = '取消') {
    return new Promise((resolve) => {
      showModal({
        title,
        content,
        confirmText,
        cancelText,
        confirmColor: '#10b981',
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  }

  // 延迟执行
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 防抖函数
  debounce(func, wait, immediate = false) {
    let timeout;
    return (...args) => {
      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      }, wait);

      if (callNow) func.apply(this, args);
    };
  }

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;

    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
}

module.exports = BasePage;
