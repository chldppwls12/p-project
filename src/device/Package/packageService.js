const packageDao = require('./packageDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../../../config/firebase-admin.json');

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//userIdx 고정으로 변경
exports.createPackage = async (imageUrl, trackingNumber, companyCode) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      const userIdx = 6;  //고정한 userIdx

      //유효한 userIdx인지
      const isExistUserIdx = await packageDao.isExistUserIdx(connection, [userIdx]);
      if (!isExistUserIdx){
        connection.release();
        return errResponse(baseResponse.INVALID_USER_IDX);
      }

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
        if (isAlreadyCreatedPackage){
          connection.release();
          return errResponse(baseResponse.IS_ALREADY_CREATED_PACKAGE);
        }

        //택배 정보 넣기
        await connection.beginTransaction();
        await packageDao.createPackage(connection, [userIdx, imageUrl, trackingNumber, companyCode]);
        await connection.commit();

        //fcm 추가하기
        const deviceToken = await packageDao.getDeviceToken(connection, [userIdx]);
        if (deviceToken){
          const message = {
            notification: {
              title: 'Parcel Protect',
              body: '🚚택배가 도착했습니다🚚 지금 바로 확인해보세요'
            },
            token: deviceToken
          }

          admin
            .messaging()
            .send(message)
            .then(function (res){
              console.log('fcm 전송 성공', res);
              connection.release();
              return response(baseResponse.SUCCESS);
            })
            .catch((err) => {
              console.log('fcm 전송 실패', err);
              return errResponse(baseResponse.FCM_ERROR);
            })
        }

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
      if (!isExistPackage){
        connection.release();
        return errResponse(baseResponse.DOES_NOT_EXIST_PACKAGE);
      }

      //이미 수령한 택배일 경우
      const isReceivedPackage = await packageDao.isReceivedPackage(connection, [trackingNumber, companyCode]);
      if (isReceivedPackage){
        connection.release();
        return errResponse(baseResponse.CAN_NOT_CHANGE_RECEIVED_PACKAGE_STATUS);
      }

      //현재 도난 상태 확인
      const currentPackageStatus = await packageDao.currentPackageStatus(connection, [trackingNumber, companyCode]);

      if (currentPackageStatus === 'ROBBED'){
        connection.release();
        return errResponse(baseResponse.IS_ALREADY_ROBBED_PACKAGE);
      }

      await connection.beginTransaction();
      await packageDao.changeToTobbed(connection, [robbedImageUrl, trackingNumber, companyCode]);
      await connection.commit();

      //fcm 추가하기
      const userIdx = 6;  //고정한 userIdx
      const deviceToken = await packageDao.getDeviceToken(connection, [userIdx]);
      if (deviceToken){
        const message = {
          notification: {
            title: 'Parcel Protect',
            body: '🚨택배 도난이 발생했습니다🚨 도난 내역에서 도난된 택배 정보를 확인해보세요'
          },
          token: deviceToken
        }

        admin
          .messaging()
          .send(message)
          .then((res) => {
            console.log('fcm 전송 성공', res);
            connection.release();
            return response(baseResponse.SUCCESS);
          })
          .catch((err) => {
            console.log('fcm 전송 실패', err);
            return errResponse(baseResponse.FCM_ERROR);
          })
      }

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