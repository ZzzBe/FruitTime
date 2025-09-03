// test/optimization.test.js

// 测试工具函数
const util = require('../utils/util.js');

// 测试防抖函数
console.log('测试防抖函数...');
const debouncedFunc = util.debounce(() => {
  console.log('防抖函数执行');
}, 300);

debouncedFunc();
debouncedFunc();
debouncedFunc();

// 测试节流函数
console.log('测试节流函数...');
const throttledFunc = util.throttle(() => {
  console.log('节流函数执行');
}, 1000);

throttledFunc();
throttledFunc();
throttledFunc();

// 测试格式化函数
console.log('测试格式化函数...');
console.log('价格格式化:', util.formatPrice(3.99));
console.log('评分格式化:', util.formatRating(4.8));

// 测试深拷贝
console.log('测试深拷贝...');
const originalObj = {
  name: '测试对象',
  nested: {
    value: 42
  },
  array: [1, 2, 3]
};

const clonedObj = util.deepClone(originalObj);
console.log('原始对象:', originalObj);
console.log('克隆对象:', clonedObj);
console.log('是否为同一对象:', originalObj === clonedObj);

// 测试验证函数
console.log('测试验证函数...');
console.log('手机号验证 (13812345678):', util.validatePhone('13812345678'));
console.log('手机号验证 (12345678901):', util.validatePhone('12345678901'));
console.log('邮箱验证 (test@example.com):', util.validateEmail('test@example.com'));
console.log('邮箱验证 (invalid-email):', util.validateEmail('invalid-email'));

// 测试数组去重
console.log('测试数组去重...');
const duplicateArray = [1, 2, 2, 3, 3, 4, 5, 5];
console.log('原数组:', duplicateArray);
console.log('去重后:', util.uniqueArray(duplicateArray));

console.log('工具函数测试完成');