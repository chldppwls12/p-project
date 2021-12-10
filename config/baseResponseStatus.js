module.exports = {
  SUCCESS: {isSuccess: true, code: 200, message: '성공'},

  JWT_EMPTY: {isSuccess: false, code: 2000, message: '로그인을 해주세요'},

  IS_EMPTY: {isSuccess: false, code: 2100, message: '공백이 있습니다'},
  INPUT_UPDATE_INFO: {isSuccess: false, code: 2100, message: '수정할 정보를 입력해주세요'},

  INVALID_PHONE_FORMAT: {isSuccess: false, code: 2200, message: '핸드폰 형식을 확인해주세요'},
  INVALID_EMAIL_FORMAT: {isSuccess: false, code: 2201, message: '이메일 형식을 확인해주세요'},

  DUPLICATED_ID: {isSuccess: false, code: 2300, message: '중복된 아이디입니다'},
  DUPLICATED_EMAIL: {isSuccess: false, code: 2301, message: '중복된 이메일입니다'},

  TOKEN_VERIFICATE_FAIL: {isSuccess: false, code: 3000, message: 'jwt 검증 실패'},

  NOT_EXIST_USER_INFO: {isSuccess: false, code: 3100, message: '회원 정보가 존재하지 않습니다'},

  NO_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '택배 내역이 없습니다'},
  NO_ROBBED_PACKAGE_LIST: {isSuccess: false, code: 3200, message: '도난 택배 내역이 없습니다'},

  INVALID_PACKAGE_IDX: {isSuccess: false, code: 3300, message: '존재하지 않는 productIdx입니다'},
  INVALID_SMART_API_KEY: {isSuccess: false, code: 3301, message: '유효하지 않은 스마트 택배 API KEY입니다'},
  INVALID_PACKAGE_INFO: {isSuccess: false, code: 3302, message: '유효하지 않은 운송장 번호 혹은 택배사 코드입니다. 택배 정보를 다시 확인해주세요'},
  INVALID_USER_IDX: {isSuccess: false, code: 3303, message: '존재하지 않는 userIdx입니다'},

  NO_AUTHORITY: {isSuccess: false, code: 3400, message: '권한이 없습니다'},

  CAN_NOT_CHANGE_ROBBED_PACKAGE_STATUS: {isSuccess: false, code: 3500, message: '도난 택배의 상태는 변경할 수 없습니다'},
  CAN_NOT_CHANGE_RECEIVED_PACKAGE_STATUS: {isSuccess: false, code: 3501, message: '이미 수령한 택배입니다'},

  DOES_NOT_EXIST_PACKAGE: {isSuccess: false, code: 3500, message: '존재하는 택배가 아닙니다'},
  NOT_STORAGED_PACKAGE: {isSuccess: false, code: 3500, message: 'DB에 등록된 택배가 아닙니다'},

  IS_ALREADY_CREATED_PACKAGE: {isSuccess: false, code: 3600, message: '이미 등록된 택배입니다'},
  IS_ALREADY_ROBBED_PACKAGE: {isSuccess: false, code: 3601, message: '이미 도난 처리한 택배입니다'},

  DB_ERROR: {isSuccess: false, code: 4000, message: 'DB 에러'},
}