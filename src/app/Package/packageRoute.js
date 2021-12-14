module.exports = function(app){
  const packageController = require('./packageController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  //택배 상세 조회 API
  app.get('/app/packages/:packageIdx', jwtMiddleware, packageController.getPackageDetail);
  
  //택배 도착 확인 화면 조회 API
  app.get('/app/packages', jwtMiddleware, packageController.getAllPackageList);

  //택배 분실 내역 화면 조회 API
  app.get('/app/robbed-packages', jwtMiddleware, packageController.getRobbedPackageList);

  //택배 수령 여부 변경 API
  app.patch('/app/packages/:packageIdx/status', jwtMiddleware, packageController.changePackageRecievedStatus);
}