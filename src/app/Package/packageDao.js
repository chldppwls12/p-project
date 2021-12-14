//전체 택배 내역
exports.getAllPackageList = async (connection, params) => {
  const query = `
  SELECT packageIdx,
        DATE_FORMAT(createdAt, '%Y.%m.%d. %k:%i:%s') as createdAt,
        companyCode,
        trackingNumber,
        imageUrl,
        IF(robbedAt is null, 'N', 'Y')                as isRobbed,
        IF(receivedAt is null, 'N', 'Y')                as isReceived
  FROM Package
  WHERE userIdx = ?
  ORDER BY packageIdx DESC;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//분실 택배 내역
exports.getRobbedPackageList = async (connection, params) => {
  const query = `
  SELECT packageIdx,
        DATE_FORMAT(robbedAt, '%Y.%m.%d. %k:%i:%s') as createdAt,
        companyCode,
        trackingNumber,
        robbedImageUrl
  FROM Package
  WHERE userIdx = ? && robbedAt IS NOT NULL
  ORDER BY packageIdx DESC;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//존재하는 productIdx인지
exports.isExistPackageIdx = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT packageIdx FROM Package
    WHERE packageIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//도난 택배인지
exports.isRobbedPackage = async (connection, params) => {
  const query = `
  SELECT IF(robbedAt IS NULL, 'N', 'Y') as isRobbed FROM Package
  WHERE packageIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isRobbed'];
}

//수령 여부 변경 권한 확인
exports.isUserPackage = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT * FROM Package
    WHERE userIdx = ? && packageIdx = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//현재 수령 여부 확인
exports.currentPackageStatus = async (connection, params) => {
  const query = `
  SELECT IF(receivedAt IS NULL, 'NOT_RECEIVIED', 'RECEIVIED') as status FROM Package
  WHERE packageIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['status'];
}

//수령 -> 수령 안함(receivedAt null처리)
exports.changeToNotReceived = async (connection, params) => {
  const query = `
  UPDATE Package
  SET receivedAt = NULL
  WHERE packageIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//수령 안함 -> 수령(receivedAt currenttime으로)
exports.changeToReceived = async (connection, params) => {
  const query = `
  UPDATE Package
  SET receivedAt = CURRENT_TIMESTAMP
  WHERE packageIdx = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//택배 상세 정보
exports.getPackageInfo = async (connection, packageIdx) => {
  const query = `
  SELECT imageUrl,
        trackingNumber,
        DATE_FORMAT(createdAt, '%Y.%m.%d. %k:%i:%s') as createdAt
  FROM Package
  WHERE packageIdx = ${packageIdx};
  `;
  const [rows] = await connection.query(query);
  return rows[0];
}