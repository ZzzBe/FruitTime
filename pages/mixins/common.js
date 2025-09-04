// pages/mixins/common.js
// 通用页面混入，提供公共功能

const {
  showToast,
  showModal,
  showLoading,
  hideLoading,
  checkNetwork,
  getDeviceInfo,
  handleApiError,
  handleNetworkError,
  handlePromiseError
} = require('../../utils/index.js');

const commonMixin = {
  // 数据
  data: {
    // 页面加载状态
    pageLoading: false,
    // 网络状态
    networkAvailable: true,
    // 设备信息
    deviceInfo: null
  },

  // 生命周期
  onLoad(options) {
    // 检查网络状态
    this.checkNetworkStatus();

    // 获取设备信息
    this.getDeviceInfo();
  },

  onShow() {
    // 页面显示时检查网络状态
    this.checkNetworkStatus();
  },

  // 方法
  // 检查网络状态
  async checkNetworkStatus() {
    try {
      const networkType = await checkNetwork();
      this.setData({
        networkAvailable: networkType !== 'none'
      });

      if (networkType === 'none') {
        showToast('网络连接已断开');
      }
    } catch (error) {
      console.error('检查网络状态失败:', error);
    }
  },

  // 获取设备信息
  async getDeviceInfo() {
    try {
      const deviceInfo = await getDeviceInfo();
      this.setData({
        deviceInfo
      });
    } catch (error) {
      console.error('获取设备信息失败:', error);
    }
  },

  // 显示加载状态
  showPageLoading(title = '加载中...') {
    this.setData({
      pageLoading: true
    });
    showLoading(title);
  },

  // 隐藏加载状态
  hidePageLoading() {
    this.setData({
      pageLoading: false
    });
    hideLoading();
  },

  // 显示确认对话框
  showConfirm(title, content, confirmText = '确定', cancelText = '取消') {
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
  },

  // 通用API调用处理
  async callApi(apiFunc, params, successMessage, errorMessage) {
    this.showPageLoading();

    try {
      const result = await apiFunc(params);

      if (result.code === 200) {
        if (successMessage) {
          showToast(successMessage, 'success');
        }
        this.hidePageLoading();
        return result.data;
      } else {
        throw new Error(result.message || errorMessage || '操作失败');
      }
    } catch (error) {
      this.hidePageLoading();
      handleApiError(error, errorMessage);
      throw error;
    }
  },

  // 通用Promise处理
  handlePromise(promise, successCallback, errorCallback) {
    return handlePromiseError(
      promise,
      successCallback,
      errorCallback || ((error) => handleApiError(error)),
      () => this.hidePageLoading()
    );
  },

  // 延迟执行
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 页面滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  // 页面滚动到底部
  scrollToBottom() {
    wx.createSelectorQuery()
      .select('.container')
      .boundingClientRect(rect => {
        if (rect) {
          wx.pageScrollTo({
            scrollTop: rect.height,
            duration: 300
          });
        }
      })
      .exec();
  }
};

module.exports = commonMixin;
