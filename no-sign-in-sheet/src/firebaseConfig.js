import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
var config = {
    apiKey: "AIzaSyC9Os_I1RJe3ZIf0_0cDvxTzNzwff_kxJI",
    authDomain: "nosigninsheet.firebaseapp.com",
    databaseURL: "https://nosigninsheet.firebaseio.com",
    projectId: "nosigninsheet",
    storageBucket: "nosigninsheet.appspot.com",
    messagingSenderId: "239648283120"
};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
// const auth = firebase.auth();
// const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
//const usersCollection = db.collection('users')
//const postsCollection = db.collection('posts')

// export {
//     db,
//     auth,
//     currentUser
// }