const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const userService = require('./userService');

/*
  API num: 1.1
  name: 회원가입 API
  [POST] /app/signup
  body: id, name, password, address, phone, email
*/
exports.createUserAccount = async (req, res) => {
  const {id, name, password, address, phone, email} = req.body;
  if (!(id && name && password && address && phone && email)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const createUserAccount = await userService.createUserAccount(id, name, password, address, phone, email);

  return res.send(createUserAccount);
}