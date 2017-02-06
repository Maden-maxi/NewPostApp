var fs = require('fs'),
    nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: __dirname + '/config.json' });
module.exports = nconf;
