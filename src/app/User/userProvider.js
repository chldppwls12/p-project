const userDao = require('./userDao');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const {response, errResponse} = require('../../../config/response');
const baseResponse = require('../../../config/baseResponseStatus');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.login = async (id, password) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      const isExistUser = await userDao.isExistUser(connection, [id, password]);
      if (!isExistUser) return errResponse(baseResponse.NOT_EXIST_USER_INFO);

      const userIdx = await userDao.getUserIdx(connection, [id, password]);
      
      //jwt 생성
      const token = await jwt.sign(
        {userIdx: userIdx},
        process.env.JWT_SECRET,
        {expiresIn: '14d'}
      )
      
      const result = {jwt: token};

      connection.release();
      return response(baseResponse.SUCCESS, result);
    }catch(err){
      connection.release();
      logger.error(`login DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`login DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.getUserInfo = async (userIdx) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const userInfo = await userDao.getUserInfo(connection, [userIdx]);
      
      const result = {
        'id': userInfo.id,
        'phone': userInfo.phone,
        'address': userInfo.address
      }

      connection.release();
      return response(baseResponse.SUCCESS, result);
    }catch(err){
      connection.release();
      logger.error(`getUserInfo DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`getUserInfo DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}