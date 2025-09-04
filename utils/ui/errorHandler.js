// utils/ui/errorHandler.js
// 通用错误处理工具

const { showToast } = require('./util.js');

// API错误处理
function handleApiError(error, defaultMessage = '操作失败') {
  console.error('API错误:', error);
  
  // 根据错误类型显示不同提示
  if (error.code === -1) {
    // 网络错误
    showToast(error.message || '网络连接失败，请检查网络设置');
  } else if (error.code >= 400 && error.code < 500) {
    // 客户端错误
    showToast(error.message || '请求参数错误');
  } else if (error.code >= 500) {
    // 服务器错误
    showToast(error.message || '服务器繁忙，请稍后重试');
  } else {
    // 其他错误
    showToast(error.message || defaultMessage);
  }
}

// 网络请求错误处理
function handleNetworkError(error) {
  console.error('网络错误:', error);
  
  // 根据错误类型提供不同的提示
  let message = '网络请求失败';
  if (error.errMsg && error.errMsg.includes('timeout')) {
    message = '请求超时，请检查网络连接';
  } else if (error.errMsg && error.errMsg.includes('fail url')) {
    message = '请求地址错误';
  } else if (error.errMsg && error.errMsg.includes('abort')) {
    message = '请求被中止';
  }
  
  showToast(message);
}

// 文件上传错误处理
function handleUploadError(error) {
  console.error('文件上传错误:', error);
  
  let message = '上传失败';
  if (error.errMsg && error.errMsg.includes('timeout')) {
    message = '上传超时，请检查网络连接';
  }
  
  showToast(message);
}

// 通用Promise错误处理
function handlePromiseError(promise, successCallback, errorCallback, finallyCallback) {
  return promise
    .then(result => {
      if (successCallback) successCallback(result);
      return result;
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      } else {
        handleApiError(error);
      }
    })
    .finally(() => {
      if (finallyCallback) finallyCallback();
    });
}

module.exports = {
  handleApiError,
  handleNetworkError,
  handleUploadError,
  handlePromiseError
};