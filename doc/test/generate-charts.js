// doc/test/generate-charts.js
// 果识通小程序图表生成脚本

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { testFruits, nutritionData, priceData, tasteData, sugarAcidData } = require('./sample-data.js');

// 创建输出目录
const outputDir = path.join(__dirname, 'charts');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 图表生成类
class NodeChartRenderer {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  // 清空画布
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // 绘制雷达图
  drawRadarChart(data, options = {}) {
    this.clear();
    
    const {
      title = '雷达图',
      padding = 60,
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    } = options;
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - padding;
    
    // 绘制标题
    this.ctx.font = '20px sans-serif';
    this.ctx.fillStyle = '#182135';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, centerX, padding / 2);
    
    // 获取最大值
    const maxValue = Math.max(...data.datasets.map(dataset => 
      Math.max(...dataset.data)
    ));
    
    // 绘制网格
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;
    
    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // 绘制轴线
    const labelCount = data.labels.length;
    for (let i = 0; i < labelCount; i++) {
      const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      
      // 绘制标签
      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#667085';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(data.labels[i], labelX, labelY);
    }
    
    // 绘制数据
    data.datasets.forEach((dataset, index) => {
      const color = colors[index % colors.length];
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = `${color}33`; // 20% 透明度
      
      for (let i = 0; i < labelCount; i++) {
        const value = dataset.data[i];
        const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();
      
      // 绘制数据点
      this.ctx.fillStyle = color;
      for (let i = 0; i < labelCount; i++) {
        const value = dataset.data[i];
        const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = this.height - padding;
      let legendX = padding;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.ctx.fillStyle = color;
        this.ctx.fillRect(legendX, legendY - 8, 16, 16);
        
        // 绘制标签
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#667085';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(dataset.label, legendX + 22, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.ctx.measureText(dataset.label).width;
        legendX += 22 + textWidth + 25;
      });
    }
  }

  // 绘制折线图
  drawLineChart(data, options = {}) {
    this.clear();
    
    const {
      title = '折线图',
      padding = { top: 60, right: 40, bottom: 100, left: 80 },
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    } = options;
    
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;
    
    // 绘制标题
    this.ctx.font = '20px sans-serif';
    this.ctx.fillStyle = '#182135';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, this.width / 2, padding.top / 2);
    
    // 获取最大值和最小值
    let maxValue = -Infinity;
    let minValue = Infinity;
    
    data.datasets.forEach(dataset => {
      maxValue = Math.max(maxValue, ...dataset.data);
      minValue = Math.min(minValue, ...dataset.data);
    });
    
    // 添加一些边距
    const range = maxValue - minValue;
    maxValue += range * 0.1;
    minValue -= range * 0.1;
    
    // 绘制坐标轴
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;
    
    // Y轴
    this.ctx.beginPath();
    this.ctx.moveTo(padding.left, padding.top);
    this.ctx.lineTo(padding.left, padding.top + chartHeight);
    this.ctx.stroke();
    
    // X轴
    this.ctx.beginPath();
    this.ctx.moveTo(padding.left, padding.top + chartHeight);
    this.ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    this.ctx.stroke();
    
    // 绘制Y轴刻度和标签
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const y = padding.top + chartHeight - (i / yTickCount) * chartHeight;
      
      // 刻度线
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left - 5, y);
      this.ctx.lineTo(padding.left, y);
      this.ctx.stroke();
      
      // 标签
      const value = minValue + (maxValue - minValue) * (i / yTickCount);
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#667085';
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(value.toFixed(1), padding.left - 10, y);
    }
    
    // 绘制X轴标签
    const labelCount = data.labels.length;
    for (let i = 0; i < labelCount; i++) {
      const x = padding.left + (i / (labelCount - 1)) * chartWidth;
      
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#667085';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(data.labels[i], x, padding.top + chartHeight + 10);
      
      // 绘制网格线
      this.ctx.strokeStyle = '#f3f4f6';
      this.ctx.beginPath();
      this.ctx.moveTo(x, padding.top);
      this.ctx.lineTo(x, padding.top + chartHeight);
      this.ctx.stroke();
    }
    
    // 绘制数据线
    data.datasets.forEach((dataset, index) => {
      const color = colors[index % colors.length];
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3;
      
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding.left + (i / (labelCount - 1)) * chartWidth;
        const y = padding.top + chartHeight - 
                  ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.stroke();
      
      // 绘制数据点
      this.ctx.fillStyle = color;
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding.left + (i / (labelCount - 1)) * chartWidth;
        const y = padding.top + chartHeight - 
                  ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = padding.top + chartHeight + 70;
      let legendX = padding.left;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.ctx.fillStyle = color;
        this.ctx.fillRect(legendX, legendY - 8, 16, 16);
        
        // 绘制标签
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#667085';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(dataset.label, legendX + 22, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.ctx.measureText(dataset.label).width;
        legendX += 22 + textWidth + 25;
      });
    }
  }

  // 绘制柱状图
  drawBarChart(data, options = {}) {
    this.clear();
    
    const {
      title = '柱状图',
      padding = { top: 60, right: 40, bottom: 100, left: 80 },
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    } = options;
    
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;
    
    // 绘制标题
    this.ctx.font = '20px sans-serif';
    this.ctx.fillStyle = '#182135';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, this.width / 2, padding.top / 2);
    
    // 获取最大值
    let maxValue = 0;
    data.datasets.forEach(dataset => {
      maxValue = Math.max(maxValue, ...dataset.data);
    });
    
    // 添加一些边距
    maxValue *= 1.1;
    
    // 绘制坐标轴
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;
    
    // Y轴
    this.ctx.beginPath();
    this.ctx.moveTo(padding.left, padding.top);
    this.ctx.lineTo(padding.left, padding.top + chartHeight);
    this.ctx.stroke();
    
    // X轴
    this.ctx.beginPath();
    this.ctx.moveTo(padding.left, padding.top + chartHeight);
    this.ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    this.ctx.stroke();
    
    // 绘制Y轴刻度和标签
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const y = padding.top + chartHeight - (i / yTickCount) * chartHeight;
      
      // 刻度线
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left - 5, y);
      this.ctx.lineTo(padding.left, y);
      this.ctx.stroke();
      
      // 标签
      const value = (maxValue * i) / yTickCount;
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#667085';
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(value.toFixed(1), padding.left - 10, y);
    }
    
    // 绘制柱状图
    const labelCount = data.labels.length;
    const groupWidth = chartWidth / labelCount;
    const barWidth = (groupWidth * 0.8) / data.datasets.length;
    
    data.datasets.forEach((dataset, datasetIndex) => {
      const color = colors[datasetIndex % colors.length];
      
      this.ctx.fillStyle = color;
      
      for (let i = 0; i < dataset.data.length; i++) {
        const value = dataset.data[i];
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding.left + i * groupWidth + 
                  (groupWidth - barWidth * data.datasets.length) / 2 + 
                  datasetIndex * barWidth;
        const y = padding.top + chartHeight - barHeight;
        
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // 绘制数值标签
        if (barHeight > 15) {
          this.ctx.font = '12px sans-serif';
          this.ctx.fillStyle = 'white';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(value.toFixed(1), x + barWidth / 2, y + barHeight / 2);
        }
      }
    });
    
    // 绘制X轴标签
    for (let i = 0; i < labelCount; i++) {
      const x = padding.left + i * groupWidth + groupWidth / 2;
      
      this.ctx.font = '14px sans-serif';
      this.ctx.fillStyle = '#667085';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(data.labels[i], x, padding.top + chartHeight + 10);
    }
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = padding.top + chartHeight + 70;
      let legendX = padding.left;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.ctx.fillStyle = color;
        this.ctx.fillRect(legendX, legendY - 8, 16, 16);
        
        // 绘制标签
        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#667085';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(dataset.label, legendX + 22, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.ctx.measureText(dataset.label).width;
        legendX += 22 + textWidth + 25;
      });
    }
  }

  // 保存图表为图片
  saveChart(filename) {
    const buffer = this.canvas.toBuffer('image/png');
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`图表已保存: ${filePath}`);
  }
}

// 标签云生成器
class NodeTagCloud {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  // 清空画布
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // 绘制标签云
  drawTagCloud(tags, options = {}) {
    this.clear();
    
    const {
      title = '标签云',
      padding = 60,
      fontSizeRange = [14, 40],
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#f97316']
    } = options;
    
    // 绘制标题
    this.ctx.font = '20px sans-serif';
    this.ctx.fillStyle = '#182135';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, this.width / 2, padding / 2);
    
    // 计算标签权重范围
    const minCount = Math.min(...tags.map(tag => tag.count));
    const maxCount = Math.max(...tags.map(tag => tag.count));
    const countRange = maxCount - minCount || 1;
    
    // 计算字体大小范围
    const [minFontSize, maxFontSize] = fontSizeRange;
    const fontSizeRangeSize = maxFontSize - minFontSize;
    
    // 设置绘图区域
    const drawWidth = this.width - padding * 2;
    const drawHeight = this.height - padding * 2;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // 存储已绘制的标签位置，避免重叠
    const placedTags = [];
    
    // 绘制每个标签
    tags.forEach((tag, index) => {
      // 计算字体大小
      const fontSize = minFontSize + ((tag.count - minCount) / countRange) * fontSizeRangeSize;
      
      // 选择颜色
      const color = colors[index % colors.length];
      
      // 设置样式
      this.ctx.font = `${fontSize}px sans-serif`;
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'top';
      
      // 测量文本尺寸
      const metrics = this.ctx.measureText(tag.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      
      // 尝试找到不重叠的位置
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        // 随机位置
        const x = padding + Math.random() * (drawWidth - textWidth);
        const y = padding + Math.random() * (drawHeight - textHeight);
        
        // 检查是否与已绘制的标签重叠
        let overlap = false;
        for (const placedTag of placedTags) {
          if (
            x < placedTag.x + placedTag.width &&
            x + textWidth > placedTag.x &&
            y < placedTag.y + placedTag.height &&
            y + textHeight > placedTag.y
          ) {
            overlap = true;
            break;
          }
        }
        
        // 如果不重叠，则绘制标签
        if (!overlap) {
          this.ctx.fillText(tag.text, x, y);
          
          // 记录已绘制的标签位置
          placedTags.push({
            x,
            y,
            width: textWidth,
            height: textHeight
          });
          
          placed = true;
        }
        
        attempts++;
      }
      
      // 如果无法找到合适位置，就绘制在中心附近
      if (!placed) {
        const angle = (index / tags.length) * Math.PI * 2;
        const radius = Math.min(drawWidth, drawHeight) / 4;
        const x = centerX + Math.cos(angle) * radius - textWidth / 2;
        const y = centerY + Math.sin(angle) * radius - textHeight / 2;
        
        this.ctx.fillText(tag.text, x, y);
      }
    });
  }

  // 保存标签云为图片
  saveTagCloud(filename) {
    const buffer = this.canvas.toBuffer('image/png');
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`标签云已保存: ${filePath}`);
  }
}

// 生成所有图表
async function generateAllCharts() {
  console.log('开始生成图表...');
  
  try {
    // 1. 生成雷达图
    console.log('1. 生成雷达图...');
    const radarRenderer = new NodeChartRenderer(800, 600);
    radarRenderer.drawRadarChart(nutritionData, {
      title: '营养成分对比（每100g含量）'
    });
    radarRenderer.saveChart('nutrition-radar-chart.png');
    
    // 2. 生成折线图
    console.log('2. 生成折线图...');
    const lineRenderer = new NodeChartRenderer(800, 600);
    lineRenderer.drawLineChart(priceData, {
      title: '价格趋势对比（元/斤）'
    });
    lineRenderer.saveChart('price-line-chart.png');
    
    // 3. 生成柱状图
    console.log('3. 生成柱状图...');
    
    // 准备糖酸度柱状图数据
    const sugarAcidBarData = {
      labels: sugarAcidData.map(item => item.fruitName),
      datasets: [
        {
          label: '糖度(°Bx)',
          data: sugarAcidData.map(item => item.brix.value)
        },
        {
          label: '酸度(g/100g)',
          data: sugarAcidData.map(item => item.acid.value)
        }
      ]
    };
    
    const barRenderer = new NodeChartRenderer(800, 600);
    barRenderer.drawBarChart(sugarAcidBarData, {
      title: '糖酸度对比'
    });
    barRenderer.saveChart('sugar-acid-bar-chart.png');
    
    // 4. 生成标签云
    console.log('4. 生成标签云...');
    const tagCloudRenderer = new NodeTagCloud(800, 600);
    tagCloudRenderer.drawTagCloud(tasteData.tagCloudData, {
      title: '口感特征对比（词频）'
    });
    tagCloudRenderer.saveTagCloud('taste-tag-cloud.png');
    
    console.log('所有图表生成完成！');
  } catch (error) {
    console.error('生成图表时出错:', error);
  }
}

// 运行图表生成
generateAllCharts();