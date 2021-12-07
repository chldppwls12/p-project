const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getPackageReceivedStatus = async (trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 택배인지
      const isExistPackage = await packageDao.isExistPackage(connection, [trackingNumber, companyCode]);
      if (!isExistPackage) return errResponse(baseResponse.NOT_STORAGED_PACKAGE);

      let result = {};

      //도난된 택배인지
      const currentPackageStatus = await packageDao.currentPackageStatus(connection, [trackingNumber, companyCode]);
      if (currentPackageStatus === 'ROBBED'){
        result.status = 'ROBBED';
        
        connection.release();
        return response(baseResponse.SUCCESS, result);
      }

      //수령 여부 확인
      const packageReceivedStatus = await packageDao.packageReceivedStatus(connection, [trackingNumber, companyCode]);

      result.status = packageReceivedStatus;

      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getPackageReceivedStatus DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getPackageReceivedStatus DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}