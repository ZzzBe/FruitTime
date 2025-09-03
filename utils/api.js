// utils/api.js

// API基础URL
const BASE_URL = 'https://api.fruitmind.com/v1';

// 缓存管理器
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5分钟默认缓存时间
  }

  // 获取缓存
  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.duration) {
      console.log('返回缓存数据:', key);
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // 设置缓存
  set(key, data, duration = this.CACHE_DURATION) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration
    });
  }

  // 清除特定缓存
  delete(key) {
    this.cache.delete(key);
  }

  // 清除所有缓存
  clear() {
    this.cache.clear();
  }

  // 清除过期缓存
  cleanExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= value.duration) {
        this.cache.delete(key);
      }
    }
  }
}

const cacheManager = new CacheManager();

// 网络请求封装
function request(options) {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      cacheKey,
      cacheDuration,
      showLoading = true,
      loadingTitle = '加载中...',
      timeout = 10000 // 10秒超时
    } = options;

    // 检查缓存
    if (cacheKey) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        resolve(cachedData);
        return;
      }
    }

    // 显示加载提示
    if (showLoading) {
      wx.showLoading({
        title: loadingTitle,
        mask: true
      });
    }

    // 发起网络请求
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout,
      success: (res) => {
        wx.hideLoading();

        // 处理HTTP状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 缓存成功响应
          if (cacheKey) {
            cacheManager.set(cacheKey, res.data, cacheDuration);
          }
          resolve(res.data);
        } else {
          // 处理HTTP错误
          reject({
            code: res.statusCode,
            message: `HTTP错误: ${res.statusCode}`,
            data: res.data
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        
        // 网络错误处理
        const errorMsg = err.errMsg || '网络请求失败';
        console.error('网络请求失败:', errorMsg);
        
        // 根据错误类型提供不同的提示
        let message = '网络请求失败';
        if (errorMsg.includes('timeout')) {
          message = '请求超时，请检查网络连接';
        } else if (errorMsg.includes('fail url')) {
          message = '请求地址错误';
        } else if (errorMsg.includes('abort')) {
          message = '请求被中止';
        }
        
        reject({
          code: -1,
          message: message,
          error: err
        });
      }
    });
  });
}

// 上传文件
function uploadFile(options) {
  return new Promise((resolve, reject) => {
    const {
      url,
      filePath,
      name = 'file',
      formData = {},
      header = {},
      showLoading = true,
      loadingTitle = '上传中...'
    } = options;

    // 显示加载提示
    if (showLoading) {
      wx.showLoading({
        title: loadingTitle,
        mask: true
      });
    }

    // 创建上传任务
    const uploadTask = wx.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        'Content-Type': 'multipart/form-data',
        ...header
      },
      success: (res) => {
        wx.hideLoading();
        
        // 解析响应数据
        let data;
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          data = res.data;
        }

        // 处理HTTP状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject({
            code: res.statusCode,
            message: `上传失败: ${res.statusCode}`,
            data: data
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        
        const errorMsg = err.errMsg || '上传失败';
        console.error('文件上传失败:', errorMsg);
        
        let message = '上传失败';
        if (errorMsg.includes('timeout')) {
          message = '上传超时，请检查网络连接';
        }
        
        reject({
          code: -1,
          message: message,
          error: err
        });
      }
    });

    // 监听上传进度
    if (options.onProgress) {
      uploadTask.onProgressUpdate(options.onProgress);
    }
  });
}

// 获取水果详情
function getFruitDetail(id) {
  return request({
    url: `/fruits/${id}`,
    method: 'GET',
    cacheKey: `fruit_${id}`,
    cacheDuration: 10 * 60 * 1000 // 10分钟缓存
  });
}

// 获取水果详细对比数据
function getFruitComparison(ids) {
  return request({
    url: '/fruits/comparison',
    method: 'POST',
    data: { ids },
    cacheKey: `comparison_${ids.sort().join(',')}`,
    cacheDuration: 5 * 60 * 1000 // 5分钟缓存
  });
}

// 获取推荐水果列表
function getRecommendations(healthData) {
  return request({
    url: '/recommendations',
    method: 'POST',
    data: healthData
  });
}

// 搜索水果
function searchFruits(keyword) {
  if (!keyword) {
    return Promise.resolve({ code: 200, data: [] });
  }
  
  return request({
    url: '/fruits/search',
    method: 'GET',
    data: { keyword },
    cacheKey: `search_${keyword}`,
    cacheDuration: 2 * 60 * 1000 // 2分钟缓存
  });
}

// 获取识别历史
function getIdentifyHistory(userId) {
  return request({
    url: '/identify/history',
    method: 'GET',
    data: { userId },
    cacheKey: `identify_history_${userId}`,
    cacheDuration: 30 * 1000 // 30秒缓存
  });
}

// 上传图片进行识别
function identifyImage(imagePath, type = 'image') {
  return uploadFile({
    url: '/identify',
    filePath: imagePath,
    name: 'image',
    formData: { type }
  });
}

// 获取用户健康数据
function getUserHealthData(userId) {
  return request({
    url: `/users/${userId}/health`,
    method: 'GET',
    cacheKey: `user_health_${userId}`,
    cacheDuration: 30 * 60 * 1000 // 30分钟缓存
  });
}

// 更新用户健康数据
function updateUserHealthData(userId, healthData) {
  // 清除相关缓存
  cacheManager.delete(`user_health_${userId}`);
  
  return request({
    url: `/users/${userId}/health`,
    method: 'PUT',
    data: healthData
  });
}

// 获取用户收藏列表
function getUserFavorites(userId) {
  return request({
    url: `/users/${userId}/favorites`,
    method: 'GET',
    cacheKey: `user_favorites_${userId}`,
    cacheDuration: 5 * 60 * 1000 // 5分钟缓存
  });
}

// 添加到收藏
function addFavorite(userId, fruitId) {
  // 清除相关缓存
  cacheManager.delete(`user_favorites_${userId}`);
  
  return request({
    url: `/users/${userId}/favorites`,
    method: 'POST',
    data: { fruitId }
  });
}

// 从收藏移除
function removeFavorite(userId, fruitId) {
  // 清除相关缓存
  cacheManager.delete(`user_favorites_${userId}`);
  
  return request({
    url: `/users/${userId}/favorites/${fruitId}`,
    method: 'DELETE'
  });
}

// 清除缓存
function clearCache() {
  cacheManager.clear();
}

// 清除过期缓存
function cleanExpiredCache() {
  cacheManager.cleanExpired();
}

module.exports = {
  request,
  uploadFile,
  getFruitDetail,
  getFruitComparison,
  getRecommendations,
  searchFruits,
  getIdentifyHistory,
  identifyImage,
  getUserHealthData,
  updateUserHealthData,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  clearCache,
  cleanExpiredCache
};