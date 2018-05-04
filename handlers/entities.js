var db = require('../libs/mongoose');
var mongoose = require('mongoose');

var Data = require('../models/entities')(mongoose);

const oneHour = 3600000;
const oneDay = 86400000;
const oneWeek = 604800000000;

module.exports = call();
function call() {

    var requestTime = (req, res, next) => {
        req.requestTime = +new Date();
        next();
    }

    var saveToDb = (req, res) =>  {
        var data = new Data({
            power: req.body.power,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
            relay: req.body.relay,
            dt: req.requestTime
        });
        console.log("from esp " + data);
        data.save((err, data, affected) => { });
    }

    var hour = (req, res, next) => {
        req.period = oneHour;
        next();
    }

    var day = (req, res, next) => {
        req.period = oneDay;
        next();
    }

    var week = (req, res, next) => {
        req.period = oneWeek;
        next();
    }

    var getDocument = (req, res) => {
        console.log(req.period);
        Data.find({dt: {$gte: req.requestTime - req.period}}, (err, list) => {
            if(err) res.send(err);
            res.json(list);
            console.log(list);
        }).sort({$natural: -1});
    }

    var lastDoc = (req, res, next) => {
        Data.findOne().sort({$natural: -1}).limit(1).exec((err, doc) => {
            if(err) res.send(err);
            doc.toObject({getters: true});
            req.lastDoc = doc.dt;
            req.latestDoc = doc;
            console.log(req.lastDoc)
            next();
        });
    }

    var update = (req, res) => {
        Data.findOneAndUpdate(
            { dt: req.lastDoc },
            { $set: { relay: req.body.state } },
            { new: true },
            (err, list) => {
                if(err) console.log("err");
            });
        console.log(req.body.state);
    }

    var lastRelayState = (req, res, next) => {
        Data.findOne({dt: req.lastDoc}).exec((err, doc) => {
            if(err) res.send(err);
            doc.toObject({getters: true});
            req.lastRelayState = doc.relay;
            next();
        });
    }

    var checkRelay = (req, res) =>  {
        console.log(req.lastRelayState);
        res.json(req.lastRelayState);
    }

    return {
        requestTime: requestTime,
        saveToDb: saveToDb,
        hour: hour,
        day: day,
        week: week,
        getDocument: getDocument,
        lastDoc: lastDoc,
        update: update,
        lastRelayState: lastRelayState,
        checkRelay: checkRelay,
    }
}