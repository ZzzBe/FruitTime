# 工具函数模块化结构说明

为了提高代码的可维护性和可读性，我们将工具函数按功能进行了模块化重构。

## 目录结构

```
utils/
├── index.js                 # 统一入口文件
├── network/                 # 网络相关工具
│   ├── request.js          # 网络请求封装
│   └── api.js              # API接口封装
├── ui/                     # UI相关工具
│   ├── util.js             # 基础UI工具
│   ├── format.js           # 格式化工具
│   ├── performance.js      # 性能优化工具
│   └── color.js            # 颜色相关工具
├── storage/                # 存储相关工具
│   └── storage.js          # 数据存储工具
├── validation/             # 验证相关工具
│   └── validation.js       # 数据验证工具
├── device/                 # 设备相关工具
│   └── device.js           # 设备信息工具
└── chart/                  # 图表相关工具
    └── chart.js            # 图表绘制工具
```

## 使用方式

### 1. 统一导入（推荐）

```javascript
const { 
  showToast, 
  showModal,
  formatPrice,
  formatRating,
  debounce,
  throttle,
  // ... 其他需要的工具函数
} = require('../../utils/index.js');
```

### 2. 按模块导入

```javascript
// 网络请求
const { request, uploadFile } = require('../../utils/network/request.js');
const { getFruitDetail, getRecommendations } = require('../../utils/network/api.js');

// UI工具
const { showToast, showModal } = require('../../utils/ui/util.js');
const { formatPrice, formatRating } = require('../../utils/ui/format.js');
const { debounce, throttle } = require('../../utils/ui/performance.js');

// 图表工具
const { ChartRenderer, TagCloud } = require('../../utils/chart/chart.js');
```

## 各模块功能说明

### network/request.js
- `request(options)`: 基础网络请求函数
- `uploadFile(options)`: 文件上传函数
- `clearCache()`: 清除所有缓存
- `cleanExpiredCache()`: 清除过期缓存

### network/api.js
封装了所有API接口：
- `getFruitDetail(id)`: 获取水果详情
- `getFruitComparison(ids)`: 获取水果对比数据
- `getRecommendations(healthData)`: 获取推荐水果
- `searchFruits(keyword)`: 搜索水果
- `getIdentifyHistory(userId)`: 获取识别历史
- `identifyImage(imagePath, type)`: 上传图片进行识别
- `getUserHealthData(userId)`: 获取用户健康数据
- `updateUserHealthData(userId, healthData)`: 更新用户健康数据
- `getUserFavorites(userId)`: 获取用户收藏列表
- `addFavorite(userId, fruitId)`: 添加收藏
- `removeFavorite(userId, fruitId)`: 移除收藏

### ui/util.js
- `showLoading(title)`: 显示加载提示
- `hideLoading()`: 隐藏加载提示
- `showToast(title, icon, duration)`: 显示提示信息
- `showModal(options)`: 显示模态对话框
- `querySelector(selector, scope)`: 节点查询
- `querySelectorAll(selector, scope)`: 批量节点查询

### ui/format.js
- `formatPrice(price)`: 格式化价格
- `formatRating(rating)`: 格式化评分
- `formatTime(time)`: 格式化时间
- `formatRelativeTime(timestamp)`: 格式化相对时间
- `formatFileSize(size)`: 格式化文件大小

### ui/performance.js
- `debounce(func, wait, immediate)`: 防抖函数
- `throttle(func, limit)`: 节流函数

### ui/color.js
- `getRandomColor()`: 生成随机颜色
- `generateGradientColors(startColor, endColor, steps)`: 生成颜色渐变

### storage/storage.js
- `deepClone(obj)`: 深拷贝对象
- `isEmptyObject(obj)`: 检查是否为空对象
- `uniqueArray(arr)`: 数组去重

### validation/validation.js
- `validatePhone(phone)`: 验证手机号
- `validateEmail(email)`: 验证邮箱
- `getUrlParams(url)`: 获取URL参数
- `generateId()`: 生成随机ID

### device/device.js
- `checkNetwork()`: 检查网络状态
- `getSystemInfo()`: 获取系统信息
- `getDeviceInfo()`: 获取设备信息
- `isIPhoneX()`: 检查是否为iPhone X系列

### chart/chart.js
- `ChartRenderer`: 图表渲染器类
- `TagCloud`: 标签云生成器类