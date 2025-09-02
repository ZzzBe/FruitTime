# 果识 - 水果识别推荐小程序

## 项目结构

```
miniprogram/
├── app.js                  # 小程序入口文件
├── app.json                # 小程序全局配置
├── app.wxss                # 小程序全局样式
├── sitemap.json            # 小程序sitemap配置
├── pages/                  # 页面目录
│   ├── index/              # 首页
│   ├── fruit-identify/     # 拍照识别页
│   ├── fruit-result/       # 识别结果页
│   ├── fruit-detail/       # 水果详情页
│   ├── fruit-compare/      # 水果对比页
│   └── recommend/          # 个性化推荐页
├── components/             # 自定义组件
│   └── fruit-card/         # 水果卡片组件
├── utils/                  # 工具函数
│   ├── api.js             # API接口封装
│   ├── image-recognition.js # 图像识别工具
│   └── data-process.js    # 数据处理工具
├── styles/                 # 样式文件
│   └── common.wxss         # 公共样式
└── images/                 # 图片资源
```

## 功能模块

1. **首页 (index)**
   - 搜索水果
   - 快捷入口（果识、果知、果然）
   - 今日推荐

2. **果识 (fruit-identify)**
   - 拍照识别水果
   - 条形码识别
   - 识别历史记录

3. **识别结果 (fruit-result)**
   - 显示识别结果
   - 展示水果关键信息
   - 营养成分分析

4. **水果详情 (fruit-detail)**
   - 详细水果信息
   - 营养成分图表
   - 健康建议
   - 购买建议

5. **水果对比 (fruit-compare)**
   - 多水果对比
   - 营养成分对比
   - 可视化图表

6. **个性化推荐 (recommend)**
   - 健康档案展示
   - 个性化水果推荐
   - 推荐理由说明

## 开发规范

### 命名规范
- 页面文件夹：小写字母+连字符，如 `fruit-identify`
- 页面文件：`index.js`, `index.wxml`, `index.wxss`, `index.json`
- 组件文件夹：小写字母+连字符，如 `fruit-card`
- 组件文件：`index.js`, `index.wxml`, `index.wxss`, `index.json`
- JS变量/函数：驼峰命名，如 `getUserInfo`
- 样式类名：小写字母+连字符，如 `fruit-card`

### 样式规范
- 使用rpx单位适配不同屏幕
- 公共样式定义在 `styles/common.wxss`
- 页面样式遵循BEM命名规范
- 颜色使用全局变量定义

### 组件化开发
- 可复用的UI元素封装成组件
- 组件间通过props传递数据
- 组件间通过事件进行通信

## 技术栈

- 微信小程序原生框架
- WXML + WXSS + JavaScript
- 微信小程序API