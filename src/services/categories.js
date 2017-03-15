import request from '../utils/request';

export function fetch({ page = 1 }) {
  return request(`/api/categories?_page=${page}&_limit=5`);
}

export function remove(id) {
  return request(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

export function patch(id, values) {
  return request(`/api/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function create(values) {
  return request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
