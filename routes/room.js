var express = require('express');
var router = express.Router();
var expressSession = require('../node_modules/express-session');
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
   var room = req.session.room;
   var username = req.session.username;
   var roomsList = [];
   var roomUsers = [];
   var newRoomCreated = true;

   var mongoURI = "mongodb://localhost:27017/express";

   MongoClient.connect(mongoURI, function(err, db) {
	if(err) { return console.dir(err); }


	var roomsStream = db.collection('rooms').find();
	roomsStream.on("data", function(item) {
           if(item._id != '' && item._id != room) roomsList.push( item._id );
	   if(item._id == room) newRoomCreated = false;
        });

	var roomRegex = '\\\"room\\\":\\\"' + room + '\\\"';
	var stream = db.collection('sessions').find({"session": new RegExp( roomRegex )},{session: 1});

	stream.on("data", function(item) {
           var roomUser = JSON.parse(item.session).username;
           if( roomUser != username ) roomUsers.push( roomUser );
	});

	stream.on("end", function() {
           res.render('room', { room: room, username: username, roomUsers: roomUsers, roomsList: roomsList, newRoom: newRoomCreated });
	});

   });

});

module.exports = router;

