import fetch from 'dva/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}


/**
 * 请求URL, 返回promise实例
 *
 * @param  {string} url       请求URL
 * @param  {object} [options] 获取数据所传递的选项
 * @return {object}           返回包含data或err的对象
 */
export default async function request(url, options) {
  const response = await fetch(url, options);

  checkStatus(response);

  if (response.status === 204) return {}; // for 204, no content in response body
  const data = await response.json();

  const ret = {
    data,
    headers: {},
  };

  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count');
  }

  return ret;
}

