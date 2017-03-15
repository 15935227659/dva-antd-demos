// users data from http://jsonplaceholder.typicode.com/users
const users = require('./users')();
const categories = require('./categories')();
module.exports = function() {
  return {
    categories: categories,
    users: users
  };
}
