var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer({dest: 'private/uploads'});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sniped!', login_is_correct: true });
});

/* POST login info. */
router.post('/', function (req, res, next) {
  var login = req.body.login;
  var password = req.body.password;

});


/* GET profile page. */
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Welcome back!', login_is_correct: true });
});

/* POST event image. */
router.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});


module.exports = router;
