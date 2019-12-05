var config = {
    apiKey: "AIzaSyCi_qF-T7sFEpMYLW5qYwExLNw2rxugC2c",
    authDomain: "outfitter-c1ea7.firebaseapp.com",
    databaseURL: "https://outfitter-c1ea7.firebaseio.com",
    projectId: "outfitter-c1ea7",
    storageBucket: "outfitter-c1ea7.appspot.com",
        messagingSenderId: "634298127988"
};
firebase.initializeApp(config);
var db = firebase.firestore()
var userid;

const firestore = firebase.firestore();
const settings = {
    /* your settings... */
    timestampsInSnapshots: true
};
firestore.settings(settings);

var saveOutfit = function (canvas, color, occasion) {
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    if (canvas.toBlob) {
        canvas.toBlob(
            function (blob) {
                blob.name = uuidv4()
                var data = {
                    type: "outfit",
                    // color: color,
                    // occasion: occasion
                }
                firebasePost("outfit", userid, blob, data);
            },
            'image/jpeg'
        );
    }
}
var firebaseDelete = function (table, docId,storage,cb) {
    // Create a reference to the file to delete
    var storageRef = firebase.storage().ref(storage);
    // Delete the file
    storageRef.delete().then(function () {
        db.collection(`${table}`).doc(docId).delete().then(function () {
            console.log("Document successfully deleted!");
            cb
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }).catch(function (error) {
       console.log(error)
    });
    
}
var firebasePost = function (table, userid, file, data) {
    var storageRef = firebase.storage().ref(`/${userid.uid}/${table}/${file.name}`);
    var uploadTask = storageRef.put(file);
    console.log(file)
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            db.collection(`${table}`).add({
                    user: userid.uid,
                    type: data.type,
                    // occassion: data.occasion,
                    // color: data.color,
                    img_url: downloadURL,
                    img_ref: `/${userid.uid}/${table}/${file.name}`
                })
                .then(function () {
                    M.toast({html: 'Saved!'})
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        });
    });
}
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        userid = user;
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    if (user == undefined) {
        if (window.location.pathname !== "/") {
            sessionStorage.removeItem('user');
            window.location = "/"
        }
    }
});
var login = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in userid info.
        userid = result.user;
        window.location = "/add-clothing";
    }).catch(function (error) {
        // Handle Errors here.
        if (error.code === 'auth/account-exists-with-different-credential') {
            // Step 2.
            // userid's email already exists.
            // The pending Google credential.
            var pendingCred = error.credential;
            // The provider account's email address.
            var email = error.email;
            // Get sign-in methods for this email.
            auth.fetchSignInMethodsForEmail(email).then(function (methods) {
                // Step 3.
                // If the userid has several sign-in methods,
                // the first method in the list will be the "recommended" method to use.
                if (methods[0] === 'password') {
                    // Asks the userid his password.
                    // In real scenario, you should handle this asynchronously.
                    var password = promptuseridForPassword(); // TODO: implement promptuseridForPassword.
                    auth.signInWithEmailAndPassword(email, password).then(function (userid) {
                        // Step 4a.
                        return userid.link(pendingCred);
                    }).then(function () {
                        // Google account successfully linked to the existing Firebase userid.
                        goToApp();
                    });
                    return;
                }
                // All the other cases are external providers.
                // Construct provider object for that provider.
                // TODO: implement getProviderForProviderId.
                var provider = getProviderForProviderId(methods[0]);
                // At this point, you should let the userid know that he already has an account
                // but with a different provider, and let him validate the fact he wants to
                // sign in with this provider.
                // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                // so in real scenario you should ask the userid to click on a "continue" button
                // that will trigger the signInWithPopup.
                auth.signInWithPopup(provider).then(function (result) {
                    // Remember that the userid may have signed in with an account that has a different email
                    // address than the first one. This can happen as Firebase doesn't control the provider's
                    // sign in flow and the userid is free to login using whichever account he owns.
                    // Step 4b.
                    // Link to Google credential.
                    // As we have access to the pending credential, we can directly call the link method.
                    result.userid.linkAndRetrieveDataWithCredential(pendingCred).then(function (useridcred) {
                        // Google account successfully linked to the existing Firebase userid.
                        goToApp();
                    });
                });
            });
        }
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the userid's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    })
};

var demo = function (){
    var email = "gokartdemo@gmail.com"
    var pass = "gokart"
    var auth = firebase.auth()
    auth.signInWithEmailAndPassword(email, pass)
        .then(function (result) {
            userid = result.user;
            window.location = "/add-clothing";
        })
        .catch(function (err) {console.log(err)});
}

var signout = function () {
    firebase.auth().signOut().then(function () {
        userid = undefined;
        window.location = "/";
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}