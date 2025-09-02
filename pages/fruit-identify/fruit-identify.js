// pages/fruit-identify/index.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    currentMode: 'camera',
    historyList: [
      {
        id: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=60&h=60&fit=crop',
        time: '2分钟前',
        sweetness: 13
      },
      {
        id: 2,
        name: '红颜草莓',
        image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=60&h=60&fit=crop',
        time: '5分钟前',
        sweetness: 11
      },
      {
        id: 3,
        name: '台农芒果',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=60&h=60&fit=crop',
        time: '10分钟前',
        sweetness: 15
      }
    ],
    hasCameraPermission: false,
    // 控制历史记录是否显示，用于懒加载
    historyLoaded: false
  },

  onLoad() {
    // 页面加载时执行
    this.checkCameraPermission();
    
    // 延迟加载历史记录
    setTimeout(() => {
      this.setData({
        historyLoaded: true
      });
    }, 200);
  },

  checkCameraPermission() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          this.setData({
            hasCameraPermission: true
          });
        } else {
          this.requestCameraPermission();
        }
      }
    });
  },

  requestCameraPermission() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        this.setData({
          hasCameraPermission: true
        });
      },
      fail: () => {
        wx.showModal({
          title: '权限提醒',
          content: '需要相机权限才能进行拍照识别，是否前往设置开启？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      currentMode: mode
    });
  },

  takePhoto() {
    if (!this.data.hasCameraPermission) {
      wx.showToast({
        title: '请先授权相机权限',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载提示
    util.showLoading('识别中...');
    
    // 模拟拍照识别过程
    setTimeout(() => {
      util.hideLoading();
      wx.navigateTo({
        url: '/pages/fruit-result/fruit-result'
      });
    }, 1500);
  },

  cameraError(e) {
    console.log('相机错误:', e.detail);
    util.showToast('相机启动失败，请重试');
  },

  viewAllHistory() {
    // 查看全部历史
    util.showToast('历史记录功能开发中');
  },

  viewHistoryDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + id
    });
  },
  
  onShow() {
    // 页面显示时重新检查权限
    this.checkCameraPermission();
  },
  
  loadHistory() {
    // 使用API加载识别历史
    api.getIdentifyHistory()
      .then(res => {
        if (res.code === 200) {
          this.setData({
            historyList: res.data
          });
        }
      })
      .catch(err => {
        util.showToast('加载历史记录失败');
        console.error('加载历史记录失败:', err);
      });
  }
});