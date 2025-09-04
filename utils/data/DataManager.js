// utils/data/DataManager.js
// 通用数据管理工具

class DataManager {
  constructor() {
    this.cache = new Map();
  }

  // 获取缓存数据
  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.duration) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // 设置缓存数据
  setCache(key, data, duration = 5 * 60 * 1000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration
    });
  }

  // 清除缓存
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // 数据验证
  validateData(data, rules) {
    const errors = [];
    
    for (const field in rules) {
      const rule = rules[field];
      const value = data[field];
      
      // 必填验证
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(rule.message || `${field} 是必填项`);
        continue;
      }
      
      // 类型验证
      if (rule.type && value !== undefined && value !== null) {
        if (rule.type === 'string' && typeof value !== 'string') {
          errors.push(rule.message || `${field} 必须是字符串`);
        } else if (rule.type === 'number' && typeof value !== 'number') {
          errors.push(rule.message || `${field} 必须是数字`);
        } else if (rule.type === 'array' && !Array.isArray(value)) {
          errors.push(rule.message || `${field} 必须是数组`);
        } else if (rule.type === 'object' && typeof value !== 'object') {
          errors.push(rule.message || `${field} 必须是对象`);
        }
      }
      
      // 长度验证
      if (rule.min !== undefined && value !== undefined && value !== null) {
        if (typeof value === 'string' && value.length < rule.min) {
          errors.push(rule.message || `${field} 长度不能少于 ${rule.min}`);
        } else if (Array.isArray(value) && value.length < rule.min) {
          errors.push(rule.message || `${field} 元素数量不能少于 ${rule.min}`);
        }
      }
      
      if (rule.max !== undefined && value !== undefined && value !== null) {
        if (typeof value === 'string' && value.length > rule.max) {
          errors.push(rule.message || `${field} 长度不能超过 ${rule.max}`);
        } else if (Array.isArray(value) && value.length > rule.max) {
          errors.push(rule.message || `${field} 元素数量不能超过 ${rule.max}`);
        }
      }
      
      // 数值范围验证
      if (rule.minValue !== undefined && typeof value === 'number' && value < rule.minValue) {
        errors.push(rule.message || `${field} 不能小于 ${rule.minValue}`);
      }
      
      if (rule.maxValue !== undefined && typeof value === 'number' && value > rule.maxValue) {
        errors.push(rule.message || `${field} 不能大于 ${rule.maxValue}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 数据格式化
  formatData(data, formatters) {
    const formatted = { ...data };
    
    for (const field in formatters) {
      const formatter = formatters[field];
      const value = data[field];
      
      if (value !== undefined && value !== null) {
        if (formatter === 'trim' && typeof value === 'string') {
          formatted[field] = value.trim();
        } else if (formatter === 'lowercase' && typeof value === 'string') {
          formatted[field] = value.toLowerCase();
        } else if (formatter === 'uppercase' && typeof value === 'string') {
          formatted[field] = value.toUpperCase();
        } else if (formatter === 'number' && typeof value === 'string') {
          formatted[field] = parseFloat(value);
        } else if (formatter === 'integer' && typeof value === 'string') {
          formatted[field] = parseInt(value, 10);
        } else if (typeof formatter === 'function') {
          formatted[field] = formatter(value);
        }
      }
    }
    
    return formatted;
  }

  // 数据合并
  mergeData(target, source, options = {}) {
    const { deep = false, overwrite = true } = options;
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (deep && typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
          }
          this.mergeData(target[key], source[key], options);
        } else if (overwrite || target[key] === undefined) {
          target[key] = source[key];
        }
      }
    }
    
    return target;
  }

  // 数据过滤
  filterData(data, filterFn) {
    if (Array.isArray(data)) {
      return data.filter(filterFn);
    } else if (typeof data === 'object' && data !== null) {
      const filtered = {};
      for (const key in data) {
        if (data.hasOwnProperty(key) && filterFn(data[key], key)) {
          filtered[key] = data[key];
        }
      }
      return filtered;
    }
    return data;
  }

  // 数据排序
  sortData(data, compareFn) {
    if (Array.isArray(data)) {
      return [...data].sort(compareFn);
    }
    return data;
  }

  // 数据分页
  paginateData(data, page, pageSize) {
    if (!Array.isArray(data)) return [];
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return data.slice(startIndex, endIndex);
  }
}

module.exports = DataManager;