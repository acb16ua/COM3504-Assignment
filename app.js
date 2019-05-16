var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const keys = require('./config/keys');
require('./services/passport');
const passport = require('passport');
var session  = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const cookieSession = require('cookie-session');

app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: ["asdf33g4w4hghjkuil8saef345"]
    })
);


app.use(require('cookie-parser')("mySecret"));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());



require('./routes/authRoutes')(app);

app.use(logger('dev'));




app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
