var mongoose = require('mongoose')
  , config = require('../../config')
  ;

// connect to mongoDB
mongoose.connect(config.mongo.url);

module.exports = true;
