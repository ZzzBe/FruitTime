// utils/index.js
// 工具函数统一入口

// 网络相关
const request = require('./network/request.js');
const api = require('./network/api.js');

// UI相关
const uiUtil = require('./ui/util.js');
const format = require('./ui/format.js');
const performance = require('./ui/performance.js');
const color = require('./ui/color.js');
const errorHandler = require('./ui/errorHandler.js');

// 存储相关
const storage = require('./storage/storage.js');

// 验证相关
const validation = require('./validation/validation.js');

// 设备相关
const device = require('./device/device.js');

// 图表相关
const chart = require('./chart/chart.js');

// 数据管理相关
const DataManager = require('./data/DataManager.js');

module.exports = {
  // 网络请求
  request: request.request,
  uploadFile: request.uploadFile,
  clearCache: request.clearCache,
  cleanExpiredCache: request.cleanExpiredCache,
  
  // API接口
  api,
  
  // UI工具
  ...uiUtil,
  ...format,
  ...performance,
  ...color,
  ...errorHandler,
  
  // 存储工具
  ...storage,
  
  // 验证工具
  ...validation,
  
  // 设备工具
  ...device,
  
  // 图表工具
  ...chart,
  
  // 数据管理工具
  DataManager
};