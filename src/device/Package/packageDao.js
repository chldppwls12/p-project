//유효한 userIdx인지
exports.isExistUserIdx = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT * FROM User
    WHERE userIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//기존에 등록한 택배인지
exports.isAlreadyCreatedPackage = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT * FROM Package
    WHERE userIdx =? && trackingNumber = ? && companyCode = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//택배 정보 넣기
exports.createPackage = async (connection, params) => {
  const query = `
  INSERT INTO Package (userIdx, imageUrl, trackingNumber, companyCode)
  VALUES (?, ?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//존재하는 택배인지
exports.isExistPackage = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT * FROM Package
    WHERE trackingNumber = ? && companyCode =? ) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//이미 수령한 택배일 경우
exports.isReceivedPackage = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT * FROM Package
    WHERE trackingNumber = ? && companyCode =? && receivedAt IS NOT NULL) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//현재 도난 상태 확인
exports.currentPackageStatus = async (connection, params) => {
  const query = `
  SELECT IF(robbedAt IS NULL, 'NOT_ROBBED', 'ROBBED') as status FROM Package
  WHERE trackingNumber = ? && companyCode = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['status'];
}

//도난 -> 도난X으로 변경
exports.changeToNotRobbed = async (connection, params) => {
  const query = `
  UPDATE Package SET robbedAt = NULL, robbedImageUrl = NULL
  WHERE trackingNumber = ? && companyCode = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//도난X -> 도난으로 변경
exports.changeToTobbed = async (connection, params) => {
  const query = `
  UPDATE Package SET robbedAt = CURRENT_TIMESTAMP, robbedImageUrl = ?
  WHERE trackingNumber = ? && companyCode = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}