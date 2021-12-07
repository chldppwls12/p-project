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