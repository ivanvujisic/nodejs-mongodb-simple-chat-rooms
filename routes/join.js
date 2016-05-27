var express = require('express');
var router = express.Router();
var expressSession = require('../node_modules/express-session');
var UAParser = require('../node_modules/ua-parser-js');
var uuid = require('../node_modules/node-uuid');


router.get('/', function(req, res, next) {
   var parser = new UAParser();
   var ua = req.headers['user-agent'];
   var browserName = parser.setUA(ua).getBrowser().name;
   var fullBrowserVersion = parser.setUA(ua).getBrowser().version;

   var uid  = req.session.username = browserName + '-' + uuid.v4().substring(0,8);
   var room = /\/\?room=(\d+)$/.exec(req.url);
   room = req.session.room = (room !== null ) ? room[1] : 1;

   console.log('req.session: %o',req.session);

   res.redirect('/room');
});

module.exports = router;

