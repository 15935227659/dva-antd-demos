const qs = require('qs');
const mockjs = require('mockjs');

module.exports = function() {
  const data = mockjs.mock({
    'data|100': [{
      'id|+1': 1,
      'cate1_id|1-100': 1,
      'cate1_name': '@ctitle',
      'cate2_id|1000-9900': 1,
      'cate2_name': '@ctitle'
    }],
    page: {
      total: 100,
      current: 1
    }
  });
  return data['data'];
}
