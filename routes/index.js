var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sniped!' });
});

router.post('/profile', function (req, res, next) {
  var login = req.body.login;
  var password = req.body.password;


});

module.exports = router;
