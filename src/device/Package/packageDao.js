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