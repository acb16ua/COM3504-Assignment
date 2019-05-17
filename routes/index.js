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

function searchMongoToIndex(eventSearch) {


    /* Adds mongodb package */
    const MongoClient = require('mongodb').MongoClient;

// Connection URL
    const url = 'mongodb://localhost:27017';

// Database Name
    const dbName = 'com3504';


// Create a new MongoClient
    const client = new MongoClient(url);
    client.connect(function(err) {
        if (err) {
            // handle errors
        } else {
            // use db here

            const db = client.db(dbName);
            const collection = db.collection('upload');
            // existingUser = collection.find({profileID:ProfileID})
            var eventName = eventSearch;

            collection.find({'event':new RegExp(eventName)}).toArray(function(err, result) {
                if (err){ throw err}else{
                    console.log(result);

                    // Result is the ouput of the search term for events
                };


            });

        };
    });

    // The function returns the product of p1 and p2
};


function userProfileMongoToIndex(ProfileID) {


    /* Adds mongodb package */
    const MongoClient = require('mongodb').MongoClient;

// Connection URL
    const url = 'mongodb://localhost:27017';

// Database Name
    const dbName = 'com3504';


// Create a new MongoClient
    const client = new MongoClient(url);
    client.connect(function(err) {
        if (err) {
            // handle errors
        } else {
            // use db here

        const db = client.db(dbName);
        const collection = db.collection('upload');
        // existingUser = collection.find({profileID:ProfileID})
        var userName = ProfileID;

        collection.find({'profileID':userName}).toArray(function(err, result) {
            if (err){ throw err}else{
                //console.log(result);

                // Result is an array of json. add it to indexdb.

            };


        });

    };
    });

       // The function returns the product of p1 and p2
};

router.post('/logout', (req, res) => {
    req.logout();
    req.session.user = null
    res.redirect("/");
});

router.get('/profile', function(req, res){
    userProfileMongoToIndex("109272662587431712473");
    if(req.session.user == null){res.redirect("/");};
    console.log(req.session.profileID);
    profileID = req.session.user;
    console.log(profileID.Image);

    res.render('profile', { user: req.user, title: 'Welcome back!',DisplayName:profileID.displayName,image : profileID.Image, searchPhotos:""});

});

router.post('/profile', function(req, res) {

    searchMongoToIndex(req.body.searchInput.toLowerCase());
    //get indeximages from indexed db
    test = [{"imagePath":"public/uploads/photo-1558014347932.jpg","profileID":"109272662587431712473","event":"glasto","comment":"This is glasto","location":"","dateTime":"06/12/9412:15"}]
    //update images
    allPhotos = "";
    // for each photo in array append it to html

    test.forEach(function(obj) {console.log(obj.imagePath.slice(7).slice(0, -4));
        var photos = "      <div class=\"thumb_images col-md-4\">\n" +
            "\n" +
            "                    <a href=\"#image1\" data-toggle=\"modal\" data-target=\"#image1\">\n" +
            "                    <img class=\"card-img-top\"\n" +
            "                         data-src=\"holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail\"\n" +
            "                         alt=\"Thumbnail [100%x225]\" style=\"height: 225px; width: 100%; display: block;\"\n" +
            "                         src=" +
            "\"" +
            "uploads/photo-1558014347932" +
            "\"\n" +
            "                         data-holder-rendered=\"true\"></a>\n" +
            "\n" +
            "                </div>\n";
        allPhotos+= photos;
    });


    res.render('profile', {user: req.user, title: 'Welcome back!',DisplayName:profileID.displayName,image :profileID.Image, searchPhotos: allPhotos});



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

