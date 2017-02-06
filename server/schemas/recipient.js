var db = require('../extensions/db');

var RecipientSchema = new db.Schema({
    expressOverhead: {
        type: db.Schema.Types.ObjectId,
        ref: 'ExpressOverhead'
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    MiddleName: {
        type: String
    },
    Phone: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
    },
    RecipientRef: String,
    CityRef: {
        type: String,
        required: true
    },
    CityName: {
        type: String,
        required: true
    },
    StreetRef: String,
    StreetName: String,
    AddressRef: {
        type: String,
        required: true
    },
    AddressDescription: {
        type: String,
        required: true
    },
    House: Number,
    Flat: Number,
    created: {
        type: Date,
        default: Date.now()
    }
});

exports.Recipient = db.model('Recipient', RecipientSchema);
