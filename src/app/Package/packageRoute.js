module.exports = function(app){
  const packageController = require('./packageController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');
  
  //택배 도착 확인 화면 조회 API
  app.get('/app/packages', jwtMiddleware, packageController.getAllPackageList);
}