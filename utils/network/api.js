// utils/network/api.js
// API接口封装

const { request, uploadFile, cacheManager } = require('./request.js');

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

module.exports = {
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
  removeFavorite
};