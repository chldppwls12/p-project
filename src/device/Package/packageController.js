const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const packageService = require('./packageService');
const packageProvider = require('./packageProvider');

/*
  API num: 3.1
  name: 택배 도착 처리 API
  [POST] /device/packages
  body: userIdx, imageUrl, trackingNumber, companyCode
*/
exports.createPackage = async (req, res) => {
  const {userIdx, imageUrl, trackingNumber, companyCode} = req.body;
  if (!(userIdx && imageUrl && trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const createPackage = await packageService.createPackage(userIdx, imageUrl, trackingNumber, companyCode);

  return res.send(createPackage);
}

/*
  API num: 3.2
  name: 택배 도난 여부 변경
  [PATCH] /device/packages/status
  body: imageUrl, trackingNumber, companyCode
*/
exports.changeRobbedStatus = async (req, res) => {
  const {imageUrl: robbedImageUrl, trackingNumber, companyCode} = req.body;
  if (!(trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const changeRobbedStatus = await packageService.changeRobbedStatus(robbedImageUrl, trackingNumber, companyCode);

  return res.send(changeRobbedStatus);
}