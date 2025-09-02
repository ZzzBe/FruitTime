// pages/recommend/index.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    healthProfile: {
      bloodSugar: '正常',
      weightGoal: '减脂期',
      allergies: '无',
      tastePreference: '偏甜'
    },
    recommendationTags: [
      { text: '低热量', class: 'tag-green' },
      { text: '高水分', class: 'tag-blue' },
      { text: '当季水果', class: 'tag-purple' },
      { text: '减脂友好', class: 'tag-yellow' },
      { text: '维C丰富', class: 'tag-red' }
    ],
    recommendations: [
      {
        rank: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=80&h=80&fit=crop',
        rating: 4.8,
        description: '减脂期首选，低热量高水分',
        price: '¥3.99/斤',
        tags: ['低热量', '高水分'],
        tagClass: 'tag-green'
      },
      {
        rank: 2,
        name: '红颜草莓',
        image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=80&h=80&fit=crop',
        rating: 4.7,
        description: '维C丰富，抗氧化',
        price: '¥15.8/盒',
        tags: ['维C高', '抗氧化'],
        tagClass: 'tag-purple'
      },
      {
        rank: 3,
        name: '赣南脐橙',
        image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=80&h=80&fit=crop',
        rating: 4.6,
        description: '膳食纤维丰富，助消化',
        price: '¥4.5/斤',
        tags: ['膳食纤维', '助消化'],
        tagClass: 'tag-orange'
      },
      {
        rank: 4,
        name: '智利蓝莓',
        image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=80&h=80&fit=crop',
        rating: 4.9,
        description: '抗氧化之王，护眼佳品',
        price: '¥12.9/盒',
        tags: ['抗氧化', '护眼'],
        tagClass: 'tag-indigo'
      },
      {
        rank: 5,
        name: '台农芒果',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop',
        rating: 4.5,
        description: '香甜可口，适量食用',
        price: '¥8.5/斤',
        tags: ['香甜', '适量'],
        tagClass: 'tag-pink'
      }
    ],
    explanation: [
      { text: '基于您的减脂需求，优先推荐低热量水果' },
      { text: '考虑您的口味偏好，选择甜度适中的品种' },
      { text: '当季水果，营养价值和口感更佳' }
    ]
  },

  onLoad() {
    // 页面加载时执行
    this.loadHealthProfile();
    this.loadRecommendations();
  },

  loadHealthProfile() {
    // 模拟加载健康档案
    console.log('加载健康档案');
    
    // 实际项目中会从服务器获取用户健康数据
    const app = getApp();
    const healthData = app.globalData.healthData;
    
    this.setData({
      healthProfile: {
        bloodSugar: healthData.bloodSugar === 'normal' ? '正常' : 
                     healthData.bloodSugar === 'high' ? '偏高' : '偏低',
        weightGoal: healthData.weightGoal === 'lose' ? '减脂期' : 
                   healthData.weightGoal === 'maintain' ? '维持体重' : '增重期',
        allergies: healthData.allergies.length > 0 ? healthData.allergies.join(', ') : '无',
        tastePreference: healthData.tastePreference === 'sweet' ? '偏甜' : 
                        healthData.tastePreference === 'sour' ? '偏酸' : '中性'
      }
    });
  },

  loadRecommendations() {
    // 使用API获取推荐水果
    const app = getApp();
    const healthData = app.globalData.healthData;
    
    util.showLoading('生成推荐中...');
    
    api.getRecommendations(healthData)
      .then(res => {
        util.hideLoading();
        if (res.code === 200) {
          this.setData({
            recommendations: res.data
          });
        }
      })
      .catch(err => {
        util.hideLoading();
        util.showToast('获取推荐失败');
        console.error('获取推荐失败:', err);
      });
  },

  editHealthData() {
    // 编辑健康数据
    util.showToast('健康档案编辑功能开发中');
  },

  refreshRecommendations() {
    // 重新生成推荐
    this.loadRecommendations();
  },
  
  viewFruitDetail(e) {
    const rank = e.currentTarget.dataset.rank;
    const fruit = this.data.recommendations.find(item => item.rank === rank);
    if (fruit) {
      wx.navigateTo({
        url: '/pages/fruit-detail/fruit-detail?id=' + rank
      });
    }
  }
});