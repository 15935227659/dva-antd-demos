import request from '../utils/request';
import { PAGE_SIZE } from '../constants';
import qs from 'qs'

export function query(values) {
  return request('/api/category?' + qs.stringify(values));
}

export function remove(id) {
  return request(`/api/category/${id}`, {
    method: 'DELETE',
  });
}

export function update(values) {
  return request(`/api/category/${values.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    body: JSON.stringify(values),
  });
}

export function create(values) {
  return request('/api/category', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function auth(values) {
  return request('/api/authority', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}
