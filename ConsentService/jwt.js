const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: '123e4567-e89b-12d3-a456-426614174000', email: 'test@example.com' }, '123456789');
console.log(token);