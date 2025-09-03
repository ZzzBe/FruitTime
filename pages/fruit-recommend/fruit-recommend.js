// pages/fruit-recommend/fruit-recommend.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    // 用户健康档案
    healthProfile: null,
    // 推荐标签
    recommendationTags: [],
    // 推荐水果列表
    recommendations: [],
    // 推荐理由
    explanation: [],
    // 是否已填写健康档案
    hasHealthProfile: false,
    // 数据加载状态
    loading: false,
    // 是否正在刷新
    refreshing: false,
    // 当前季节
    season: '',
    // 用户偏好设置
    preferences: {
      favoriteFruits: [], // 收藏的水果
      dislikedFruits: []  // 不喜欢的水果
    }
  },

  onLoad() {
    // 页面加载时执行
    this.determineSeason();
    this.loadHealthProfile();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadHealthProfile();
    this.loadRecommendations();
  },

  // 确定当前季节
  determineSeason() {
    const month = new Date().getMonth() + 1;
    let season = '';
    
    if (month >= 3 && month <= 5) {
      season = '春季';
    } else if (month >= 6 && month <= 8) {
      season = '夏季';
    } else if (month >= 9 && month <= 11) {
      season = '秋季';
    } else {
      season = '冬季';
    }
    
    this.setData({
      season
    });
  },

  // 加载健康档案
  loadHealthProfile() {
    const app = getApp();
    const healthData = app.globalData.healthData;
    
    // 检查是否已填写健康档案
    const hasProfile = !!(healthData.age && healthData.gender);
    
    // 格式化健康档案数据
    const healthProfile = {
      age: healthData.age || null,
      gender: healthData.gender || null,
      weight: healthData.weight || null,
      conditions: healthData.conditions && healthData.conditions.length > 0 ? 
                  healthData.conditions.join('、') : '无',
      sugarLimit: healthData.sugarLimit || 50,
      tastePref: healthData.tastePref && healthData.tastePref.length > 0 ? 
                 healthData.tastePref.join('、') : '未设置',
      allergies: healthData.allergies && healthData.allergies.length > 0 ? 
                 healthData.allergies : '无'
    };
    
    this.setData({
      healthProfile,
      hasHealthProfile: hasProfile
    });
  },

  // 加载推荐水果
  loadRecommendations() {
    if (this.data.refreshing) return;
    
    this.setData({
      loading: true
    });
    
    const app = getApp();
    const healthData = app.globalData.healthData;
    
    // 如果没有健康档案，显示提示
    if (!this.data.hasHealthProfile) {
      this.setData({
        loading: false,
        recommendations: [],
        explanation: [{ text: '请先完善健康档案，以获得更精准的推荐' }]
      });
      return;
    }
    
    // 使用API获取推荐水果
    api.getRecommendations(healthData)
      .then(res => {
        if (res.code === 200) {
          // 处理推荐数据
          const recommendations = this.processRecommendations(res.data);
          
          // 生成推荐理由
          const explanation = this.generateExplanation(healthData, recommendations);
          
          // 生成推荐标签
          const recommendationTags = this.generateTags(healthData, recommendations);
          
          this.setData({
            recommendations,
            explanation,
            recommendationTags
          });
        } else {
          throw new Error(res.message || '获取推荐失败');
        }
      })
      .catch(err => {
        console.error('获取推荐失败:', err);
        util.showToast('获取推荐失败');
        this.setData({
          recommendations: [],
          explanation: [{ text: '获取推荐失败，请稍后重试' }]
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
          refreshing: false
        });
      });
  },

  // 处理推荐数据
  processRecommendations(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item, index) => {
      return {
        ...item,
        rank: index + 1,
        // 格式化评分
        rating: parseFloat(item.rating || 0).toFixed(1),
        // 格式化价格
        price: util.formatPrice(item.price),
        // 生成标签
        tags: this.generateFruitTags(item),
        // 标签样式
        tagClass: this.getTagClass(index)
      };
    });
  },

  // 生成水果标签
  generateFruitTags(fruit) {
    const tags = [];
    
    // 营养标签
    if (fruit.calories && fruit.calories < 50) tags.push('低热量');
    if (fruit.vitamin_c && fruit.vitamin_c > 50) tags.push('维C丰富');
    if (fruit.fiber && fruit.fiber > 2) tags.push('高纤维');
    if (fruit.potassium && fruit.potassium > 200) tags.push('富钾');
    
    // 口感标签
    if (fruit.sweetness && fruit.sweetness > 12) tags.push('甜');
    if (fruit.acid && fruit.acid > 0.5) tags.push('酸');
    
    // 季节标签
    if (fruit.isSeasonal) tags.push('当季');
    
    return tags.slice(0, 3); // 最多显示3个标签
  },

  // 获取标签样式类
  getTagClass(index) {
    const classes = [
      'tag-green', 'tag-purple', 'tag-orange', 
      'tag-red', 'tag-indigo', 'tag-pink', 'tag-blue'
    ];
    return classes[index % classes.length];
  },

  // 生成推荐理由
  generateExplanation(healthData, recommendations) {
    const explanations = [];
    
    // 基于健康状况的推荐理由
    if (healthData.conditions && healthData.conditions.length > 0) {
      const condition = healthData.conditions[0];
      if (condition.includes('糖尿病')) {
        explanations.push('基于您的糖尿病状况，优先推荐低糖水果');
      } else if (condition.includes('高血压')) {
        explanations.push('基于您的高血压状况，优先推荐低钠高钾水果');
      }
    }
    
    // 基于体重管理目标的推荐理由
    if (healthData.weightGoal) {
      if (healthData.weightGoal === 'lose') {
        explanations.push('基于您的减脂目标，优先推荐低热量高纤维水果');
      } else if (healthData.weightGoal === 'gain') {
        explanations.push('基于您的增重目标，优先推荐高热量营养丰富水果');
      }
    }
    
    // 基于口味偏好的推荐理由
    if (healthData.tastePref && healthData.tastePref.length > 0) {
      explanations.push(`考虑您的口味偏好（${healthData.tastePref.join('、')}），选择了相应特征的水果`);
    }
    
    // 基于季节的推荐理由
    explanations.push(`推荐了当前${this.data.season}的时令水果，新鲜营养`);
    
    // 基于推荐结果的说明
    if (recommendations && recommendations.length > 0) {
      const topFruit = recommendations[0];
      explanations.push(`综合评分最高的${topFruit.name}，符合您的健康需求`);
    }
    
    return explanations.map(text => ({ text }));
  },

  // 生成推荐标签
  generateTags(healthData, recommendations) {
    const tags = [];
    
    // 健康相关标签
    if (healthData.conditions && healthData.conditions.includes('糖尿病')) {
      tags.push({ text: '控糖友好', class: 'tag-green' });
    }
    
    if (healthData.weightGoal === 'lose') {
      tags.push({ text: '减脂优选', class: 'tag-blue' });
    }
    
    // 营养相关标签
    if (recommendations && recommendations.length > 0) {
      const topFruit = recommendations[0];
      if (topFruit.calories && topFruit.calories < 50) {
        tags.push({ text: '低热量', class: 'tag-yellow' });
      }
      if (topFruit.vitamin_c && topFruit.vitamin_c > 50) {
        tags.push({ text: '维C丰富', class: 'tag-red' });
      }
    }
    
    // 季节标签
    tags.push({ text: `${this.data.season}时令`, class: 'tag-purple' });
    
    return tags;
  },

  // 编辑健康数据
  editHealthData() {
    wx.navigateTo({
      url: '/pages/health-profile/health-profile'
    });
  },

  // 重新生成推荐
  refreshRecommendations() {
    if (this.data.loading) return;
    
    this.setData({
      refreshing: true
    });
    
    // 添加随机扰动，避免推荐结果完全相同
    setTimeout(() => {
      this.loadRecommendations();
    }, 500);
  },
  
  // 查看水果详情
  viewFruitDetail(e) {
    const index = e.currentTarget.dataset.index;
    const fruit = this.data.recommendations[index];
    
    if (fruit) {
      wx.navigateTo({
        url: `/pages/fruit-detail/fruit-detail?id=${fruit.id}`
      });
    }
  },
  
  // 收藏水果
  toggleFavorite(e) {
    const index = e.currentTarget.dataset.index;
    const fruit = this.data.recommendations[index];
    
    if (!fruit) return;
    
    // 切换收藏状态
    const isFavorite = !fruit.isFavorite;
    fruit.isFavorite = isFavorite;
    
    // 更新页面数据
    this.setData({
      [`recommendations[${index}].isFavorite`]: isFavorite
    });
    
    // 实际项目中会调用API保存收藏状态
    if (isFavorite) {
      util.showToast('已收藏', 'success');
    } else {
      util.showToast('已取消收藏', 'success');
    }
  },
  
  // 反馈不喜欢
  dislikeFruit(e) {
    const index = e.currentTarget.dataset.index;
    const fruit = this.data.recommendations[index];
    
    if (!fruit) return;
    
    wx.showModal({
      title: '反馈',
      content: `是否要标记"${fruit.name}"为不喜欢？这将帮助我们优化推荐算法。`,
      confirmColor: '#10b981',
      success: (res) => {
        if (res.confirm) {
          // 实际项目中会调用API记录用户反馈
          util.showToast('感谢反馈，我们将优化推荐算法', 'success');
          
          // 从推荐列表中移除
          const newRecommendations = [...this.data.recommendations];
          newRecommendations.splice(index, 1);
          this.setData({
            recommendations: newRecommendations
          });
        }
      }
    });
  },
  
  // 分享推荐
  shareRecommendation() {
    util.showToast('分享功能开发中');
  }
});