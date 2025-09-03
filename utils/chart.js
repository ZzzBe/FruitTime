// utils/chart.js
// 图表绘制工具类

class ChartRenderer {
  constructor(canvasId, context) {
    this.canvasId = canvasId;
    this.context = context;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
  }

  // 初始化画布
  async init() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(`#${this.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res[0] && res[0].node) {
            this.canvas = res[0].node;
            this.width = res[0].width;
            this.height = res[0].height;
            
            // 设置画布大小
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            
            // 设置上下文
            this.context = this.canvas.getContext('2d');
            this.context.scale(dpr, dpr);
            
            resolve();
          } else {
            reject(new Error('无法获取画布节点'));
          }
        });
    });
  }

  // 清空画布
  clear() {
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  // 绘制雷达图
  drawRadarChart(data, options = {}) {
    if (!this.context || !this.canvas) return;
    
    this.clear();
    
    const {
      title = '雷达图',
      width = this.width,
      height = this.height,
      padding = 40,
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
      fontSize = 12
    } = options;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;
    
    // 绘制标题
    this.context.font = `${fontSize + 2}px sans-serif`;
    this.context.fillStyle = '#182135';
    this.context.textAlign = 'center';
    this.context.fillText(title, centerX, padding / 2);
    
    // 获取最大值
    const maxValue = Math.max(...data.datasets.map(dataset => 
      Math.max(...dataset.data)
    ));
    
    // 绘制网格
    this.context.strokeStyle = '#e5e7eb';
    this.context.lineWidth = 1;
    
    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      this.context.beginPath();
      this.context.arc(centerX, centerY, r, 0, Math.PI * 2);
      this.context.stroke();
    }
    
    // 绘制轴线
    const labelCount = data.labels.length;
    for (let i = 0; i < labelCount; i++) {
      const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      this.context.beginPath();
      this.context.moveTo(centerX, centerY);
      this.context.lineTo(x, y);
      this.context.stroke();
      
      // 绘制标签
      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      
      this.context.font = `${fontSize}px sans-serif`;
      this.context.fillStyle = '#667085';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(data.labels[i], labelX, labelY);
    }
    
    // 绘制数据
    data.datasets.forEach((dataset, index) => {
      const color = colors[index % colors.length];
      
      this.context.beginPath();
      this.context.strokeStyle = color;
      this.context.lineWidth = 2;
      this.context.fillStyle = `${color}33`; // 20% 透明度
      
      for (let i = 0; i < labelCount; i++) {
        const value = dataset.data[i];
        const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          this.context.moveTo(x, y);
        } else {
          this.context.lineTo(x, y);
        }
      }
      
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
      
      // 绘制数据点
      this.context.fillStyle = color;
      for (let i = 0; i < labelCount; i++) {
        const value = dataset.data[i];
        const angle = (Math.PI * 2 * i) / labelCount - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        this.context.beginPath();
        this.context.arc(x, y, 4, 0, Math.PI * 2);
        this.context.fill();
      }
    });
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = height - padding;
      let legendX = padding;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.context.fillStyle = color;
        this.context.fillRect(legendX, legendY - 6, 12, 12);
        
        // 绘制标签
        this.context.font = `${fontSize}px sans-serif`;
        this.context.fillStyle = '#667085';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        this.context.fillText(dataset.label, legendX + 18, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.context.measureText(dataset.label).width;
        legendX += 18 + textWidth + 20;
      });
    }
  }

  // 绘制折线图
  drawLineChart(data, options = {}) {
    if (!this.context || !this.canvas) return;
    
    this.clear();
    
    const {
      title = '折线图',
      width = this.width,
      height = this.height,
      padding = { top: 40, right: 20, bottom: 60, left: 50 },
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
      fontSize = 12
    } = options;
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 绘制标题
    this.context.font = `${fontSize + 2}px sans-serif`;
    this.context.fillStyle = '#182135';
    this.context.textAlign = 'center';
    this.context.fillText(title, width / 2, padding.top / 2);
    
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
    this.context.strokeStyle = '#e5e7eb';
    this.context.lineWidth = 1;
    
    // Y轴
    this.context.beginPath();
    this.context.moveTo(padding.left, padding.top);
    this.context.lineTo(padding.left, padding.top + chartHeight);
    this.context.stroke();
    
    // X轴
    this.context.beginPath();
    this.context.moveTo(padding.left, padding.top + chartHeight);
    this.context.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    this.context.stroke();
    
    // 绘制Y轴刻度和标签
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const y = padding.top + chartHeight - (i / yTickCount) * chartHeight;
      
      // 刻度线
      this.context.beginPath();
      this.context.moveTo(padding.left - 5, y);
      this.context.lineTo(padding.left, y);
      this.context.stroke();
      
      // 标签
      const value = minValue + (maxValue - minValue) * (i / yTickCount);
      this.context.font = `${fontSize}px sans-serif`;
      this.context.fillStyle = '#667085';
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText(value.toFixed(1), padding.left - 10, y);
    }
    
    // 绘制X轴标签
    const labelCount = data.labels.length;
    for (let i = 0; i < labelCount; i++) {
      const x = padding.left + (i / (labelCount - 1)) * chartWidth;
      
      this.context.font = `${fontSize}px sans-serif`;
      this.context.fillStyle = '#667085';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'top';
      this.context.fillText(data.labels[i], x, padding.top + chartHeight + 10);
    }
    
    // 绘制数据线
    data.datasets.forEach((dataset, index) => {
      const color = colors[index % colors.length];
      
      this.context.beginPath();
      this.context.strokeStyle = color;
      this.context.lineWidth = 2;
      
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding.left + (i / (labelCount - 1)) * chartWidth;
        const y = padding.top + chartHeight - 
                  ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
        
        if (i === 0) {
          this.context.moveTo(x, y);
        } else {
          this.context.lineTo(x, y);
        }
      }
      
      this.context.stroke();
      
      // 绘制数据点
      this.context.fillStyle = color;
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding.left + (i / (labelCount - 1)) * chartWidth;
        const y = padding.top + chartHeight - 
                  ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
        
        this.context.beginPath();
        this.context.arc(x, y, 4, 0, Math.PI * 2);
        this.context.fill();
      }
    });
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = padding.top + chartHeight + 50;
      let legendX = padding.left;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.context.fillStyle = color;
        this.context.fillRect(legendX, legendY - 6, 12, 12);
        
        // 绘制标签
        this.context.font = `${fontSize}px sans-serif`;
        this.context.fillStyle = '#667085';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        this.context.fillText(dataset.label, legendX + 18, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.context.measureText(dataset.label).width;
        legendX += 18 + textWidth + 20;
      });
    }
  }

  // 绘制柱状图
  drawBarChart(data, options = {}) {
    if (!this.context || !this.canvas) return;
    
    this.clear();
    
    const {
      title = '柱状图',
      width = this.width,
      height = this.height,
      padding = { top: 40, right: 20, bottom: 60, left: 50 },
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
      fontSize = 12
    } = options;
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 绘制标题
    this.context.font = `${fontSize + 2}px sans-serif`;
    this.context.fillStyle = '#182135';
    this.context.textAlign = 'center';
    this.context.fillText(title, width / 2, padding.top / 2);
    
    // 获取最大值
    let maxValue = 0;
    data.datasets.forEach(dataset => {
      maxValue = Math.max(maxValue, ...dataset.data);
    });
    
    // 添加一些边距
    maxValue *= 1.1;
    
    // 绘制坐标轴
    this.context.strokeStyle = '#e5e7eb';
    this.context.lineWidth = 1;
    
    // Y轴
    this.context.beginPath();
    this.context.moveTo(padding.left, padding.top);
    this.context.lineTo(padding.left, padding.top + chartHeight);
    this.context.stroke();
    
    // X轴
    this.context.beginPath();
    this.context.moveTo(padding.left, padding.top + chartHeight);
    this.context.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    this.context.stroke();
    
    // 绘制Y轴刻度和标签
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const y = padding.top + chartHeight - (i / yTickCount) * chartHeight;
      
      // 刻度线
      this.context.beginPath();
      this.context.moveTo(padding.left - 5, y);
      this.context.lineTo(padding.left, y);
      this.context.stroke();
      
      // 标签
      const value = (maxValue * i) / yTickCount;
      this.context.font = `${fontSize}px sans-serif`;
      this.context.fillStyle = '#667085';
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillText(value.toFixed(1), padding.left - 10, y);
    }
    
    // 绘制柱状图
    const labelCount = data.labels.length;
    const groupWidth = chartWidth / labelCount;
    const barWidth = (groupWidth * 0.8) / data.datasets.length;
    
    data.datasets.forEach((dataset, datasetIndex) => {
      const color = colors[datasetIndex % colors.length];
      
      this.context.fillStyle = color;
      
      for (let i = 0; i < dataset.data.length; i++) {
        const value = dataset.data[i];
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding.left + i * groupWidth + 
                  (groupWidth - barWidth * data.datasets.length) / 2 + 
                  datasetIndex * barWidth;
        const y = padding.top + chartHeight - barHeight;
        
        this.context.fillRect(x, y, barWidth, barHeight);
        
        // 绘制数值标签
        if (barHeight > 10) {
          this.context.font = `${fontSize - 2}px sans-serif`;
          this.context.fillStyle = 'white';
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillText(value.toFixed(1), x + barWidth / 2, y + barHeight / 2);
        }
      }
    });
    
    // 绘制X轴标签
    for (let i = 0; i < labelCount; i++) {
      const x = padding.left + i * groupWidth + groupWidth / 2;
      
      this.context.font = `${fontSize}px sans-serif`;
      this.context.fillStyle = '#667085';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'top';
      this.context.fillText(data.labels[i], x, padding.top + chartHeight + 10);
    }
    
    // 绘制图例
    if (data.datasets.length > 1) {
      const legendY = padding.top + chartHeight + 50;
      let legendX = padding.left;
      
      data.datasets.forEach((dataset, index) => {
        const color = colors[index % colors.length];
        
        // 绘制颜色块
        this.context.fillStyle = color;
        this.context.fillRect(legendX, legendY - 6, 12, 12);
        
        // 绘制标签
        this.context.font = `${fontSize}px sans-serif`;
        this.context.fillStyle = '#667085';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        this.context.fillText(dataset.label, legendX + 18, legendY);
        
        // 计算下一个图例位置
        const textWidth = this.context.measureText(dataset.label).width;
        legendX += 18 + textWidth + 20;
      });
    }
  }

  // 保存图表为图片
  saveChart() {
    if (!this.canvas) return Promise.reject(new Error('画布未初始化'));
    
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}

// 标签云生成器
class TagCloud {
  constructor(canvasId, context) {
    this.canvasId = canvasId;
    this.context = context;
    this.canvas = null;
    this.width = 0;
    this.height = 0;
  }

  // 初始化画布
  async init() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(`#${this.canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res[0] && res[0].node) {
            this.canvas = res[0].node;
            this.width = res[0].width;
            this.height = res[0].height;
            
            // 设置画布大小
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            
            // 设置上下文
            this.context = this.canvas.getContext('2d');
            this.context.scale(dpr, dpr);
            
            resolve();
          } else {
            reject(new Error('无法获取画布节点'));
          }
        });
    });
  }

  // 清空画布
  clear() {
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  // 绘制标签云
  drawTagCloud(tags, options = {}) {
    if (!this.context || !this.canvas) return;
    
    this.clear();
    
    const {
      title = '标签云',
      width = this.width,
      height = this.height,
      padding = 40,
      fontSizeRange = [12, 32],
      colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#f97316'],
      fontFamily = 'sans-serif'
    } = options;
    
    // 绘制标题
    this.context.font = `16px ${fontFamily}`;
    this.context.fillStyle = '#182135';
    this.context.textAlign = 'center';
    this.context.fillText(title, width / 2, padding / 2);
    
    // 计算标签权重范围
    const minCount = Math.min(...tags.map(tag => tag.count));
    const maxCount = Math.max(...tags.map(tag => tag.count));
    const countRange = maxCount - minCount || 1;
    
    // 计算字体大小范围
    const [minFontSize, maxFontSize] = fontSizeRange;
    const fontSizeRangeSize = maxFontSize - minFontSize;
    
    // 设置绘图区域
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 存储已绘制的标签位置，避免重叠
    const placedTags = [];
    
    // 绘制每个标签
    tags.forEach((tag, index) => {
      // 计算字体大小
      const fontSize = minFontSize + ((tag.count - minCount) / countRange) * fontSizeRangeSize;
      
      // 选择颜色
      const color = colors[index % colors.length];
      
      // 设置样式
      this.context.font = `${fontSize}px ${fontFamily}`;
      this.context.fillStyle = color;
      this.context.textAlign = 'left';
      this.context.textBaseline = 'top';
      
      // 测量文本尺寸
      const metrics = this.context.measureText(tag.text);
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
          this.context.fillText(tag.text, x, y);
          
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
        
        this.context.fillText(tag.text, x, y);
      }
    });
  }

  // 保存标签云为图片
  saveTagCloud() {
    if (!this.canvas) return Promise.reject(new Error('画布未初始化'));
    
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}

module.exports = {
  ChartRenderer,
  TagCloud
};