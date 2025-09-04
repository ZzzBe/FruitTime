// utils/storage/storage.js
// 数据存储相关工具函数

// 深拷贝对象
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// 检查是否为空对象
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

// 数组去重
function uniqueArray(arr) {
  return [...new Set(arr)];
}

module.exports = {
  deepClone,
  isEmptyObject,
  uniqueArray
};