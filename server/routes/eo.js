var express = require('express');
var router = express.Router();
var EO = require('../schemas/express-overhead');
var ExpressOverhead = EO.ExpressOverhead;

router.post('/create', function (req, res, next) {
    var data = req.body;

    var expressOverhead = new ExpressOverhead(data);
    expressOverhead.save(function (err, product, numAffected) {
        console.log(product, numAffected);
        if (err) {
            res.status(400);
            res.json(err);
            next();
        } else {
            res.sendStatus(201);
        }
    });
});

router.get('/:idn', function (req, res, next) {

    ExpressOverhead
        .findOne( {IntDocNumber: req.params.idn}, function (err, doc) {
            if(err){
                res.status(500);
                res.json(err);
                next();
            }else{
                res.status(200);
                res.json(doc);
            }
        });
});

router.put('/:idn', function (req, res, next) {
    var data = req.body;
    ExpressOverhead
        .findOneAndUpdate(
            {"IntDocNumber": req.params.idn},
            data,
            {new: true},
            function (err, doc) {
                if(err){
                    res.status(500);
                    res.json(err);
                    next();
                }else{

                    res.status(200);
                    res.json(doc);

                }
            }
        )
});

router.delete('/:ref', function (req, res, next) {
    ExpressOverhead.
        where({Ref: req.params.ref}).findOneAndRemove(function (err, doc, result) {
            if(err || doc === null){
                res.status(500);
                res.json(err);
                next();
            }else{
               res.status(200);
                res.json(result);
            }
        });
});


module.exports = router;