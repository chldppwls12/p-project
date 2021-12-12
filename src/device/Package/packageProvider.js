const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getNotReceivedPackageStatus = async () => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      let result = [];

      //수령되지 않은 택배
      const notReceivedPackage = await packageDao.notReceivedPackage(connection);

      notReceivedPackage.forEach(item => {
        result.push({
          'trackingNumber': item.trackingNumber,
          'companyCode': item.companyCode
        })
      })

      connection.release();
      return response(baseResponse.SUCCESS, result);

    }catch(err){
      connection.release();
      logger.error(`getNotReceivedPackageStatus DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getNotReceivedPackageStatus DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}