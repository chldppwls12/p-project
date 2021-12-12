const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');

exports.changePackageRecievedStatus = async (userIdx, packageIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 packageIdx인지
      const isExistPackageIdx = await packageDao.isExistPackageIdx(connection, [packageIdx]);
      if (!isExistPackageIdx){
        connection.release();
        return errResponse(baseResponse.INVALID_PACKAGE_IDX);
      }

      //도난 택배인지
      const isRobbedPackage = await packageDao.isRobbedPackage(connection, [packageIdx]);
      if (isRobbedPackage === 'Y'){
        connection.release();
        return errResponse(baseResponse.CAN_NOT_CHANGE_ROBBED_PACKAGE_STATUS);
      }

      //수령 여부 변경 권한 확인
      const isUserPackage = await packageDao.isUserPackage(connection, [userIdx, packageIdx]);
      if (!isUserPackage){
        connection.release();
        return errResponse(baseResponse.NO_AUTHORITY);
      }

      //현재 수령 여부 확인
      const currentPackageStatus = await packageDao.currentPackageStatus(connection, [packageIdx]);

      let result = {};

      await connection.beginTransaction();

      //현재 상태가 수령일 경우
      if (currentPackageStatus === 'RECEIVIED'){
        await packageDao.changeToNotReceived(connection, [packageIdx]);
        result.isReceived = 'N';
      }
      //현재 상태가 수령하지 않은 경우
      else if (currentPackageStatus === 'NOT_RECEIVIED'){
        await packageDao.changeToReceived(connection, [packageIdx]);
        result.isReceived = 'Y';
      }
      await connection.commit();

      connection.release();
      return response(baseResponse.SUCCESS, result);
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`changePackageRecievedStatus DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`changePackageRecievedStatus DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}