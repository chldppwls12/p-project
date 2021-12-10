const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');
const axios = require('axios');

require('dotenv').config();

//userIdx 고정으로 변경
exports.createPackage = async (imageUrl, trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      const userIdx = 6;  //고정한 userIdx

      //유효한 userIdx인지
      const isExistUserIdx = await packageDao.isExistUserIdx(connection, [userIdx]);
      if (!isExistUserIdx) return errResponse(baseResponse.INVALID_USER_IDX);

      //유효한 택배사 코드 + 운송장 번호인지
      const url = `http://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${process.env.SMART_API_KEY}&t_code=${companyCode}&t_invoice=${trackingNumber}`;
      const res = await axios.get(url);
      
      if ('code' in res.data){
        if (res.data.code == 101 || res.data.code == 102) return errResponse(baseResponse.INVALID_SMART_API_KEY);
        else if (res.data.code == 104 || res.data.code == 106) return errResponse(baseResponse.INVALID_PACKAGE_INFO);
      }
      else{

        //기존에 등록한 택배인지
        const isAlreadyCreatedPackage = await packageDao.isAlreadyCreatedPackage(connection, [userIdx, trackingNumber, companyCode]);
        if (isAlreadyCreatedPackage) return errResponse(baseResponse.IS_ALREADY_CREATED_PACKAGE);

        //택배 정보 넣기
        await connection.beginTransaction();
        await packageDao.createPackage(connection, [userIdx, imageUrl, trackingNumber, companyCode]);
        await connection.commit();

        //fcm 추가하기

        connection.release();
        return response(baseResponse.SUCCESS);
        }

    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`createUserAccount DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`createUserAccount DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.changeRobbedStatus = async (robbedImageUrl, trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //존재하는 택배인지
      const isExistPackage = await packageDao.isExistPackage(connection, [trackingNumber, companyCode]);
      if (!isExistPackage) return errResponse(baseResponse.DOES_NOT_EXIST_PACKAGE);

      //이미 수령한 택배일 경우
      const isReceivedPackage = await packageDao.isReceivedPackage(connection, [trackingNumber, companyCode]);
      if (isReceivedPackage) return errResponse(baseResponse.CAN_NOT_CHANGE_RECEIVED_PACKAGE_STATUS);

      //현재 도난 상태 확인
      const currentPackageStatus = await packageDao.currentPackageStatus(connection, [trackingNumber, companyCode]);

      if (currentPackageStatus === 'ROBBED'){
        return errResponse(baseResponse.IS_ALREADY_ROBBED_PACKAGE);
      }

      await connection.beginTransaction();
      await packageDao.changeToTobbed(connection, [robbedImageUrl, trackingNumber, companyCode]);
      await connection.commit();

      connection.release();
      return response(baseResponse.SUCCESS);

    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`changeRobbedStatus DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`changeRobbedStatus DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}