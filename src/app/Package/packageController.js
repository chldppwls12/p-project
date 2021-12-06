const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const packageProvider = require('./packageProvider');

/*
  API num: 1.1
  name: 택배 도착 확인 화면 API
  [GET] /app/packages
*/
exports.getAllPackageList = async (req, res) => {
  const {userIdx} = req.verifiedToken;

  const getAllPackageList = await packageProvider.getAllPackageList(userIdx);

  return res.send(getAllPackageList);
}

/*
  API num: 1.1
  name: 택배 분실 내역 확인 화면 API
  [GET] /app/robbed-packages
*/
exports.getRobbedPackageList = async (req, res) => {
  const {userIdx} = req.verifiedToken;

  const getRobbedPackageList = await packageProvider.getRobbedPackageList(userIdx);

  return res.send(getRobbedPackageList);
}