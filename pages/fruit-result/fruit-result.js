// pages/fruit-result/index.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    fruitInfo: {
      id: 1,
      name: '麒麟西瓜',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      description: '甜度13° | 当季水果',
      price: '¥3.99',
      unit: '/斤',
      sweetness: 13,
      waterContent: 92,
      calories: 30
    },
    nutritionInfo: {
      vitaminC: { name: '维生素C', value: '8.1mg', percent: 65 },
      fiber: { name: '膳食纤维', value: '0.4g', percent: 40 },
      potassium: { name: '钾', value: '112mg', percent: 75 }
    },
    healthTip: '西瓜含水量高，适合夏季补水，但糖尿病患者需控制摄入量。',
    similarFruits: [
      {
        id: 1,
        name: '无籽西瓜',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=60&h=60&fit=crop',
        description: '甜度12° | 方便食用',
        price: '¥4.5/斤'
      },
      {
        id: 2,
        name: '黑美人西瓜',
        image: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=60&h=60&fit=crop',
        description: '甜度14° | 皮薄肉脆',
        price: '¥5.2/斤'
      }
    ]
  },

  onLoad(options) {
    // 页面加载时执行
    // 实际项目中会根据options.id从服务器获取水果信息
    if (options.id) {
      this.loadFruitInfo(options.id);
    }
  },

  loadFruitInfo(fruitId) {
    // 使用API获取水果信息
    api.getFruitDetail(fruitId)
      .then(res => {
        if (res.code === 200) {
          this.setData({
            fruitInfo: res.data
          });
        }
      })
      .catch(err => {
        util.showToast('获取水果信息失败');
        console.error('获取水果信息失败:', err);
      });
  },

  addToCompare(e) {
    const id = e.currentTarget.dataset.id;
    // 添加到对比功能
    // 实际项目中会将水果添加到全局对比列表中
    util.showToast('已添加到对比', 'success');
    
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/fruit-compare/fruit-compare'
      });
    }, 1000);
  },

  recommendToMe() {
    // 推荐给我
    wx.navigateTo({
      url: '/pages/fruit-recommend/fruit-recommend'
    });
  },

  viewDetail() {
    // 查看详情
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + this.data.fruitInfo.id
    });
  },
  
  onShareAppMessage() {
    // 分享功能
    return {
      title: '我发现了一个很棒的水果：' + this.data.fruitInfo.name,
      path: '/pages/fruit-detail/fruit-detail?id=' + this.data.fruitInfo.id
    };
  }
});