import request from '../utils/request';
import { PAGE_SIZE } from '../constants';
import qs from 'qs'

export function query(values) {
  return request('/api/report?' + qs.stringify(values));
}

export function remove(id) {
  return request(`/api/report/${id}`, {
    method: 'DELETE',
  });
}

export function update(values) {
  return request(`/api/report/${values.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    body: JSON.stringify(values),
  });
}

export function create(values) {
  return request('/api/report', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // 修复api不能正确解析请求body的问题
    },
    method: 'POST',
    body: JSON.stringify(values),
  });
}
