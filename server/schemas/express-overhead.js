var db = require('../extensions/db');
var commonTypes = require('./common');

var LocationSchema = new db.Schema({
    volumetricWidth: commonTypes.number,
    volumetricHeight: commonTypes.number,
    volumetricLength: commonTypes.number,
    volumetricVolume: commonTypes.number,
    weight: commonTypes.number
});

var RecipientSchema = new db.Schema({
    FirstName: commonTypes.requiredString,
    LastName: commonTypes.requiredString,
    MiddleName: String,
    Phone: commonTypes.phone,
    Email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
    },
    ContactPerson: db.Schema.Types.Mixed,
    City: db.Schema.Types.Mixed,
    Street: db.Schema.Types.Mixed,
    Address: db.Schema.Types.Mixed,
    House: String,
    Flat: String,
    created: commonTypes.date
});

var ExpressOverheadSchema = new db.Schema({
    _creator: {
        type: db.Schema.Types.ObjectId,
        ref: 'User'
    },
    Ref: commonTypes.ref,
    CostOnSite: commonTypes.number,
    EstimatedDeliveryDate: commonTypes.requiredString,
    IntDocNumber: commonTypes.requiredString,
    TypeDocument: commonTypes.requiredString,
    recipient: RecipientSchema,
    locations: [LocationSchema],
    CargoType: commonTypes.refType,
    ServiceType: commonTypes.refType,
    Description: commonTypes.requiredString,
    Cost: commonTypes.number,
    TypeOfPayer: commonTypes.refType,
    TypeOfPayerForRedelivery: commonTypes.refType,
    DateTime: commonTypes.date,
    created: commonTypes.date
});

exports.ExpressOverhead = db.model('ExpressOverhead', ExpressOverheadSchema);
exports.Recipient = db.model('Recipient', RecipientSchema);
exports.Location = db.model('Location', LocationSchema);