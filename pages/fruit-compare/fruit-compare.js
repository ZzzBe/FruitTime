// pages/fruit-compare/fruit-compare.js
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const { ChartRenderer, TagCloud } = require('../../utils/chart.js');

Page({
  data: {
    // 对比水果列表
    comparisonFruits: [],
    // 当前选中的对比维度
    activeDimension: 'basic',
    // 营养成分对比数据
    nutritionData: null,
    // 价格趋势对比数据
    priceData: null,
    // 口感特征对比数据
    tasteData: null,
    // 糖酸度对比数据
    sugarData: null,
    // 最大对比水果数量 (PRD要求最多4个)
    maxFruits: 4,
    // 智能推荐
    recommendation: null,
    // 数据加载状态
    loading: false,
    // 图表数据是否已加载
    chartsLoaded: false
  },

  onLoad() {
    // 页面加载时执行
    this.loadComparisonData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadComparisonData();
  },

  onReady() {
    // 页面渲染完成后初始化图表
    this.initCharts();
  },

  // 初始化图表
  async initCharts() {
    // 初始化雷达图
    this.radarChart = new ChartRenderer('radarChart');
    
    // 初始化折线图
    this.lineChart = new ChartRenderer('lineChart');
    
    // 初始化柱状图
    this.barChart = new ChartRenderer('barChart');
    
    // 初始化标签云
    this.tagCloud = new TagCloud('tagCloud');
  },

  // 加载对比数据
  loadComparisonData() {
    const app = getApp();
    const fruits = app.getComparisonList();
    
    this.setData({
      comparisonFruits: fruits
    });
    
    // 如果有水果，加载详细对比数据
    if (fruits.length > 0) {
      this.loadDetailedComparisonData(fruits);
    }
  },

  // 加载详细对比数据
  loadDetailedComparisonData(fruits) {
    this.setData({
      loading: true
    });
    
    // 模拟API调用获取详细数据
    // 实际项目中这里会调用api.getComparisonData
    setTimeout(() => {
      // 生成模拟数据
      const nutritionData = this.generateNutritionData(fruits);
      const priceData = this.generatePriceData(fruits);
      const tasteData = this.generateTasteData(fruits);
      const sugarData = this.generateSugarData(fruits);
      const recommendation = this.generateRecommendation(fruits);
      
      this.setData({
        nutritionData,
        priceData,
        tasteData,
        sugarData,
        recommendation,
        loading: false,
        chartsLoaded: true
      }, () => {
        // 数据加载完成后渲染图表
        if (this.data.activeDimension !== 'basic') {
          this.renderChart();
        }
      });
    }, 1000);
  },

  // 生成营养成分对比数据
  generateNutritionData(fruits) {
    // 定义营养成分维度
    const nutrients = [
      { key: 'calories', name: '热量', unit: 'kcal', max: 100 },
      { key: 'sugar', name: '糖分', unit: 'g', max: 20 },
      { key: 'fiber', name: '膳食纤维', unit: 'g', max: 5 },
      { key: 'vitamin_c', name: '维生素C', unit: 'mg', max: 100 },
      { key: 'potassium', name: '钾', unit: 'mg', max: 2000 }
    ];
    
    // 为每个水果生成营养数据
    const data = {};
    nutrients.forEach(nutrient => {
      data[nutrient.key] = {
        name: nutrient.name,
        unit: nutrient.unit,
        max: nutrient.max,
        values: fruits.map(fruit => {
          // 模拟营养数据
          const value = Math.random() * nutrient.max;
          return {
            fruitId: fruit.id,
            fruitName: fruit.name,
            value: value,
            formatted: `${value.toFixed(1)}${nutrient.unit}`,
            percent: (value / nutrient.max) * 100
          };
        })
      };
    });
    
    return data;
  },

  // 生成价格趋势对比数据
  generatePriceData(fruits) {
    // 生成最近6个月的价格数据
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      months.push(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
    }
    
    // 为每个水果生成价格数据
    const data = fruits.map(fruit => {
      const prices = months.map(month => {
        // 模拟价格数据
        const basePrice = 3 + Math.random() * 10;
        const fluctuation = (Math.random() - 0.5) * 2;
        return {
          month,
          price: parseFloat((basePrice + fluctuation).toFixed(2))
        };
      });
      
      return {
        fruitId: fruit.id,
        fruitName: fruit.name,
        prices
      };
    });
    
    return {
      months,
      data
    };
  },

  // 生成口感特征对比数据
  generateTasteData(fruits) {
    // 定义口感特征维度
    const tasteFeatures = ['甜', '酸', '脆', '软', '多汁', '香', '清爽', '浓郁'];
    
    // 为每个水果生成口感数据
    const data = fruits.map(fruit => {
      const features = tasteFeatures.map(feature => {
        // 模拟评分数据 (1-5分)
        const score = 1 + Math.random() * 4;
        return {
          name: feature,
          score: parseFloat(score.toFixed(1)),
          percent: (score / 5) * 100
        };
      });
      
      return {
        fruitId: fruit.id,
        fruitName: fruit.name,
        features
      };
    });
    
    // 生成标签云数据
    const tagCloudData = [];
    data.forEach(fruit => {
      fruit.features.forEach(feature => {
        tagCloudData.push({
          text: `${fruit.fruitName}-${feature.name}`,
          count: Math.round(feature.score)
        });
      });
    });
    
    return {
      features: tasteFeatures,
      data,
      tagCloudData
    };
  },

  // 生成糖酸度对比数据
  generateSugarData(fruits) {
    // 为每个水果生成糖酸度数据
    const data = fruits.map(fruit => {
      // 模拟糖度和酸度数据
      const brix = 8 + Math.random() * 8; // 8-16°Bx
      const acid = 0.1 + Math.random() * 1.5; // 0.1-1.6g/100g
      
      return {
        fruitId: fruit.id,
        fruitName: fruit.name,
        brix: {
          value: parseFloat(brix.toFixed(1)),
          percent: (brix / 20) * 100 // 最大20°Bx
        },
        acid: {
          value: parseFloat(acid.toFixed(2)),
          percent: (acid / 2) * 100 // 最大2g/100g
        }
      };
    });
    
    return data;
  },

  // 生成智能推荐
  generateRecommendation(fruits) {
    const app = getApp();
    const healthData = app.globalData.healthData;
    
    // 简单的推荐算法
    let bestFruit = null;
    let bestScore = -1;
    
    fruits.forEach(fruit => {
      let score = 0;
      
      // 根据健康数据评分
      if (healthData.conditions && healthData.conditions.includes('糖尿病')) {
        // 糖尿病患者优先低糖水果
        score += Math.random() * (10 - fruit.sugar || 0);
      }
      
      if (healthData.weightGoal === 'lose') {
        // 减脂者优先低热量水果
        score += Math.random() * (100 - fruit.calories || 0) / 10;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestFruit = fruit;
      }
    });
    
    if (bestFruit) {
      return {
        fruit: bestFruit,
        reason: `根据您的健康档案，推荐选择${bestFruit.name}：综合评分最高，适合您的健康需求。`
      };
    }
    
    return null;
  },

  // 切换对比维度
  switchDimension(e) {
    const dimension = e.currentTarget.dataset.dimension;
    this.setData({
      activeDimension: dimension
    }, () => {
      // 切换维度后渲染对应图表
      if (dimension !== 'basic' && this.data.chartsLoaded) {
        this.renderChart();
      }
    });
  },

  // 渲染图表
  async renderChart() {
    try {
      switch (this.data.activeDimension) {
        case 'nutrition':
          await this.renderRadarChart();
          break;
        case 'price':
          await this.renderLineChart();
          break;
        case 'taste':
          await this.renderTagCloud();
          break;
        case 'sugar':
          await this.renderBarChart();
          break;
      }
    } catch (error) {
      console.error('图表渲染失败:', error);
      util.showToast('图表渲染失败');
    }
  },

  // 渲染雷达图
  async renderRadarChart() {
    if (!this.radarChart || !this.data.nutritionData) return;
    
    await this.radarChart.init();
    
    // 准备雷达图数据
    const labels = ['热量', '糖分', '膳食纤维', '维生素C', '钾'];
    const datasets = this.data.comparisonFruits.map((fruit, index) => {
      return {
        label: fruit.name,
        data: [
          this.data.nutritionData.calories.values[index].percent,
          this.data.nutritionData.sugar.values[index].percent,
          this.data.nutritionData.fiber.values[index].percent,
          this.data.nutritionData.vitamin_c.values[index].percent,
          this.data.nutritionData.potassium.values[index].percent
        ]
      };
    });
    
    const chartData = {
      labels,
      datasets
    };
    
    this.radarChart.drawRadarChart(chartData, {
      title: '营养成分对比（百分比）'
    });
  },

  // 渲染折线图
  async renderLineChart() {
    if (!this.lineChart || !this.data.priceData) return;
    
    await this.lineChart.init();
    
    // 准备折线图数据
    const labels = this.data.priceData.months;
    const datasets = this.data.priceData.data.map(fruit => {
      return {
        label: fruit.fruitName,
        data: fruit.prices.map(p => p.price)
      };
    });
    
    const chartData = {
      labels,
      datasets
    };
    
    this.lineChart.drawLineChart(chartData, {
      title: '价格趋势对比（元/斤）'
    });
  },

  // 渲染标签云
  async renderTagCloud() {
    if (!this.tagCloud || !this.data.tasteData) return;
    
    await this.tagCloud.init();
    
    // 准备标签云数据
    const tags = this.data.tasteData.tagCloudData;
    
    this.tagCloud.drawTagCloud(tags, {
      title: '口感特征对比'
    });
  },

  // 渲染柱状图
  async renderBarChart() {
    if (!this.barChart || !this.data.sugarData) return;
    
    await this.barChart.init();
    
    // 准备柱状图数据
    const labels = this.data.comparisonFruits.map(fruit => fruit.name);
    const datasets = [
      {
        label: '糖度(°Bx)',
        data: this.data.sugarData.map(item => item.brix.value)
      },
      {
        label: '酸度(g/100g)',
        data: this.data.sugarData.map(item => item.acid.value)
      }
    ];
    
    const chartData = {
      labels,
      datasets
    };
    
    this.barChart.drawBarChart(chartData, {
      title: '糖酸度对比'
    });
  },

  // 导出图表
  async exportChart(e) {
    const type = e.currentTarget.dataset.type;
    let chartInstance;
    let tempFilePath;
    
    try {
      switch (type) {
        case 'radar':
          chartInstance = this.radarChart;
          break;
        case 'line':
          chartInstance = this.lineChart;
          break;
        case 'bar':
          chartInstance = this.barChart;
          break;
        case 'tagcloud':
          chartInstance = this.tagCloud;
          break;
        default:
          util.showToast('不支持的图表类型');
          return;
      }
      
      if (!chartInstance) {
        util.showToast('图表未初始化');
        return;
      }
      
      // 保存图表为图片
      tempFilePath = await chartInstance.saveChart();
      
      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          util.showToast('已保存到相册', 'success');
        },
        fail: (err) => {
          console.error('保存图片失败:', err);
          util.showToast('保存失败');
        }
      });
    } catch (error) {
      console.error('导出图表失败:', error);
      util.showToast('导出失败');
    }
  },

  // 移除水果
  removeFruit(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '移除水果',
      content: '确定要从对比列表中移除该水果吗？',
      confirmColor: '#10b981',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.removeFromComparison(id);
          
          // 更新页面数据
          const newFruits = this.data.comparisonFruits.filter(fruit => fruit.id != id);
          this.setData({
            comparisonFruits: newFruits
          });
          
          util.showToast('已移除', 'success');
        }
      }
    });
  },

  // 添加更多水果
  addMoreFruits() {
    if (this.data.comparisonFruits.length >= this.data.maxFruits) {
      util.showToast(`最多可对比${this.data.maxFruits}种水果`);
      return;
    }
    
    // 跳转到水果选择页面
    wx.navigateTo({
      url: '/pages/fruit-select/fruit-select'
    });
  },
  
  // 查看水果详情
  viewFruitDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/fruit-detail/fruit-detail?id=' + id
    });
  },
  
  // 清空对比列表
  clearComparison() {
    if (this.data.comparisonFruits.length === 0) {
      return;
    }
    
    wx.showModal({
      title: '清空对比',
      content: '确定要清空所有对比水果吗？',
      confirmColor: '#10b981',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.clearComparisonList();
          
          // 更新页面数据
          this.setData({
            comparisonFruits: [],
            nutritionData: null,
            priceData: null,
            tasteData: null,
            sugarData: null,
            recommendation: null
          });
          
          util.showToast('已清空', 'success');
        }
      }
    });
  }
});