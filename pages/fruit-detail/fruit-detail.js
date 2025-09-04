// pages/fruit-detail/index.js
const {
  showToast,
  showLoading,
  hideLoading
} = require('../../utils/index.js');

const {
  getFruitDetail
} = require('../../utils/network/api.js');

Page({
  data: {
    fruitId: null,
    fruitInfo: {
      id: 1,
      name: '麒麟西瓜',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop',
      description: '甜度13° · 当季水果 · 汁多味甜',
      price: '¥3.99',
      unit: '/斤',
      tags: [
        { text: '当季', class: 'tag-season' },
        { text: '热销', class: 'tag-hot' }
      ],
      basicInfo: {
        origin: '海南',
        season: '5-9月',
        sweetness: '12-14°',
        storage: '常温3-5天'
      },
      nutritionChart: {
        water: 92,
        carbohydrate: 7.6,
        protein: 0.6,
        fat: 0.2
      },
      nutritionDetail: [
        { name: '热量', value: '30 kcal' },
        { name: '维生素C', value: '8.1 mg' },
        { name: '膳食纤维', value: '0.4 g' },
        { name: '钾', value: '112 mg' },
        { name: '番茄红素', value: '4.5 mg' }
      ],
      tasteTags: [
        { text: '汁多', class: 'tag-green' },
        { text: '味甜', class: 'tag-red' },
        { text: '脆嫩', class: 'tag-yellow' },
        { text: '清爽', class: 'tag-purple' }
      ],
      tasteDescription: '麒麟西瓜果肉鲜红，质地脆嫩，汁水丰富，甜度高且分布均匀，中心糖度可达13-14度，边缘也在10度以上，口感极佳。',
      healthAdvice: [
        { icon: 'check', text: '夏季补水佳品，有助于预防中暑' },
        { icon: 'warning', text: '糖尿病患者需控制摄入量' },
        { icon: 'info', text: '建议饭后1小时食用，避免空腹' }
      ],
      buyingTips: [
        { step: '1', title: '看纹路', description: '纹路清晰、间距宽的更甜' },
        { step: '2', title: '听声音', description: '轻拍声音清脆表示成熟' },
        { step: '3', title: '看瓜蒂', description: '瓜蒂新鲜、弯曲的更甜' }
      ]
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        fruitId: options.id
      });
      this.loadFruitDetail(options.id);
    }
  },

  loadFruitDetail(fruitId) {
    // 使用API获取水果详情
    api.getFruitDetail(fruitId)
      .then(res => {
        if (res.code === 200) {
          this.setData({
            fruitInfo: res.data
          });
        }
      })
      .catch(err => {
        showToast('获取水果详情失败');
        console.error('获取水果详情失败:', err);
      });
  },

  addToCompare() {
    // 添加到对比功能
    const app = getApp();
    app.addToComparison(this.data.fruitInfo);
  },

  recommendToMe() {
    // 推荐给我
    wx.navigateTo({
      url: '/pages/fruit-recommend/fruit-recommend'
    });
  },

  onShareAppMessage() {
    // 分享功能
    return {
      title: '我发现了一个很棒的水果：' + this.data.fruitInfo.name,
      path: '/pages/fruit-detail/fruit-detail?id=' + this.data.fruitInfo.id
    };
  }
});
