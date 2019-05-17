function initIndexSniped() {
    onSubmit();


    var data= [];
    function onSubmit() {
        data = document.getElementById('array_of_people').value;

        initSniped();
        if ('indexedDB' in window) {
            initDatabase(data);

            console.log('This browser support IndexedDB');
        }
        else {
            console.log('This browser doesn\'t support IndexedDB');
        }
    }



    // var dbPromise = idb.open

};

function initSniped() {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch(function (error) {
                console.log('Service Worker NOT Registered ' + error.message);
            });
    }

};

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




function initDatabase(data) {
    var db;

    var openRequest = indexedDB.open(SNIPED_DB_NAME, 1);

    openRequest.onupgradeneeded = function (e) {
        var db = e.target.result;
        console.log('running onupgradeneeded');
        if (!db.objectStoreNames.contains(SNIPED_STORE_PHOTOS)) {

            var uploadOS = db.createObjectStore(SNIPED_STORE_PHOTOS, {autoIncrement: true})

        }
    };
    openRequest.onsuccess = function (e) {
        console.log('running onsuccess');
        db = e.target.result;
        addItem();
    };
    openRequest.onerror = function (e) {
        console.log('onerror!');
        console.dir(e);
    };

    function addItem() {
        var transaction = db.transaction([SNIPED_STORE_PHOTOS], 'readwrite');
        var store = transaction.objectStore(SNIPED_STORE_PHOTOS);


        JSON.parse(data).forEach(function (obj) {

            var request = store.add(obj)

            request.onsuccess = function (e) {
                console.log('Woot! Did it');

            };


        });
    }
}
