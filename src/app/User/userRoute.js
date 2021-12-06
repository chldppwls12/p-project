module.exports = function(app){
  const userController = require('./userController');
  
  //회원가입 API
  app.post('/app/signup', userController.createUserAccount);

  //로그인 API
  app.post('/app/login', userController.login);
}