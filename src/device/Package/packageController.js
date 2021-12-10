const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const packageService = require('./packageService');
const packageProvider = require('./packageProvider');

/*
  API num: 3.1
  name: 택배 도착 처리 API
  [POST] /device/packages
  body: imageUrl, trackingNumber, companyCode
*/
// userIdx 고정으로 변경
exports.createPackage = async (req, res) => {
  const {imageUrl, trackingNumber, companyCode} = req.body;
  if (!(imageUrl && trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const createPackage = await packageService.createPackage(imageUrl, trackingNumber, companyCode);

  return res.send(createPackage);
}

/*
  API num: 3.2
  name: 택배 도난 처리
  [PATCH] /device/packages/status
  body: imageUrl, trackingNumber, companyCode
*/
exports.changeRobbedStatus = async (req, res) => {
  const {imageUrl: robbedImageUrl, trackingNumber, companyCode} = req.body;
  if (!(robbedImageUrl && trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const changeRobbedStatus = await packageService.changeRobbedStatus(robbedImageUrl, trackingNumber, companyCode);

  return res.send(changeRobbedStatus);
}

/*
  API num: 3.3
  name: 택배값 조회
  [GET] /device/packages/status
  query: trackingNumber, companyCode
*/
exports.getPackageStatus = async (req, res) => {
  const {trackingNumber, companyCode} = req.query;
  if (!(trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const getPackageStatus = await packageProvider.getPackageStatus(trackingNumber, companyCode);

  return res.send(getPackageStatus);
}