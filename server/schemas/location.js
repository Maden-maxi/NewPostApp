var db = require('../extensions/db');



var LocationSchema = new db.Schema({
    expressOverhead: [{
        type: db.Schema.Types.ObjectId,
        ref: 'ExpressOverhead'
    }],
    Width: Number,
    Height: Number,
    Length: Number,
    Volume: Number,
    Weight: Number
});

exports.Location = db.model('Location', LocationSchema);