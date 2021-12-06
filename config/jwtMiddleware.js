const jwt = require('jsonwebtoken');
const {errResponse} = require('./response');
const baseResponse = require('./baseResponseStatus');

require('dotenv').config();

const jwtMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token){
    return res.send(errResponse(baseResponse.JWT_EMPTY));
  }

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, verifiedToken) => {
      if (err) reject(err);
      resolve(verifiedToken);
    })
  });

  p.then((verifiedToken) => {
    req.verifiedToken = verifiedToken;
    next();
  }).catch((err) => res.send(errResponse(baseResponse.TOKEN_VERIFICATE_FAIL)));
}

module.exports = jwtMiddleware;