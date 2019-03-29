var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sniped!', login_is_correct: true });
});

router.post('/', function (req, res, next) {
  var login = req.body.login;
  var password = req.body.password;

});


/* GET home page. */
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Welcome back!', login_is_correct: true });
});

module.exports = router;
