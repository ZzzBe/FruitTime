// utils/ui/util.js
// UI相关工具函数

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

module.exports = {
  showLoading,
  hideLoading,
  showToast,
  showModal,
  querySelector,
  querySelectorAll
};