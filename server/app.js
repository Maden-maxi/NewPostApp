var express = require('express');
var app = express();
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var user = require('./routes/user');
var eo = require('./routes/eo');
//app config
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use( express.static( __dirname + '/../app' ) );
//routes
app.use('/user', user);
app.use('/eo', eo );
//app init
app.listen(config.get('port'));
console.log('Server is running on port http://localhost:'+config.get('port'));