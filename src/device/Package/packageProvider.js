const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getPackageStatus = async (trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      let result = {};

      //존재하는 택배인지
      const isExistPackage = await packageDao.isExistPackage(connection, [trackingNumber, companyCode]);
      if (!isExistPackage){
        result.isStoraged = false;
        result.isReceived = false;

        connection.release();
        return response(baseResponse.SUCCESS, result);
      }

      result.isStoraged = true;

      //수령 여부 확인
      const packageReceivedStatus = await packageDao.packageReceivedStatus(connection, [trackingNumber, companyCode]);
      packageReceivedStatus == 'RECEIVED' ? result.isReceived = true : result.isReceived = false;

      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getPackageStatus DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getPackageStatus DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}