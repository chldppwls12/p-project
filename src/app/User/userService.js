const userDao = require('./userDao');
const {response, errResponse} = require('../../../config/response');
const {logger} = require('../../../config/winston');
const {pool} = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//phone validation
const checkPhoneFormat = (phone) => {
  const regPhone = /^01([0|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  if (!regPhone.test(phone)) return false;
  return true;
}

//email validation
const checkEmailFormat = (email) => {
  const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  if (!regEmail.test(email)) return false;
  return true;
}

exports.createUserAccount = async (id, name, password, address, phone, email) => {
  if (!checkPhoneFormat(phone)) return errResponse(baseResponse.INVALID_PHONE_FORMAT);
  if (!checkEmailFormat(email)) return errResponse(baseResponse.INVALID_EMAIL_FORMAT);
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{

      //중복된 아이디인지
      const isDuplicatedId = await userDao.isDuplicatedId(connection, [id]);
      if (isDuplicatedId) return errResponse(baseResponse.DUPLICATED_ID);

      //중복된 이메일인지
      const isDuplicatedEmail = await userDao.isDuplicatedEmail(connection, [email]);
      if (isDuplicatedEmail) return errResponse(baseResponse.DUPLICATED_EMAIL);
      
      //회원가입
      await connection.beginTransaction();
      const newUser =  await userDao.createUserAccount(connection, [id, name, password, address, phone, email]);

      const newUserIdx = newUser.insertId;
      let token = await jwt.sign(
        {userIdx: newUserIdx},
        process.env.JWT_SECRET,
        {expiresIn: '14d'}
      )

      const result = {'jwt': token};

      await connection.commit();
      connection.release();

      return response(baseResponse.SUCCESS, result);
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

exports.updateUserInfo = async (userIdx, password, address, phone) => {
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      if (phone){
        if (!checkPhoneFormat(phone)) return errResponse(baseResponse.INVALID_PHONE_FORMAT);
      }

      await connection.beginTransaction();
      await userDao.updateUserInfo(connection, [password, address, phone, userIdx]);
      await connection.commit();
      connection.release();

      return response(baseResponse.SUCCESS);
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`updateUserInfo DB Query Error: ${err}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  }catch(err){
    logger.error(`updateUserInfo DB Connection Error: ${err}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}