// utils/device/device.js
// 设备信息相关工具函数

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

module.exports = {
  checkNetwork,
  getSystemInfo,
  getDeviceInfo,
  isIPhoneX
};