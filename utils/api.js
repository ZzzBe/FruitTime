// utils/api.js

// 模拟API基础URL
const BASE_URL = 'https://api.fruitwise.com';

// 简单的内存缓存
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 缓存工具函数
function getCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// 模拟请求函数
function request(options) {
  return new Promise((resolve, reject) => {
    // 检查缓存
    if (options.cacheKey) {
      const cachedData = getCache(options.cacheKey);
      if (cachedData) {
        console.log('返回缓存数据:', options.cacheKey);
        resolve(cachedData);
        return;
      }
    }
    
    // 显示加载提示
    if (options.showLoading !== false) {
      wx.showLoading({
        title: options.loadingTitle || '加载中...',
        mask: true
      });
    }
    
    // 模拟网络请求延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟请求成功或失败
      if (Math.random() > 0.1) { // 90%成功率
        const result = {
          code: 200,
          data: options.mockData || {},
          message: 'success'
        };
        
        // 缓存结果
        if (options.cacheKey) {
          setCache(options.cacheKey, result);
        }
        
        resolve(result);
      } else {
        reject({
          code: 500,
          message: '网络请求失败'
        });
      }
    }, options.delay || 1000);
  });
}

// 获取水果详情
function getFruitDetail(id) {
  return request({
    url: `${BASE_URL}/fruit/${id}`,
    method: 'GET',
    cacheKey: `fruit_${id}`,
    mockData: {
      id: id,
      name: '麒麟西瓜',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      description: '甜度13° | 当季水果',
      price: '3.99',
      unit: '/斤',
      sweetness: 13,
      waterContent: 92,
      calories: 30,
      nutritionInfo: {
        vitaminC: { name: '维生素C', value: '8.1mg', percent: 65 },
        fiber: { name: '膳食纤维', value: '0.4g', percent: 40 },
        potassium: { name: '钾', value: '112mg', percent: 75 }
      }
    }
  });
}

// 获取推荐水果列表
function getRecommendations(healthData) {
  return request({
    url: `${BASE_URL}/recommend`,
    method: 'POST',
    data: healthData,
    mockData: [
      {
        rank: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=80&h=80&fit=crop',
        rating: 4.8,
        description: '减脂期首选，低热量高水分',
        price: '3.99/斤'
      },
      {
        rank: 2,
        name: '红颜草莓',
        image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=80&h=80&fit=crop',
        rating: 4.7,
        description: '维C丰富，抗氧化',
        price: '15.8/盒'
      }
    ]
  });
}

// 搜索水果
function searchFruits(keyword) {
  return request({
    url: `${BASE_URL}/search`,
    method: 'GET',
    data: { keyword },
    cacheKey: `search_${keyword}`,
    mockData: [
      {
        id: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=60&h=60&fit=crop',
        description: '甜度13° | 当季水果',
        price: '3.99/斤'
      }
    ]
  });
}

// 获取识别历史
function getIdentifyHistory() {
  return request({
    url: `${BASE_URL}/history`,
    method: 'GET',
    cacheKey: 'identify_history',
    mockData: [
      {
        id: 1,
        name: '麒麟西瓜',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=60&h=60&fit=crop',
        time: '2分钟前',
        sweetness: 13
      }
    ]
  });
}

// 清除缓存
function clearCache() {
  cache.clear();
}

module.exports = {
  getFruitDetail,
  getRecommendations,
  searchFruits,
  getIdentifyHistory,
  clearCache
};