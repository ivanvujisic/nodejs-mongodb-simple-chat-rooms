var express = require('express');
var router = express.Router();
var expressSession = require('../node_modules/express-session');
var MongoClient = require('mongodb').MongoClient;
var mongoURI = "mongodb://localhost:27017/express";

router.get('/', function(req, res, next) {
   MongoClient.connect(mongoURI, function(err, db) {
        if(err) { return console.dir(err); }

	var roomsList = [];
	var stream = db.collection('rooms').find({},{_id:1})

        stream.on("data", function(item) {
           if(item._id != '') roomsList.push(item._id);
        });

        stream.on("end", function() {
           res.render('index', { rooms: roomsList});
        });
   });
});

module.exports = router;

