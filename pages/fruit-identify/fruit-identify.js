// pages/fruit-identify/fruit-identify.js
const {
  showToast,
  showModal,
  showLoading,
  hideLoading,
  formatTime
} = require('../../utils/index.js');

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
} = require('../../utils/network/api.js');

Page({
  data: {
    currentMode: 'camera', // camera, album, ocr
    hasCameraPermission: false,
    // 控制历史记录是否显示，用于懒加载
    historyLoaded: false,
    historyList: [],
    // 相机相关
    devicePosition: 'back', // 前置/后置摄像头
    flashMode: 'auto', // 闪光灯模式
    isProcessing: false // 是否正在处理图片
  },

  onLoad() {
    // 页面加载时执行
    this.checkCameraPermission();

    // 加载识别历史
    this.loadHistory();
  },

  onShow() {
    // 页面显示时重新检查权限
    this.checkCameraPermission();

    // 刷新历史记录
    this.loadHistory();
  },

  checkCameraPermission() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          this.setData({
            hasCameraPermission: true
          });
        } else {
          // 不再自动请求权限，等待用户主动触发
          this.setData({
            hasCameraPermission: false
          });
        }
      },
      fail: (err) => {
        console.error('获取权限设置失败:', err);
        this.setData({
          hasCameraPermission: false
        });
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
        wx.showModal({
          title: '权限提醒',
          content: '需要相机权限才能进行拍照识别，是否前往设置开启？',
          confirmText: '去设置',
          confirmColor: '#10b981',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.camera']) {
                    this.setData({
                      hasCameraPermission: true
                    });
                    wx.showToast({ title: '相机权限已开启', icon: 'success' });
                  }
                }
              });
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

    // 如果切换到相机模式但没有权限，则请求权限
    if (mode === 'camera' && !this.data.hasCameraPermission) {
      this.requestCameraPermission();
    }
  },

  // 切换摄像头
  switchCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  // 切换闪光灯
  toggleFlash() {
    const modes = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(this.data.flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setData({
      flashMode: modes[nextIndex]
    });
  },

  takePhoto() {
    if (!this.data.hasCameraPermission) {
      showToast('请先授权相机权限');
      return;
    }

    if (this.data.isProcessing) {
      return;
    }

    const context = wx.createCameraContext();
    context.takePhoto({
      quality: 'high',
      success: (res) => {
        this.processImage(res.tempImagePath);
      },
      fail: (err) => {
        console.error('拍照失败:', err);
        showToast('拍照失败，请重试');
      }
    });
  },

  // 选择相册图片
  chooseFromAlbum() {
    if (this.data.isProcessing) {
      return;
    }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 压缩图片
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        // 检查图片大小
        const fileSize = res.tempFiles[0].size;
        if (fileSize > 10 * 1024 * 1024) { // 10MB
          showToast('图片过大，请选择小于10MB的图片');
          return;
        }
        this.processImage(tempFilePath);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        // 用户取消选择不算错误
        if (err.errMsg && !err.errMsg.includes('cancel')) {
          showToast('选择图片失败，请重试');
        }
      }
    });
  },

  // 处理图片（识别）
  processImage(imagePath) {
    if (this.data.isProcessing) {
      return;
    }

    this.setData({
      isProcessing: true
    });

    showLoading('识别中...');

    // 模拟上传图片到服务器进行识别
    // 实际项目中这里会调用api.uploadImage进行图片上传和识别
    setTimeout(() => {
      hideLoading();
      this.setData({
        isProcessing: false
      });

      // 模拟识别结果
      const mockResult = {
        fruitId: 1,
        varietyId: 1,
        varietyName: '麒麟西瓜',
        confidence: 0.95,
        image: imagePath
      };

      // 保存到识别历史
      const app = getApp();
      app.addIdentifyHistory({
        id: mockResult.varietyId,
        name: mockResult.varietyName,
        image: mockResult.image,
        confidence: mockResult.confidence,
        time: formatTime(new Date())
      });

      // 跳转到结果页面
      wx.navigateTo({
        url: `/pages/fruit-result/fruit-result?fruitId=${mockResult.fruitId}&varietyId=${mockResult.varietyId}`
      });
    }, 2000);
  },

  cameraError(e) {
    console.log('相机错误:', e.detail);
    // 根据错误类型显示不同提示
    if (e.detail.errMsg && e.detail.errMsg.includes('权限')) {
      this.setData({
        hasCameraPermission: false
      });
      showToast('相机权限未开启');
    } else {
      showToast('相机启动失败，请重试');
    }
  },

  // 查看历史记录详情
  viewHistoryDetail(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.historyList[index];

    if (record) {
      wx.navigateTo({
        url: `/pages/fruit-detail/fruit-detail?id=${record.id}`
      });
    }
  },

  // 删除历史记录
  deleteHistoryRecord(e) {
    const index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '删除记录',
      content: '确定要删除这条识别记录吗？',
      confirmColor: '#10b981',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          const history = app.getIdentifyHistory();
          history.splice(index, 1);
          app.globalData.identifyHistory = history;
          wx.setStorageSync('identifyHistory', history);

          // 更新页面数据
          this.setData({
            historyList: history
          });

          showToast('已删除', 'success');
        }
      }
    });
  },

  // 清空历史记录
  clearHistory() {
    if (this.data.historyList.length === 0) {
      return;
    }

    wx.showModal({
      title: '清空记录',
      content: '确定要清空所有识别记录吗？',
      confirmColor: '#10b981',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.clearIdentifyHistory();

          // 更新页面数据
          this.setData({
            historyList: []
          });

          showToast('已清空', 'success');
        }
      }
    });
  },

  // 加载识别历史
  loadHistory() {
    try {
      const app = getApp();
      const history = app.getIdentifyHistory();

      // 格式化时间显示
      const formattedHistory = history.map(item => {
        return {
          ...item,
          time: this.formatTimeDiff(item.timestamp)
        };
      });

      this.setData({
        historyList: formattedHistory,
        historyLoaded: true
      });
    } catch (err) {
      console.error('加载历史记录失败:', err);
      showToast('加载历史记录失败');
    }
  },

  // 格式化时间差
  formatTimeDiff(timestamp) {
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
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
});
