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
      if (!packageList.length){
        connection.release();
        return errResponse(baseResponse.NO_PACKAGE_LIST);
      }
      
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

exports.getRobbedPackageList = async (userIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      const robbedPackageList = await packageDao.getRobbedPackageList(connection, [userIdx]);
      if (!robbedPackageList.length){
        connection.release();
        return errResponse(baseResponse.NO_ROBBED_PACKAGE_LIST);
      }
      
      let result = [];

      robbedPackageList.forEach(item => {
        result.push({
          'packageIdx': item.packageIdx,
          'createdAt': item.createdAt,
          'companyCode': item.companyCode,
          'trackingNumber': item.trackingNumber,
          'robbedImageUrl': item.robbedImageUrl,
        })
      })

      connection.release();
      return response(baseResponse.SUCCESS, result);
    }catch(err){
      connection.release();
      logger.error(`getRobbedPackageList DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getRobbedPackageList DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.getPackageDetail = async (userIdx, packageIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 택배인지
      const isExistPackageIdx = await packageDao.isExistPackageIdx(connection, packageIdx);
      if (!isExistPackageIdx){
        connection.release();
        return errResponse(baseResponse.INVALID_PACKAGE_IDX);
      }

      const pacakgeInfo = await packageDao.getPackageInfo(connection, packageIdx);
      const result = {
        'imageUrl': pacakgeInfo.imageUrl,
        'trackingNumber': pacakgeInfo.trackingNumber,
        'createdAt': pacakgeInfo.createdAt
      }

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