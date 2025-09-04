// test/chart-test.js
// 图表功能测试脚本

// 模拟微信小程序的API
const mockWx = {
  getSystemInfoSync: () => ({
    pixelRatio: 2
  }),
  createSelectorQuery: () => {
    return {
      select: () => {
        return {
          fields: () => {
            return {
              exec: (callback) => {
                // 模拟获取到canvas节点
                callback([{
                  node: {
                    width: 300,
                    height: 300,
                    getContext: () => {
                      return {
                        scale: () => {},
                        clearRect: () => {},
                        beginPath: () => {},
                        moveTo: () => {},
                        lineTo: () => {},
                        closePath: () => {},
                        stroke: () => {},
                        fill: () => {},
                        arc: () => {},
                        fillText: () => {},
                        measureText: () => ({ width: 50 }),
                        fillRect: () => {}
                      };
                    }
                  },
                  width: 300,
                  height: 300
                }]);
              }
            };
          }
        };
      }
    };
  },
  canvasToTempFilePath: (options) => {
    // 模拟保存图片成功
    setTimeout(() => {
      options.success && options.success({ tempFilePath: '/temp/chart.png' });
    }, 100);
  },
  saveImageToPhotosAlbum: (options) => {
    // 模拟保存到相册成功
    setTimeout(() => {
      options.success && options.success();
    }, 100);
  },
  showToast: (options) => {
    console.log('显示提示:', options.title);
  }
};

// 临时替换全局wx对象
const originalWx = global.wx;
global.wx = mockWx;

// 导入图表工具
const { ChartRenderer, TagCloud } = require('../utils/chart/chart.js');

async function runChartTests() {
  console.log('开始图表功能测试...\n');
  
  try {
    // 测试雷达图
    console.log('1. 测试雷达图渲染...');
    const radarChart = new ChartRenderer('radarChart');
    await radarChart.init();
    
    const radarData = {
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
    
    radarChart.drawRadarChart(radarData);
    console.log('   雷达图渲染完成\n');
    
    // 测试折线图
    console.log('2. 测试折线图渲染...');
    const lineChart = new ChartRenderer('lineChart');
    await lineChart.init();
    
    const lineData = {
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
    
    lineChart.drawLineChart(lineData);
    console.log('   折线图渲染完成\n');
    
    // 测试柱状图
    console.log('3. 测试柱状图渲染...');
    const barChart = new ChartRenderer('barChart');
    await barChart.init();
    
    const barData = {
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
    
    barChart.drawBarChart(barData);
    console.log('   柱状图渲染完成\n');
    
    // 测试标签云
    console.log('4. 测试标签云渲染...');
    const tagCloud = new TagCloud('tagCloud');
    await tagCloud.init();
    
    const tags = [
      { text: '苹果-甜', count: 8 },
      { text: '苹果-脆', count: 7 },
      { text: '苹果-香', count: 6 },
      { text: '香蕉-甜', count: 9 },
      { text: '香蕉-软', count: 8 },
      { text: '香蕉-香', count: 7 }
    ];
    
    tagCloud.drawTagCloud(tags);
    console.log('   标签云渲染完成\n');
    
    // 测试导出功能
    console.log('5. 测试图表导出...');
    const tempFilePath = await radarChart.saveChart();
    console.log('   图表已导出到:', tempFilePath);
    
    console.log('\n所有图表功能测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 恢复原始wx对象
    global.wx = originalWx;
  }
}

// 运行测试
runChartTests();