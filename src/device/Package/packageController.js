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
  name: 택배 수령 여부 변경
  [GET] /device/packages/status
  query: trackingNumber, companyCode
*/
exports.getPackageReceivedStatus = async (req, res) => {
  const {trackingNumber, companyCode} = req.query;
  if (!(trackingNumber && companyCode)) return res.send(errResponse(baseResponse.IS_EMPTY));

  const getPackageReceivedStatus = await packageProvider.getPackageReceivedStatus(trackingNumber, companyCode);

  return res.send(getPackageReceivedStatus);
}