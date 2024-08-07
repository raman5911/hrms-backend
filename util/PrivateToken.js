const jwt = require('jsonwebtoken');

module.exports.createPrivateToken = (obj_id, companyCode) => {
  const payload = {
    id: obj_id, 
    companyCode: companyCode
  };
  return jwt.sign(payload, process.env.PRIVATE_KEY, { expiresIn: '72h' });
}