const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const packageProvider = require('./packageProvider');
const packageService = require('./packageService');

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

/*
  API num: 2.3
  name: 택배 수령 여부 변경 API
  [GET] /app/packages/:packageIdx/status
*/
exports.changePackageRecievedStatus = async (req, res) => {
  const {userIdx} = req.verifiedToken;
  const {packageIdx} = req.params;
  
  const changePackageRecievedStatus = await packageService.changePackageRecievedStatus(userIdx, packageIdx);

  return res.send(changePackageRecievedStatus);
}

/*
  API num: 2.4
  name: 택배 상세 조회 API
  [GET] /app/packages/:packageIdx
*/
exports.getPackageDetail = async (req, res) => {
  const {userIdx} = req.verifiedToken;
  const {packageIdx} = req.params;

  const getPackageDetail = await packageProvider.getPackageDetail(userIdx, packageIdx);

  return res.send(getPackageDetail);
}