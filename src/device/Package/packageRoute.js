module.exports = function(app){
  const packageController = require('./packageController');
  
  //택배 도착 처리 API
  app.post('/device/packages', packageController.createPackage);

  //택배 도난 여부 변경 API
  app.patch('/device/packages/status', packageController.changeRobbedStatus);
}