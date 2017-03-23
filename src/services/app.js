import request from '../utils/request';

// 登录
export function login(values) {
  return request(`/api/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    body: JSON.stringify(values),
  });
}

// 退出
export function logout(values) {
  return request(`/api/logout`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    body: JSON.stringify(values),
  });
}

// 获取用户信息
export function userInfo(values) {
  return request(`/api/userInfo`, {
    method: 'GET',
  });
}
