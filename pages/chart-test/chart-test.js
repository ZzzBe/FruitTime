// pages/chart-test/chart-test.js
const { ChartRenderer, TagCloud } = require('../../utils/chart.js');

Page({
  data: {
    // 页面数据
  },

  onLoad() {
    // 页面加载时执行
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
    
    // 渲染示例图表
    setTimeout(() => {
      this.renderSampleCharts();
    }, 1000);
  },

  // 渲染示例图表
  async renderSampleCharts() {
    // 渲染雷达图
    await this.renderSampleRadarChart();
    
    // 渲染折线图
    await this.renderSampleLineChart();
    
    // 渲染柱状图
    await this.renderSampleBarChart();
    
    // 渲染标签云
    await this.renderSampleTagCloud();
  },

  // 渲染示例雷达图
  async renderSampleRadarChart() {
    if (!this.radarChart) return;
    
    await this.radarChart.init();
    
    const data = {
      labels: ['热量', '糖分', '膳食纤维', '维生素C', '钾'],
      datasets: [
        {
          label: '苹果',
          data: [80, 70, 90, 60, 85]
        },
        {
          label: '香蕉',
          data: [90, 95, 70, 50, 75]
        }
      ]
    };
    
    this.radarChart.drawRadarChart(data, {
      title: '营养成分对比（示例）'
    });
  },

  // 渲染示例折线图
  async renderSampleLineChart() {
    if (!this.lineChart) return;
    
    await this.lineChart.init();
    
    const data = {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '苹果',
          data: [5.2, 4.8, 5.5, 6.1, 5.8, 5.3]
        },
        {
          label: '香蕉',
          data: [3.5, 3.2, 3.8, 4.2, 4.0, 3.7]
        }
      ]
    };
    
    this.lineChart.drawLineChart(data, {
      title: '价格趋势对比（示例）'
    });
  },

  // 渲染示例柱状图
  async renderSampleBarChart() {
    if (!this.barChart) return;
    
    await this.barChart.init();
    
    const data = {
      labels: ['苹果', '香蕉', '橙子', '葡萄'],
      datasets: [
        {
          label: '糖度(°Bx)',
          data: [12.5, 18.2, 10.8, 16.3]
        },
        {
          label: '酸度(g/100g)',
          data: [0.4, 0.2, 0.8, 0.3]
        }
      ]
    };
    
    this.barChart.drawBarChart(data, {
      title: '糖酸度对比（示例）'
    });
  },

  // 渲染示例标签云
  async renderSampleTagCloud() {
    if (!this.tagCloud) return;
    
    await this.tagCloud.init();
    
    const tags = [
      { text: '苹果-甜', count: 8 },
      { text: '苹果-脆', count: 7 },
      { text: '苹果-香', count: 6 },
      { text: '香蕉-甜', count: 9 },
      { text: '香蕉-软', count: 8 },
      { text: '香蕉-香', count: 7 },
      { text: '橙子-酸', count: 9 },
      { text: '橙子-甜', count: 7 },
      { text: '橙子-多汁', count: 8 },
      { text: '葡萄-甜', count: 9 },
      { text: '葡萄-多汁', count: 8 },
      { text: '葡萄-脆', count: 6 }
    ];
    
    this.tagCloud.drawTagCloud(tags, {
      title: '口感特征对比（示例）'
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
          wx.showToast({ title: '不支持的图表类型' });
          return;
      }
      
      if (!chartInstance) {
        wx.showToast({ title: '图表未初始化' });
        return;
      }
      
      // 保存图表为图片
      tempFilePath = await chartInstance.saveChart();
      
      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          wx.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          console.error('保存图片失败:', err);
          wx.showToast({ title: '保存失败' });
        }
      });
    } catch (error) {
      console.error('导出图表失败:', error);
      wx.showToast({ title: '导出失败' });
    }
  }
});