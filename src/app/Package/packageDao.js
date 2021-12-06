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
  WHERE userIdx = 6
  ORDER BY packageIdx DESC;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
}