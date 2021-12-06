module.exports = function(app){
  const userController = require('./userController');
  
  //회원가입 API
  app.post('/app/signup', userController.createUserAccount);
}