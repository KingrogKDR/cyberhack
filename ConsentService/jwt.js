const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'd4e0a9bc-efa3-470e-915b-35a924c0e369', email: 'dummy@example.com' }, '123456789');
console.log(token);