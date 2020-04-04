const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {
  const controller = require('../controller/controller.js');

  app.post('/api/auth/signup',[verifySignUp.checkForAllRequiredField, verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRoleExisted], controller.signup );

  app.post('/api/auth/signin', controller.signin);
  
  // return the current user data
  app.get('/api/user', [authJwt.verifyToken], controller.userContent);

  app.get('/api/user/allUsers', [authJwt.verifyToken, authJwt.isManagerOrAdmin], controller.getAllUsers);

  app.get('/api/user/manager', [authJwt.verifyToken, authJwt.isManagerOrAdmin], controller.managementBoard);

  app.get('/api/user/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
  
  // update user details
  app.put('/api/user/:userId', [authJwt.verifyToken], controller.updateUser);

  // devotion 
  app.post('/api/devotion', [authJwt.verifyToken], controller.createDevotion);

  app.get('/api/devotion', [authJwt.verifyToken], controller.getDevotions);

}
