// doc/test/sample-data.js
// 果识通小程序图表测试样例数据

// 测试水果数据
const testFruits = [
  {
    id: 1,
    name: '麒麟西瓜',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: '无籽西瓜',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: '黑美人西瓜',
    image: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=100&h=100&fit=crop'
  },
  {
    id: 4,
    name: '红颜草莓',
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=100&h=100&fit=crop'
  }
];

// 营养成分数据 (基于PRD文档中的6个维度)
const nutritionData = {
  labels: ['热量(kcal)', '糖分(g)', '膳食纤维(g)', '维生素C(mg)', '钾(mg)', '水分(%)'],
  datasets: [
    {
      label: '麒麟西瓜',
      data: [30, 6.2, 0.4, 8.1, 112, 92]
    },
    {
      label: '无籽西瓜',
      data: [31, 6.8, 0.3, 7.5, 108, 93]
    },
    {
      label: '黑美人西瓜',
      data: [32, 7.1, 0.4, 7.8, 115, 91]
    },
    {
      label: '红颜草莓',
      data: [32, 4.9, 2.0, 58.8, 153, 89]
    }
  ]
};

// 价格趋势数据 (近6个月)
const priceData = {
  labels: ['2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
  datasets: [
    {
      label: '麒麟西瓜',
      data: [3.99, 4.20, 3.80, 3.50, 4.10, 3.90]
    },
    {
      label: '无籽西瓜',
      data: [4.50, 4.80, 4.20, 4.00, 4.60, 4.40]
    },
    {
      label: '黑美人西瓜',
      data: [5.20, 5.50, 4.80, 4.60, 5.30, 5.10]
    },
    {
      label: '红颜草莓',
      data: [15.80, 16.50, 14.80, 12.50, 18.20, 16.80]
    }
  ]
};

// 口感特征数据 (基于PRD文档中的情感分析)
const tasteData = {
  features: ['甜', '酸', '脆', '软', '多汁', '香', '清爽', '浓郁'],
  data: [
    {
      fruitId: 1,
      fruitName: '麒麟西瓜',
      features: [
        { name: '甜', score: 4.5 },
        { name: '酸', score: 1.2 },
        { name: '脆', score: 4.2 },
        { name: '软', score: 1.0 },
        { name: '多汁', score: 4.8 },
        { name: '香', score: 3.5 },
        { name: '清爽', score: 4.7 },
        { name: '浓郁', score: 2.1 }
      ]
    },
    {
      fruitId: 2,
      fruitName: '无籽西瓜',
      features: [
        { name: '甜', score: 4.3 },
        { name: '酸', score: 1.0 },
        { name: '脆', score: 4.5 },
        { name: '软', score: 1.1 },
        { name: '多汁', score: 4.6 },
        { name: '香', score: 3.2 },
        { name: '清爽', score: 4.8 },
        { name: '浓郁', score: 1.9 }
      ]
    },
    {
      fruitId: 3,
      fruitName: '黑美人西瓜',
      features: [
        { name: '甜', score: 4.7 },
        { name: '酸', score: 1.3 },
        { name: '脆', score: 4.0 },
        { name: '软', score: 1.2 },
        { name: '多汁', score: 4.5 },
        { name: '香', score: 3.8 },
        { name: '清爽', score: 4.6 },
        { name: '浓郁', score: 2.3 }
      ]
    },
    {
      fruitId: 4,
      fruitName: '红颜草莓',
      features: [
        { name: '甜', score: 4.2 },
        { name: '酸', score: 2.8 },
        { name: '脆', score: 3.5 },
        { name: '软', score: 3.0 },
        { name: '多汁', score: 3.8 },
        { name: '香', score: 4.5 },
        { name: '清爽', score: 3.7 },
        { name: '浓郁', score: 4.3 }
      ]
    }
  ],
  // 标签云数据
  tagCloudData: [
    { text: '麒麟西瓜-甜', count: 92 },
    { text: '麒麟西瓜-多汁', count: 96 },
    { text: '麒麟西瓜-清爽', count: 89 },
    { text: '麒麟西瓜-脆', count: 84 },
    { text: '无籽西瓜-甜', count: 86 },
    { text: '无籽西瓜-多汁', count: 92 },
    { text: '无籽西瓜-清爽', count: 93 },
    { text: '无籽西瓜-脆', count: 90 },
    { text: '黑美人西瓜-甜', count: 94 },
    { text: '黑美人西瓜-多汁', count: 88 },
    { text: '黑美人西瓜-香', count: 76 },
    { text: '黑美人西瓜-浓郁', count: 68 },
    { text: '红颜草莓-甜', count: 84 },
    { text: '红颜草莓-酸', count: 56 },
    { text: '红颜草莓-香', count: 93 },
    { text: '红颜草莓-浓郁', count: 86 }
  ]
};

// 糖酸度数据
const sugarAcidData = [
  {
    fruitId: 1,
    fruitName: '麒麟西瓜',
    brix: { value: 11.5, max: 20 },
    acid: { value: 0.15, max: 2 }
  },
  {
    fruitId: 2,
    fruitName: '无籽西瓜',
    brix: { value: 10.8, max: 20 },
    acid: { value: 0.13, max: 2 }
  },
  {
    fruitId: 3,
    fruitName: '黑美人西瓜',
    brix: { value: 12.3, max: 20 },
    acid: { value: 0.18, max: 2 }
  },
  {
    fruitId: 4,
    fruitName: '红颜草莓',
    brix: { value: 8.2, max: 20 },
    acid: { value: 0.85, max: 2 }
  }
];

module.exports = {
  testFruits,
  nutritionData,
  priceData,
  tasteData,
  sugarAcidData
};