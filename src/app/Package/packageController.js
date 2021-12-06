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