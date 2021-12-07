module.exports = {
  SUCCESS: {isSuccess: true, code: 200, message: '성공'},

  JWT_EMPTY: {isSuccess: false, code: 2000, message: '로그인을 해주세요'},

  TOKEN_VERIFICATE_FAIL: {isSuccess: false, code: 3000, message: 'jwt 검증 실패'},

  NO_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '택배 내역이 없습니다'},
  NO_ROBBED_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '도난 택배 내역이 없습니다'},

  INVALID_PACKAGE_IDX: {isSuccess: false, code: 3300, message: '존재하지 않는 productIdx입니다'},

  NO_AUTHORITY: {isSuccess: false, code: 3400, message: '권한이 없습니다'},
  CAN_NOT_CHANGE_ROBBED_PACKAGE_STATUS: {isSuccess: false, code: 3500, message: '도난 택배의 상태는 변경할 수 없습니다'},

  DB_ERROR: {isSuccess: false, code: 4000, message: 'DB 에러'},
}