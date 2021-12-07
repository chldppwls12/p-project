const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');
const axios = require('axios');

require('dotenv').config();

exports.createPackage = async (userIdx, imageUrl, trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

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