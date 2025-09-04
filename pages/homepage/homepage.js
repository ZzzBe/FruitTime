// pages/index/index.js
const {
  showToast,
  showLoading,
  hideLoading,
  debounce,
  checkNetwork
} = require('../../utils/index.js');

const {
  searchFruits
} = require('../../utils/network/api.js');

Page({
  data: {
    searchValue: '',
    recommendedFruit: {
      id: 1,
      name: '进口凤梨',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=200&fit=crop',
      description: '甜度高达13°，汁多味甜',
      price: '¥3.99/斤'
    },
    // 控制内容是否显示，用于懒加载
    contentLoaded: false
  },

  onLoad() {
    // 页面加载时执行
    this.loadRecommendedFruit();

    // 延迟加载非关键内容
    setTimeout(() => {
      this.setData({
        contentLoaded: true
      });
    }, 100);
  },

  loadRecommendedFruit() {
    // 实际项目中这里会从服务器获取推荐水果
    // 这里使用模拟数据
    console.log('加载今日推荐水果');
  },

  onSearchInput: debounce(function(e) {
    this.setData({
      searchValue: e.detail.value
    });

    if (e.detail.value.trim()) {
      this.performSearch(e.detail.value);
    }
  }, 300),

  performSearch(keyword) {
    // 实际项目中这里会调用搜索API
    console.log('搜索关键词:', keyword);
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  navigateToIdentify() {
    wx.navigateTo({
      url: '/pages/fruit-identify/fruit-identify'
    });
  },

  navigateToCompare() {
    wx.navigateTo({
      url: '/pages/fruit-compare/fruit-compare'
    });
  },

  navigateToRecommend() {
    wx.navigateTo({
      url: '/pages/fruit-recommend/fruit-recommend'
    });
  },

  viewFruitDetail() {
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + this.data.recommendedFruit.id
    });
  },

  onUnload() {
    // 清除定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },

  onShow() {
    // 页面显示时检查网络状态
    checkNetwork()
      .then(networkType => {
        console.log('当前网络状态:', networkType);
      })
      .catch(err => {
        console.error('检查网络状态失败:', err);
      });
  }
});
