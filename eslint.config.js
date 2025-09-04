// eslint.config.js
// ESLint配置文件

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        wx: 'readonly',
        App: 'readonly',
        Page: 'readonly',
        getCurrentPages: 'readonly',
        getApp: 'readonly',
        Component: 'readonly',
        requirePlugin: 'readonly',
        requireMiniProgram: 'readonly',
      },
    },
    rules: {
      // 代码风格规则
      'indent': ['error', 2], // 使用2个空格缩进
      'quotes': ['error', 'single'], // 使用单引号
      'semi': ['error', 'always'], // 要求使用分号
      'comma-dangle': ['error', 'never'], // 禁止末尾逗号
      'no-trailing-spaces': 'error', // 禁止行尾空格
      'eol-last': ['error', 'always'], // 要求文件末尾有换行符
      
      // 命名规范
      'camelcase': 'warn', // 要求使用驼峰命名法
      'no-underscore-dangle': 'warn', // 禁止标识符中有悬空下划线
      
      // 最佳实践
      'eqeqeq': 'error', // 要求使用===和!== 
      'no-var': 'error', // 要求使用let或const而不是var
      'prefer-const': 'error', // 要求使用const声明不会被重新赋值的变量
      'no-console': 'warn', // 警告使用console
      'no-unused-vars': 'warn', // 警告未使用的变量
      
      // 复杂度控制（暂时放宽限制）
      'max-lines': ['warn', 800], // 限制单个文件行数
      'max-depth': ['warn', 6], // 限制嵌套深度
      'max-params': ['warn', 8], // 限制函数参数个数
      'complexity': ['warn', 15] // 限制圈复杂度
    },
  },
];