const axios = require('axios');

module.exports = (User) => (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (typeof token === 'undefined') {
    return res.send({status: {
      message: 'Token is invalide', 
      error: true
    }, data: {}});
  }

  axios({
    url: 'http://localhost:3000/verify', 
    headers: {'x-access-token': token},
    method:'post',
  }).then(r => {
    const { status, data } = r.data;
    if (!status.error) {
      req.decode = data['decode'];
      return next();
    }
    res.send(r.data);
  }).catch(err => {
    if (typeof err.response === 'undefined') {
      return res.send({status: {
        message: 'Auth service not found', 
        error: true
      }});
    }

    return res.send(err.response['data']);
  });
};