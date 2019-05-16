const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
var assert = require('assert')




/* Adds mongodb package */
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'com3504';

// Create a new MongoClient
const client = new MongoClient(url);

client.connect(function(err) {
    assert.equal(null, err);


    const db = client.db(dbName);
    const collection = db.collection('Users');
    // Database Name

    passport.serializeUser(function(user, done) {
        done(null, user);


    });


    passport.deserializeUser((id, done) => {
        collection.findOne({profileID:id}).then(user => {

            done(null, user);
        });
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: keys.googleClientID,
                clientSecret: keys.googleClientSecret,
                callbackURL: 'https://localhost:3001/auth/google/callback',
                proxy: true
            },
            (accessToken, refreshToken, profile, done) => {
                collection.findOne({ profileID: profile.id }).then(existingUser => {
                    if (existingUser) {
                        // we already have a record with the given profile ID
                        done(null, existingUser);
                    } else {
                        collection.insertOne({profileID: profile.id }, function(err, res) {
                            if (err) throw err;

                        });
                        done(null, {profileID: profile.id });

                    }
                });
            }
        )

    );

});
