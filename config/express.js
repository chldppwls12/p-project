const express = require('express');
const compression = require('compression');
const cors = require('cors');

require('dotenv').config();

module.exports = function(){
  const app = express();

  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cors());

  require('../src/app/User/userRoute')(app);

  require('../src/app/Package/packageRoute')(app);
  require('../src/device/Package/packageRoute')(app);

  return app;
}