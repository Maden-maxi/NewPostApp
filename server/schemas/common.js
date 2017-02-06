var countryCode = /(\+38|38)(\d+)/;
var commonTypes = {
    number: {
        type: Number
    },
    string: {
        type: String,
        trim: true
    },
    ref: {
        type: String,
        trim: true
        /*match: [/^([\w]{8})-([\w]{4})-([\w]{4})-([\w]{4})-([\w]{12})$/, 'Invalid Ref of property']*/
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email']
    },
    date: {
        type: Date,
        default: Date.now()
    }
};
commonTypes.requiredString = commonTypes.string;
commonTypes.requiredString.required = true;

commonTypes.requiredEmail = commonTypes.email;
commonTypes.requiredEmail.required = true;

commonTypes.refType = {
    Ref: commonTypes.ref,
    Description: commonTypes.string
};

module.exports = commonTypes;