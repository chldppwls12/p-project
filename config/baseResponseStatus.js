module.exports = {
  SUCCESS: {isSuccess: true, code: 200, message: '성공'},

  JWT_EMPTY: {isSuccess: false, code: 2000, message: '로그인을 해주세요'},

  TOKEN_VERIFICATE_FAIL: {isSuccess: false, code: 3000, message: 'jwt 검증 실패'},

  NO_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '택배 내역이 없습니다'},
  NO_ROBBED_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '도난 택배 내역이 없습니다'},

  DB_ERROR: {isSuccess: false, code: 4000, message: 'DB 에러'},
}