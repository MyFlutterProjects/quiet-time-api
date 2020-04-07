module.exports = function(app) {
var devotion = require('../controller/devotion.controller.js');
const authJwt = require('./verifyJwtToken');
      // devotion 
  app.post('/api/devotion', [authJwt.verifyToken], devotion.createDevotion);

  app.get('/api/devotion', [authJwt.verifyToken], devotion.getDevotions);

  app.get('/api/devotion/user/:userId', [authJwt.verifyToken], devotion.findByUserId);

  app.put('/api/devotion/:devotionId', [authJwt.verifyToken], devotion.update);


}