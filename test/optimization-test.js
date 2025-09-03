// test/optimization-test.js
// 果识通小程序优化测试文件

// 模拟测试全局数据管理
function testGlobalData() {
  console.log('=== 测试全局数据管理 ===');
  
  // 模拟App实例
  const app = {
    globalData: {
      healthData: {
        age: 30,
        gender: '男',
        weight: 70,
        conditions: ['糖尿病'],
        sugarLimit: 25,
        tastePref: ['甜', '脆'],
        allergies: ['芒果']
      },
      comparisonList: [
        { id: 1, name: '麒麟西瓜' },
        { id: 2, name: '红颜草莓' }
      ],
      identifyHistory: [
        { id: 1, name: '麒麟西瓜', timestamp: Date.now() - 3600000 },
        { id: 2, name: '红颜草莓', timestamp: Date.now() - 7200000 }
      ]
    },
    
    updateHealthData(data) {
      this.globalData.healthData = { ...this.globalData.healthData, ...data };
      console.log('健康数据已更新:', this.globalData.healthData);
    },
    
    addToComparison(fruit) {
      const exists = this.globalData.comparisonList.find(item => item.id === fruit.id);
      if (exists) {
        console.log('水果已存在对比列表中');
        return false;
      }
      
      if (this.globalData.comparisonList.length >= 4) {
        console.log('对比列表已满，最多4个水果');
        return false;
      }
      
      this.globalData.comparisonList.push(fruit);
      console.log('已添加到对比列表:', fruit.name);
      return true;
    },
    
    removeFromComparison(fruitId) {
      this.globalData.comparisonList = this.globalData.comparisonList.filter(item => item.id !== fruitId);
      console.log('已从对比列表移除ID为', fruitId, '的水果');
    }
  };
  
  // 测试更新健康数据
  app.updateHealthData({ age: 35, weight: 75 });
  
  // 测试添加水果到对比列表
  app.addToComparison({ id: 3, name: '赣南脐橙' });
  
  // 测试添加重复水果
  app.addToComparison({ id: 1, name: '麒麟西瓜' });
  
  // 测试移除水果
  app.removeFromComparison(2);
  
  console.log('最终对比列表:', app.globalData.comparisonList);
}

// 模拟测试工具函数
function testUtils() {
  console.log('\n=== 测试工具函数 ===');
  
  // 模拟util对象
  const util = {
    formatPrice(price) {
      if (price == null) return '¥0.00';
      return '¥' + parseFloat(price).toFixed(2);
    },
    
    formatRating(rating) {
      if (rating == null) return '0.0';
      return parseFloat(rating).toFixed(1);
    },
    
    formatRelativeTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;
      
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) return `${hours}小时前`;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days < 30) return `${days}天前`;
      
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    debounce(func, wait, immediate = false) {
      let timeout;
      return function (...args) {
        const context = this;
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        
        if (callNow) func.apply(context, args);
      };
    },
    
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'B';
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB';
      } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + 'MB';
      } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
      }
    }
  };
  
  // 测试价格格式化
  console.log('价格格式化测试:');
  console.log('12.5 ->', util.formatPrice(12.5));
  console.log('null ->', util.formatPrice(null));
  
  // 测试评分格式化
  console.log('\n评分格式化测试:');
  console.log('4.333 ->', util.formatRating(4.333));
  console.log('null ->', util.formatRating(null));
  
  // 测试相对时间格式化
  console.log('\n相对时间格式化测试:');
  console.log('1分钟前 ->', util.formatRelativeTime(Date.now() - 60000));
  console.log('2小时前 ->', util.formatRelativeTime(Date.now() - 7200000));
  console.log('3天前 ->', util.formatRelativeTime(Date.now() - 259200000));
  
  // 测试防抖函数
  console.log('\n防抖函数测试:');
  let counter = 0;
  const debouncedFunc = util.debounce(() => {
    counter++;
    console.log('防抖函数执行次数:', counter);
  }, 500);
  
  // 快速调用5次，应该只执行一次
  for (let i = 0; i < 5; i++) {
    debouncedFunc();
  }
  
  // 测试文件大小格式化
  console.log('\n文件大小格式化测试:');
  console.log('1023 ->', util.formatFileSize(1023));
  console.log('1048576 ->', util.formatFileSize(1048576));
  console.log('1073741824 ->', util.formatFileSize(1073741824));
}

// 模拟测试API缓存
function testApiCache() {
  console.log('\n=== 测试API缓存 ===');
  
  // 模拟缓存管理器
  class CacheManager {
    constructor() {
      this.cache = new Map();
      this.CACHE_DURATION = 5 * 60 * 1000; // 5分钟默认缓存时间
    }

    get(key) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < cached.duration) {
        console.log('返回缓存数据:', key);
        return cached.data;
      }
      this.cache.delete(key);
      return null;
    }

    set(key, data, duration = this.CACHE_DURATION) {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        duration
      });
      console.log('设置缓存:', key);
    }

    clear() {
      this.cache.clear();
      console.log('缓存已清空');
    }
  }
  
  const cacheManager = new CacheManager();
  
  // 测试设置缓存
  cacheManager.set('test_key', { name: '测试数据' }, 1000); // 1秒缓存
  
  // 测试获取缓存
  console.log('获取缓存:', cacheManager.get('test_key'));
  
  // 等待1秒后再次获取（应该返回null）
  setTimeout(() => {
    console.log('1秒后获取缓存:', cacheManager.get('test_key'));
  }, 1000);
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行果识通小程序优化测试...\n');
  
  testGlobalData();
  testUtils();
  testApiCache();
  
  console.log('\n所有测试完成！');
}

// 执行测试
runAllTests();