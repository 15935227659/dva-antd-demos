import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

export function fetch({ page }) {
  return request(`/api/category?page=${page}&limit=${PAGE_SIZE}`);
}

export function remove(id) {
  return request(`/api/category/${id}`, {
    method: 'DELETE',
  });
}

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
