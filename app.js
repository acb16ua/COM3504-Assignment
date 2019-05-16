var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const keys = require('./config/keys');
require('./services/passport');
const passport = require('passport');
var session  = require('express-session');

function Setup(){



    var json1 = [
        {"imagePath":"public/uploads/photo-1558014347932.jpg","profileID":"109272662587431712473","event":"Glasto","comment":"This is glasto","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014355718.jpg","profileID":"109272662587431712473","event":"Cohella","comment":"This is Cohella","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014361498.jpg","profileID":"109272662587431712473","event":"Leeds fest","comment":"This is Leeds fest","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014368686.jpg","profileID":"109272662587431712473","event":"Wireless","comment":"This is Wireless","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014377366.jpg","profileID":"109272662587431712473","event":"Woo Hah0","comment":"This is Woo Hah0","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014383941.jpg","profileID":"109272662587431712473","event":"Reading","comment":"This is Reading","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014390268.jpg","profileID":"109272662587431712473","event":"Londom fest","comment":"This is Londom","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014400975.jpg","profileID":"109272662587431712473","event":"Tramlines","comment":"This is Tramlines","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014407541.jpg","profileID":"109272662587431712473","event":"Didsbury fest","comment":"This is Didsbury","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014414354.jpg","profileID":"109272662587431712473","event":"Junaids world","comment":"This is Junaids","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014420321.jpg","profileID":"109272662587431712473","event":"Outlook","comment":"This is glasto","location":"Outlook","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014427095.jpg","profileID":"109272662587431712473","event":"Social club","comment":"This is Social","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014434752.jpg","profileID":"109272662587431712473","event":"Manchesr academy","comment":"This is Manchesr","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014441701.jpg","profileID":"109272662587431712473","event":"Birmingham disco","comment":"This is disco","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014449385.jpg","profileID":"109272662587431712473","event":"New york party","comment":"This is york","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014459099.jpg","profileID":"109272662587431712473","event":"Japan party","comment":"This is Japan","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014466729.jpg","profileID":"109272662587431712473","event":"Glasto v2","comment":"This is v2","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014480929.jpg","profileID":"109272662587431712473","event":"Austrila partyier","comment":"This is partyier","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014487491.jpg","profileID":"109272662587431712473","event":"India festival","comment":"This is India","location":"","dateTime":"06/12/9412:15"},
        {"imagePath":"public/uploads/photo-1558014496801.jpg","profileID":"109272662587431712473","event":"Last festival location","comment":"This is Last","location":"","dateTime":"06/12/9412:15"}
    ]

    /* Adds mongodb package */
    const MongoClient = require('mongodb').MongoClient;

// Connection URL
     const url = 'mongodb://localhost:27017';

// Database Name
    const dbName = 'com3504';


// Create a new MongoClient
    const client = new MongoClient(url);
    client.connect(function(err) {
        const db = client.db(dbName);
        const collection = db.collection('upload');

        collection.findOne( json1[0] ).then(existingUser => {
            if (existingUser) {
                // we already have a record with the given profile ID
                console.log("Already inital")
            } else {
                collection.insert(json1 , function(err, res) {
            if (err) throw err;

            });

            };
        });
    });

};
Setup();



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


