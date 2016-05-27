var express = require('express');
var router = express.Router();
var expressSession = require('../node_modules/express-session');
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
   var room = req.session.room;
   var username = req.session.username;

   var mongoURI = "mongodb://localhost:27017/express";

   MongoClient.connect(mongoURI, function(err, db) {
	if(err) { return console.dir(err); }

	var roomRegex = '\\\"room\\\":\\\"' + room + '\\\"';
	var stream = db.collection('sessions').find({"session": new RegExp( roomRegex )},{session: 1});

	var roomUsers = [];

	stream.on("data", function(item) {
           var roomUser = JSON.parse(item.session).username;
           if( roomUser != username ) roomUsers.push( roomUser );
	});

	stream.on("end", function() {
           //console.log('roomUsers %o', roomUsers);
	   res.render('room', { room: room, username: username, roomUsers: roomUsers });
	});
   });

});

module.exports = router;

