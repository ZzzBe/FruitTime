// app.js
const { 
  showToast,
  showModal,
  formatPrice,
  formatRating,
  formatRelativeTime,
  showLoading,
  hideLoading,
  deepClone,
  isEmptyObject,
  uniqueArray
} = require('./utils/index.js');

App({
  onLaunch() {
    // 小程序初始化
    console.log('小程序初始化');
    
    // 初始化全局数据
    this.initGlobalData();
  },
  
  initGlobalData() {
    // 初始化用户健康数据
    const healthData = wx.getStorageSync('healthData') || {
      age: null,
      gender: null,
      weight: null,
      conditions: [], // 慢性病
      sugarLimit: 50, // 每日建议糖分摄入(g)
      tastePref: [], // 口味偏好
      allergies: [] // 过敏史
    };
    
    // 初始化对比列表
    const comparisonList = wx.getStorageSync('comparisonList') || [];
    
    // 初始化识别历史
    const identifyHistory = wx.getStorageSync('identifyHistory') || [];
    
    this.globalData = {
      userInfo: null,
      healthData,
      comparisonList,
      identifyHistory
    };
    
    console.log('初始化全局数据');
  },
  
  globalData: {
    userInfo: null,
    healthData: {
      age: null,
      gender: null,
      weight: null,
      conditions: [],
      sugarLimit: 50,
      tastePref: [],
      allergies: []
    },
    comparisonList: [],
    identifyHistory: []
  },
  
  // 更新用户健康数据
  updateHealthData(data) {
    this.globalData.healthData = {
      ...this.globalData.healthData,
      ...data
    };
    
    // 持久化存储
    wx.setStorageSync('healthData', this.globalData.healthData);
    
    // 通知相关页面更新
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (typeof page.onHealthDataUpdate === 'function') {
        page.onHealthDataUpdate(this.globalData.healthData);
      }
    });
  },
  
  // 添加水果到对比列表
  addToComparison(fruit) {
    const comparisonList = this.globalData.comparisonList;
    
    // 检查是否已存在
    const exists = comparisonList.find(item => item.id === fruit.id);
    if (exists) {
      wx.showToast({
        title: '已添加到对比',
        icon: 'none'
      });
      return false;
    }
    
    // 检查数量限制 (PRD要求最多4个)
    if (comparisonList.length >= 4) {
      wx.showToast({
        title: '最多可对比4种水果',
        icon: 'none'
      });
      return false;
    }
    
    // 添加到对比列表
    this.globalData.comparisonList.push(fruit);
    
    // 持久化存储
    wx.setStorageSync('comparisonList', this.globalData.comparisonList);
    
    // 通知相关页面更新
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (typeof page.onComparisonListUpdate === 'function') {
        page.onComparisonListUpdate(this.globalData.comparisonList);
      }
    });
    
    wx.showToast({
      title: '已添加到对比',
      icon: 'success'
    });
    
    return true;
  },
  
  // 从对比列表移除水果
  removeFromComparison(fruitId) {
    this.globalData.comparisonList = this.globalData.comparisonList.filter(item => item.id !== fruitId);
    
    // 持久化存储
    wx.setStorageSync('comparisonList', this.globalData.comparisonList);
    
    // 通知相关页面更新
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (typeof page.onComparisonListUpdate === 'function') {
        page.onComparisonListUpdate(this.globalData.comparisonList);
      }
    });
  },
  
  // 获取对比列表
  getComparisonList() {
    return this.globalData.comparisonList;
  },
  
  // 清空对比列表
  clearComparisonList() {
    this.globalData.comparisonList = [];
    
    // 持久化存储
    wx.setStorageSync('comparisonList', this.globalData.comparisonList);
    
    // 通知相关页面更新
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (typeof page.onComparisonListUpdate === 'function') {
        page.onComparisonListUpdate(this.globalData.comparisonList);
      }
    });
  },
  
  // 添加识别历史
  addIdentifyHistory(record) {
    // 添加时间戳
    record.timestamp = Date.now();
    
    // 添加到历史记录开头
    this.globalData.identifyHistory.unshift(record);
    
    // 限制历史记录数量为20条
    if (this.globalData.identifyHistory.length > 20) {
      this.globalData.identifyHistory = this.globalData.identifyHistory.slice(0, 20);
    }
    
    // 持久化存储
    wx.setStorageSync('identifyHistory', this.globalData.identifyHistory);
  },
  
  // 获取识别历史
  getIdentifyHistory() {
    return this.globalData.identifyHistory;
  },
  
  // 清空识别历史
  clearIdentifyHistory() {
    this.globalData.identifyHistory = [];
    wx.setStorageSync('identifyHistory', this.globalData.identifyHistory);
  }
})