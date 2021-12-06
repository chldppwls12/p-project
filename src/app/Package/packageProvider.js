const packageDao = require('./packageDao');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');

exports.getAllPackageList = async (userIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      const packageList = await packageDao.getAllPackageList(connection, [userIdx]);
      if (!packageList.length) return errResponse(baseResponse.NO_PACKAGE_LIST);
      
      let result = [];

      packageList.forEach(item => {
        result.push({
          'packageIdx': item.packageIdx,
          'createdAt': item.createdAt,
          'companyCode': item.companyCode,
          'trackingNumber': item.trackingNumber,
          'imageUrl': item.imageUrl,
          'isRobbed': item.isRobbed,
          'isReceived': item.isReceived
        })
      })

      connection.release();
      return response(baseResponse.SUCCESS, result);
    }catch(err){
      connection.release();
      logger.error(`getAllPackageList DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getAllPackageList DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}