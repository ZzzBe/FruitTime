// pages/mixins/chart.js
// 图表相关混入

const { ChartRenderer, TagCloud } = require('../../utils/chart/chart.js');
const { showToast } = require('../../utils/index.js');

const chartMixin = {
  // 数据
  data: {
    // 图表实例
    chartInstances: {},
    // 图表加载状态
    chartLoading: false
  },

  // 方法
  // 初始化图表
  async initChart(canvasId, chartType = 'chart') {
    try {
      let chartInstance;

      switch (chartType) {
      case 'radar':
      case 'line':
      case 'bar':
        chartInstance = new ChartRenderer(canvasId);
        break;
      case 'tagcloud':
        chartInstance = new TagCloud(canvasId);
        break;
      default:
        chartInstance = new ChartRenderer(canvasId);
      }

      await chartInstance.init();

      // 保存图表实例
      this.data.chartInstances[canvasId] = chartInstance;

      return chartInstance;
    } catch (error) {
      console.error('初始化图表失败:', error);
      showToast('图表初始化失败');
      return null;
    }
  },

  // 获取图表实例
  getChartInstance(canvasId) {
    return this.data.chartInstances[canvasId];
  },

  // 渲染雷达图
  async renderRadarChart(canvasId, data, options = {}) {
    try {
      const chart = this.data.chartInstances[canvasId] || await this.initChart(canvasId, 'radar');
      if (chart) {
        chart.drawRadarChart(data, options);
      }
    } catch (error) {
      console.error('渲染雷达图失败:', error);
      showToast('渲染雷达图失败');
    }
  },

  // 渲染折线图
  async renderLineChart(canvasId, data, options = {}) {
    try {
      const chart = this.data.chartInstances[canvasId] || await this.initChart(canvasId, 'line');
      if (chart) {
        chart.drawLineChart(data, options);
      }
    } catch (error) {
      console.error('渲染折线图失败:', error);
      showToast('渲染折线图失败');
    }
  },

  // 渲染柱状图
  async renderBarChart(canvasId, data, options = {}) {
    try {
      const chart = this.data.chartInstances[canvasId] || await this.initChart(canvasId, 'bar');
      if (chart) {
        chart.drawBarChart(data, options);
      }
    } catch (error) {
      console.error('渲染柱状图失败:', error);
      showToast('渲染柱状图失败');
    }
  },

  // 渲染标签云
  async renderTagCloud(canvasId, data, options = {}) {
    try {
      const chart = this.data.chartInstances[canvasId] || await this.initChart(canvasId, 'tagcloud');
      if (chart) {
        chart.drawTagCloud(data, options);
      }
    } catch (error) {
      console.error('渲染标签云失败:', error);
      showToast('渲染标签云失败');
    }
  },

  // 导出图表
  async exportChart(canvasId) {
    try {
      const chart = this.data.chartInstances[canvasId];
      if (!chart) {
        showToast('图表未初始化');
        return;
      }

      const tempFilePath = await chart.saveChart();

      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          showToast('已保存到相册', 'success');
        },
        fail: (err) => {
          console.error('保存图片失败:', err);
          showToast('保存失败');
        }
      });
    } catch (error) {
      console.error('导出图表失败:', error);
      showToast('导出失败');
    }
  },

  // 清空所有图表
  clearAllCharts() {
    Object.values(this.data.chartInstances).forEach(chart => {
      if (chart && typeof chart.clear === 'function') {
        chart.clear();
      }
    });
  }
};

module.exports = chartMixin;
