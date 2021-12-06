//아이디 중복 확인
exports.isDuplicatedId = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT userIdx
    FROM User
    WHERE id = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//이메일 중복 확인
exports.isDuplicatedEmail = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT userIdx
    FROM User
    WHERE email = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//회원가입
exports.createUserAccount = async (connection, params) => {
  const query = `
  INSERT INTO User(id, name, password, address, phone, email)
  VALUES (?, ?, ?, ?, ?, ?);
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}

//존재하는 유저 정보인지
exports.isExistUser = async (connection, params) => {
  const query = `
  SELECT EXISTS(SELECT userIdx
    FROM User
    WHERE id = ? && password = ?) as isExist;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['isExist'];
}

//userIdx
exports.getUserIdx = async (connection, params) => {
  const query = `
  SELECT userIdx
  FROM User
  WHERE id = ? && password = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows[0]['userIdx'];
}