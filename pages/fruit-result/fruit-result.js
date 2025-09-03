// pages/fruit-result/index.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  data: {
    fruitInfo: null,
    nutritionInfo: null,
    healthTip: '',
    similarFruits: [],
    // 价格趋势数据
    priceTrend: [],
    // 口感特征数据
    tasteFeatures: [],
    // 糖度/酸度数据
    sugarAcidData: [],
    // 选项卡当前选中项
    activeTab: 'basic',
    // 数据加载状态
    loading: true,
    // 是否已添加到对比
    addedToCompare: false
  },

  onLoad(options) {
    // 页面加载时执行
    // 根据options.id从服务器获取水果信息
    const fruitId = options.fruitId || options.id;
    const varietyId = options.varietyId;
    
    if (fruitId || varietyId) {
      this.loadFruitInfo(varietyId || fruitId);
    } else {
      util.showToast('参数错误');
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }
  },

  loadFruitInfo(varietyId) {
    this.setData({
      loading: true
    });
    
    // 使用API获取水果信息
    api.getFruitDetail(varietyId)
      .then(res => {
        if (res.code === 200) {
          const data = res.data;
          
          // 处理营养成分数据
          const nutritionInfo = this.processNutritionData(data.nutrition);
          
          // 处理价格趋势数据
          const priceTrend = this.processPriceTrendData(data.prices);
          
          // 处理口感特征数据
          const tasteFeatures = this.processTasteData(data.reviews);
          
          // 处理糖度/酸度数据
          const sugarAcidData = this.processSugarAcidData(data);
          
          // 生成健康提示
          const healthTip = this.generateHealthTip(data, getApp().globalData.healthData);
          
          this.setData({
            fruitInfo: data,
            nutritionInfo,
            priceTrend,
            tasteFeatures,
            sugarAcidData,
            healthTip,
            similarFruits: data.similar || [],
            loading: false
          });
        } else {
          throw new Error(res.message || '获取水果信息失败');
        }
      })
      .catch(err => {
        util.showToast('获取水果信息失败');
        console.error('获取水果信息失败:', err);
        this.setData({
          loading: false
        });
      });
  },
  
  // 处理营养成分数据
  processNutritionData(nutrition) {
    if (!nutrition) return null;
    
    return {
      calories: { 
        name: '热量', 
        value: `${nutrition.calories || 0}kcal`, 
        percent: this.calculatePercent(nutrition.calories, 100, 0) 
      },
      sugar: { 
        name: '糖分', 
        value: `${nutrition.sugar || 0}g`, 
        percent: this.calculatePercent(nutrition.sugar, 20, 0) 
      },
      fiber: { 
        name: '膳食纤维', 
        value: `${nutrition.fiber || 0}g`, 
        percent: this.calculatePercent(nutrition.fiber, 5, 0) 
      },
      vitaminC: { 
        name: '维生素C', 
        value: `${nutrition.vitamin_c || 0}mg`, 
        percent: this.calculatePercent(nutrition.vitamin_c, 100, 0) 
      },
      potassium: { 
        name: '钾', 
        value: `${nutrition.potassium || 0}mg`, 
        percent: this.calculatePercent(nutrition.potassium, 2000, 0) 
      }
    };
  },
  
  // 处理价格趋势数据
  processPriceTrendData(prices) {
    if (!prices || prices.length === 0) return [];
    
    // 按日期排序
    prices.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 只保留最近6个月的数据
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return prices
      .filter(p => new Date(p.date) >= sixMonthsAgo)
      .map(p => ({
        date: p.date,
        price: parseFloat(p.price),
        platform: p.platform
      }));
  },
  
  // 处理口感特征数据
  processTasteData(reviews) {
    if (!reviews || reviews.length === 0) return [];
    
    // 统计词频和情感得分
    const wordCount = {};
    const sentimentSum = {};
    
    reviews.forEach(review => {
      // 简单分词（实际项目中可以使用NLP库）
      const words = (review.comment || '')
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1);
      
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
        sentimentSum[word] = (sentimentSum[word] || 0) + (review.sentiment_score || 0);
      });
    });
    
    // 转换为标签云数据
    return Object.keys(wordCount)
      .map(word => ({
        text: word,
        count: wordCount[word],
        sentiment: sentimentSum[word] / wordCount[word]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // 取前20个
  },
  
  // 处理糖度/酸度数据
  processSugarAcidData(data) {
    return [
      {
        name: '糖度',
        value: data.brix_avg || 0,
        unit: '°Bx',
        max: 20
      },
      {
        name: '酸度',
        value: data.acid_avg || 0,
        unit: 'g/100g',
        max: 2
      }
    ];
  },
  
  // 生成健康提示
  generateHealthTip(data, healthData) {
    const tips = [];
    
    // 糖尿病患者提示
    if (healthData.conditions && healthData.conditions.includes('糖尿病')) {
      if (data.nutrition && data.nutrition.sugar > 10) {
        tips.push('该水果含糖量较高，糖尿病患者请适量食用');
      } else {
        tips.push('该水果含糖量适中，糖尿病患者可适量食用');
      }
    }
    
    // 减脂提示
    if (healthData.weightGoal === 'lose') {
      if (data.nutrition && data.nutrition.calories < 50) {
        tips.push('该水果热量较低，适合减脂期食用');
      }
    }
    
    // 过敏提示
    if (healthData.allergies && healthData.allergies.includes(data.name)) {
      tips.push(`您对${data.name}过敏，请避免食用`);
    }
    
    // 默认提示
    if (tips.length === 0) {
      tips.push('该水果营养丰富，适量食用有益健康');
    }
    
    return tips.join('；');
  },
  
  // 计算百分比
  calculatePercent(value, max, min = 0) {
    if (value == null) return 0;
    const percent = ((value - min) / (max - min)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  },

  // 切换选项卡
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 添加到对比
  addToCompare() {
    if (this.data.addedToCompare) {
      util.showToast('已添加到对比');
      return;
    }
    
    if (!this.data.fruitInfo) {
      util.showToast('数据加载中，请稍后');
      return;
    }
    
    const app = getApp();
    const success = app.addToComparison(this.data.fruitInfo);
    
    if (success) {
      this.setData({
        addedToCompare: true
      });
      
      // 2秒后跳转到对比页面
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/fruit-compare/fruit-compare'
        });
      }, 2000);
    }
  },

  // 推荐给我
  recommendToMe() {
    wx.navigateTo({
      url: '/pages/fruit-recommend/fruit-recommend'
    });
  },

  // 查看详情
  viewDetail() {
    if (!this.data.fruitInfo) {
      util.showToast('数据加载中，请稍后');
      return;
    }
    
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + this.data.fruitInfo.id
    });
  },
  
  // 查看相似水果详情
  viewSimilarFruit(e) {
    const index = e.currentTarget.dataset.index;
    const fruit = this.data.similarFruits[index];
    
    if (fruit) {
      wx.navigateTo({
        url: '/pages/fruit-detail/fruit-detail?id=' + fruit.id
      });
    }
  },
  
  // 分享功能
  onShareAppMessage() {
    if (!this.data.fruitInfo) {
      return {
        title: '果识通',
        path: '/pages/homepage/homepage'
      };
    }
    
    return {
      title: '我发现了一个很棒的水果：' + this.data.fruitInfo.name,
      path: '/pages/fruit-detail/fruit-detail?id=' + this.data.fruitInfo.id,
      imageUrl: this.data.fruitInfo.image
    };
  },
  
  // 分享到朋友圈（如果支持）
  onShareTimeline() {
    if (!this.data.fruitInfo) {
      return {
        title: '果识通',
        query: ''
      };
    }
    
    return {
      title: '我发现了一个很棒的水果：' + this.data.fruitInfo.name,
      query: 'id=' + this.data.fruitInfo.id,
      imageUrl: this.data.fruitInfo.image
    };
  }
});