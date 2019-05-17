var express = require('express');
var router = express.Router();
var assert = require('assert');
var profileID ="";
const multer = require('multer');


/* Adds mongodb package */
const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'com3504';

// Create a new MongoClient
const client = new MongoClient(url);


/* Renames Multer file upload with dile name and data */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});


var upload = multer({storage: storage});



/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.user != null){res.redirect("/profile");};
  res.render('index', { title: 'Sniped!' });
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session.user = null
    res.redirect("/");
});

router.get('/profile', function(req, res){

    if(req.session.user == null){res.redirect("/");};
    console.log(req.session.profileID);
    profileID = req.session.user;

    res.render('profile', { user: req.user, title: 'Welcome back!',DisplayName:profileID.displayName,image :profileID.Image});
});


/* POST event image. */
router.post('/upload', upload.single('photo'), (req, res, next) => {
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        insertDocuments(db, ('public/uploads/' + req.file.filename +'.jpg'), () => {
            res.json({'message': 'File uploaded successfully'});
        });
    });
});
module.exports = router;

/* Function to inset one file to upload collection */
const insertDocuments = function(db,filePath, callback) {
    // Get the documents collection
    const collection = db.collection('upload');
    // Insert some documents
    collection.insertOne({'imagePath':filePath, 'profileID': profileID.profileID}, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
}


/* GET profile page. */
router.get('/map_test', function(req, res, next) {
    res.render('map_test', { title: 'MAPSMAPSMAPS', login_is_correct: true });
});

/* GET profile page. */
router.get('/map_location', function(req, res, next) {
    res.render('map_location', { title: 'MAPSMAPSMAPS', login_is_correct: true });
});

