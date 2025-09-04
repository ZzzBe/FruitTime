// utils/ui/color.js
// 颜色相关工具函数

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 生成颜色渐变
function generateGradientColors(startColor, endColor, steps) {
  // 解析十六进制颜色
  function parseColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  
  // 将RGB转换为十六进制
  function toHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  const start = parseColor(startColor);
  const end = parseColor(endColor);
  
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(start[0] + ratio * (end[0] - start[0]));
    const g = Math.round(start[1] + ratio * (end[1] - start[1]));
    const b = Math.round(start[2] + ratio * (end[2] - start[2]));
    colors.push(toHex(r, g, b));
  }
  
  return colors;
}

module.exports = {
  getRandomColor,
  generateGradientColors
};