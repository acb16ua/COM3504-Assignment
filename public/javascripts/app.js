function initSniped() {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() {
                console.log('Service Worker Registered');
            })
            .catch(function(error) {
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }

    //check for indexeddb support
    if ('indexedDB' in window) {
        initDatabase();
        console.log('This browser support IndexedDB');
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    // var dbPromise = idb.open
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}


var dbPromise;

const SNIPED_DB_NAME =  'db_sniped_1';
const SNIPED_STORE_USERS = 'users';
const SNIPED_STORE_PHOTOS = 'uploads';


var imagesInital = [
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



function initDatabase() {
    console.log('checkcheckchekccc')
    dbPromise = idb.openDb(SNIPED_DB_NAME, 1, function (upgradeDb) {

        // if (!upgradeDb.objectStoreNames.contains(SNIPED_STORE_USERS)) {
        //     var userOS = upgradeDb.createObjectStore(SNIPED_STORE_USERS, {keyPath: 'profileId'});
        //     userOS.createIndex('displayName', 'displayName', {unique: false, multiEntry: true});
        // }
        if (!upgradeDb.objectStoreNames.contains(SNIPED_STORE_PHOTOS)) {
            var uploadOS = upgradeDb.createObjectStore(SNIPED_STORE_PHOTOS, {autoIncrement: true});
            uploadOS.createIndex('imagePath', 'imagePath', {unique: false, multiEntry: true});
            uploadOS.createIndex('profileId', 'profileId', {unique: false, multiEntry: true});
            uploadOS.createIndex('event', 'event', {unique: false, multiEntry: true});
            uploadOS.createIndex('comment', 'comment', {unique: false, multiEntry: true});
            uploadOS.createIndex('location', 'location', {unique: false, multiEntry: true});
            uploadOS.createIndex('dateTime', 'dateTime', {unique: false, multiEntry: true});
        }

        addItem();

        // if (dbPromise) {
        //     dbPromise.then(async db => {
        //         var tx = db.transaction(uploadOS, 'readwrite');
        //         var store = tx.objectStore(uploadOS);
        //         await store.put(imagesInital);
        //         return tx.complete;
        //     }).then(function() {
        //         console.log('added item to the store! '+ JSON.stringify(data));
        //     });
        // }

    });

    db = dbPromise.result;

    function addItem() {
        var transaction = db.transaction([SNIPED_STORE_PHOTOS], 'readwrite');
        var store = transaction.objectStore(SNIPED_STORE_PHOTOS);
        var item = {
            imagePath: "public/uploads/photo-1558014347932.jpg",
            profileId: "109272662587431712473",
            event: "Glasto",
            comment: "This is glasto",
            location: "",
            dateTime: "06/12/9412:15"
        };

        var request = store.add(item)

        request.onsuccess = function(e) {
            console.log('Woot! Did it');
        };

    }



}


