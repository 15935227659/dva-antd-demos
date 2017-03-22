import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

export function patch(id, values) {
  return request(`/api/category/${id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    body: JSON.stringify(values),
  });
}

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

export function userInfo(values) {
  return request(`/api/userInfo`, {
    method: 'GET',
  });
}
