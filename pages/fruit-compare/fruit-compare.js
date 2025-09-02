// pages/fruit-compare/index.js
const util = require('../../utils/util.js');

Page({
  data: {
    comparisonFruits: [
      {
        id: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=100&h=100&fit=crop',
        price: '¥3.99/斤',
        rating: 4.8
      },
      {
        id: 2,
        name: '无籽西瓜',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=100&h=100&fit=crop',
        price: '¥4.50/斤',
        rating: 4.2
      },
      {
        id: 3,
        name: '黑美人西瓜',
        image: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=100&h=100&fit=crop',
        price: '¥5.20/斤',
        rating: 4.5
      }
    ],
    priceData: [
      { value: '¥3.99', isBest: true },
      { value: '¥4.50', isBest: false },
      { value: '¥5.20', isBest: false }
    ],
    sweetnessData: [
      { value: '13°', isBest: false },
      { value: '12°', isBest: false },
      { value: '14°', isBest: true }
    ],
    waterData: [
      { value: '92%', isBest: false },
      { value: '93%', isBest: true },
      { value: '91%', isBest: false }
    ],
    calorieData: [
      { value: '30 kcal', isBest: true },
      { value: '31 kcal', isBest: false },
      { value: '32 kcal', isBest: false }
    ],
    vitaminCData: [
      { value: '8.1mg', isBest: false },
      { value: '8.5mg', isBest: true },
      { value: '7.8mg', isBest: false }
    ],
    tasteData: [
      { filled: 5, score: '4.8分' },
      { filled: 4, score: '4.2分' },
      { filled: 4.5, score: '4.5分' }
    ],
    priceBars: [
      { label: '麒麟西瓜', percent: 77, value: '¥3.99', color: '#10b981' },
      { label: '无籽西瓜', percent: 87, value: '¥4.50', color: '#f59e0b' },
      { label: '黑美人', percent: 100, value: '¥5.20', color: '#ef4444' }
    ],
    sweetnessBars: [
      { label: '麒麟西瓜', percent: 93, value: '13°', color: '#8b5cf6' },
      { label: '无籽西瓜', percent: 86, value: '12°', color: '#8b5cf6' },
      { label: '黑美人', percent: 100, value: '14°', color: '#8b5cf6' }
    ],
    maxFruits: 3,
    recommendation: {
      title: '智能推荐',
      text: '根据您的健康档案，推荐选择麒麟西瓜：价格适中，甜度高，适合日常补水需求。'
    },
    // 控制图表是否显示，用于懒加载
    chartsLoaded: false
  },

  onLoad() {
    // 页面加载时执行
    this.calculateComparisonData();
    
    // 延迟加载图表数据
    setTimeout(() => {
      this.setData({
        chartsLoaded: true
      });
    }, 300);
  },

  calculateComparisonData() {
    // 模拟计算对比数据
    console.log('计算对比数据');
  },

  removeFruit(e) {
    const id = e.currentTarget.dataset.id;
    // 移除水果逻辑
    const newFruits = this.data.comparisonFruits.filter(fruit => fruit.id != id);
    
    this.setData({
      comparisonFruits: newFruits
    });
    
    util.showToast('已移除', 'success');
    
    // 重新计算对比数据
    this.calculateComparisonData();
  },

  addMoreFruits() {
    // 添加更多水果逻辑
    if (this.data.comparisonFruits.length >= this.data.maxFruits) {
      util.showToast('最多可对比' + this.data.maxFruits + '种水果');
      return;
    }
    
    util.showToast('添加更多水果功能开发中');
  },
  
  viewFruitDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + id
    });
  }
});