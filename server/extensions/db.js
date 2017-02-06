var conf = require('../config');
var db = require('mongoose');
db.connect(conf.get('db-connection'));
module.exports = db;