# 代码规范和命名约定

## 命名规范

### 变量和函数命名
- 使用驼峰命名法（camelCase）
- 变量名应具有描述性，避免使用缩写
- 布尔值变量名应以 `is`, `has`, `can`, `should` 等前缀开头

```javascript
// 好的例子
const userName = 'John';
const isActive = true;
const hasPermission = false;
const canEdit = true;

// 不好的例子
const username = 'John'; // 应该是 userName
const active = true; // 应该是 isActive
```

### 常量命名
- 使用全大写字母和下划线分隔单词
- 常量应在模块或类的顶部定义

```javascript
// 好的例子
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;

// 不好的例子
const maxRetryCount = 3; // 应该是 MAX_RETRY_COUNT
```

### 类和构造函数命名
- 使用帕斯卡命名法（PascalCase）
- 类名应该是名词

```javascript
// 好的例子
class UserManager {
  // ...
}

// 不好的例子
class userManager { // 应该是 UserManager
  // ...
}
```

### 私有成员命名
- 私有属性和方法以下划线 `_` 开头
- 注意：这只是约定，JavaScript 没有真正的私有成员

```javascript
class MyClass {
  constructor() {
    this._privateProperty = 'private';
  }
  
  _privateMethod() {
    // ...
  }
}
```

## 代码风格

### 缩进和空格
- 使用 2 个空格进行缩进
- 在大括号 `{` 前添加一个空格
- 在条件语句和循环语句的括号前后添加空格

```javascript
// 好的例子
if (condition) {
  // ...
}

for (let i = 0; i < array.length; i++) {
  // ...
}

function myFunction(param1, param2) {
  // ...
}

// 不好的例子
if(condition){
  // ...
}

for(let i=0;i<array.length;i++){
  // ...
}
```

### 行长度
- 每行代码不应超过 100 个字符
- 过长的行应适当换行

```javascript
// 好的例子
const longString = '这是一个非常长的字符串，' +
                  '我们需要将其拆分成多行';

// 不好的例子
const longString = '这是一个非常长的字符串，我们需要将其拆分成多行，因为它超过了推荐的行长度限制';
```

### 注释
- 使用行注释 `//` 进行单行注释
- 使用块注释 `/* */` 进行多行注释
- 函数应有 JSDoc 注释说明参数和返回值

```javascript
/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两个数的和
 */
function add(a, b) {
  return a + b;
}

// 这是一个单行注释
const value = 42;
```

## 最佳实践

### 变量声明
- 优先使用 `const`，需要重新赋值时使用 `let`
- 避免使用 `var`

```javascript
// 好的例子
const PI = 3.14159;
let counter = 0;

// 不好的例子
var PI = 3.14159; // 应该使用 const
var counter = 0; // 应该使用 const 或 let
```

### 比较运算符
- 始终使用严格相等运算符 `===` 和 `!==`
- 避免使用 `==` 和 `!=`

```javascript
// 好的例子
if (value === null) {
  // ...
}

// 不好的例子
if (value == null) { // 应该使用 ===
  // ...
}
```

### 错误处理
- 使用 `try...catch` 处理可能抛出异常的代码
- 提供有意义的错误信息

```javascript
try {
  const result = someOperation();
  // 处理成功情况
} catch (error) {
  console.error('操作失败:', error.message);
  // 处理错误情况
}
```

### 异步操作
- 优先使用 `async/await` 而不是回调函数
- 正确处理 Promise 错误

```javascript
// 好的例子
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}

// 不好的例子
function fetchData(callback) {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error));
}
```

## 小程序特定规范

### 页面生命周期
- 遵循小程序页面生命周期函数命名规范
- 合理使用页面事件处理函数

```javascript
Page({
  data: {
    // 页面数据
  },
  
  onLoad(options) {
    // 页面加载时执行
  },
  
  onShow() {
    // 页面显示时执行
  },
  
  onHide() {
    // 页面隐藏时执行
  },
  
  onUnload() {
    // 页面卸载时执行
  }
});
```

### 组件规范
- 组件属性应明确定义类型和默认值
- 组件方法应通过 `methods` 对象定义

```javascript
Component({
  properties: {
    title: {
      type: String,
      value: ''
    }
  },
  
  data: {
    // 组件内部数据
  },
  
  methods: {
    onTap() {
      // 组件方法
    }
  }
});
```

## 代码审查清单

在提交代码前，请检查以下事项：

1. [ ] 所有变量和函数名符合命名规范
2. [ ] 使用了正确的缩进和空格
3. [ ] 没有未使用的变量或函数
4. [ ] 注释清晰且有意义
5. [ ] 错误处理得当
6. [ ] 异步操作正确处理
7. [ ] 代码复杂度在合理范围内
8. [ ] 遵循小程序开发规范
9. [ ] 通过 ESLint 检查
10. [ ] 代码通过单元测试