module.exports = function(app){
  const userController = require('./userController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');
  
  //회원가입 API
  app.post('/app/signup', userController.createUserAccount);

  //로그인 API
  app.post('/app/login', userController.login);

  //회원 정보 조회 API
  app.get('/app/user', jwtMiddleware, userController.getUserInfo);

  //회원 정보 수정 API
  app.patch('/app/user', jwtMiddleware, userController.updateUserInfo);
}