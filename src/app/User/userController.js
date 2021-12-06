const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const userService = require('./userService');
const userProvider = require('./userProvider');

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

/*
  API num: 1.2
  name: 로그인 API
  [POST] /app/login
  body: id, password
*/
exports.login = async (req, res) => {
  const {id, password} = req.body;
  if (!(id && password)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const login = await userProvider.login(id, password);

  return res.send(login);
}

/*
  API num: 1.3
  name: 회원 정보 조회 API
  [GET] /app/user
*/
exports.getUserInfo = async (req, res) => {
  const {userIdx} = req.verifiedToken;

  const getUserInfo = await userProvider.getUserInfo(userIdx);

  return res.send(getUserInfo);
}