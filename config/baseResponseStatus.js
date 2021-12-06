module.exports = {
  SUCCESS: {isSuccess: true, code: 200, message: '성공'},

  IS_EMPTY: {isSuccess: false, code: 2100, message: '공백이 있습니다'},

  INVALID_PHONE_FORMAT: {isSuccess: false, code: 2200, message: '핸드폰 형식을 확인해주세요'},
  INVALID_EMAIL_FORMAT: {isSuccess: false, code: 2201, message: '이메일 형식을 확인해주세요'},

  DUPLICATED_ID: {isSuccess: false, code: 2300, message: '중복된 아이디입니다'},
  DUPLICATED_EMAIL: {isSuccess: false, code: 2301, message: '중복된 이메일입니다'},

  NOT_EXIST_USER_INFO: {isSuccess: false, code: 3100, message: '회원 정보가 존재하지 않습니다'},

  DB_ERROR: {isSuccess: false, code: 4000, message: 'DB 에러'},
}