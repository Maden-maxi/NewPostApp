var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../schemas/user').User;

router.post('/create', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (err, product, numAffected) {
        if(err){
            res.status(400);
            console.log(err, product, numAffected);
            res.json(err);
            next();
        }else {
            res.status(201);
            res.send("Created");
        }
    });
});

router.post('/login', function (req, res, next) {
    var credentials = req.body;
    User.findOne({Email: credentials.email }, function (err, currentUser) {
        if(err) next();
        if(currentUser){
            if(currentUser.authenticate(credentials.password)){
                var user = currentUser.toJSON();
                var data = {
                    user: user,
                    cookie: {
                        authdate: crypto.createHmac( 'sha256', user.Email + user._id ).digest('hex'),
                        user_id: user._id
                    }
                };
                res.cookie(user._id, crypto.createHmac( 'sha256', user.Email + user._id ).digest('hex'), {
                    expires: new Date(Date.now() + 900000)
                });
                res.status(200);
                res.json(data);
            } else {
                res.status(401);
                var resErr = {
                    error: {
                        code: 0,
                        message: 'Невірний логін чи пароль'
                    }
                };
                res.json(resErr);
            }
        }
    });
});

module.exports = router;