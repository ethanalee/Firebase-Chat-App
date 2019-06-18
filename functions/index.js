const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const functions = require('firebase-functions');

const db = firebase
  .initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: "chat-client-45af6",
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_KEY_MESSAGING
  })
  .firestore()

const CurrentTime = firebase.firestore.FieldValue.serverTimestamp()
const TimeStamp = firebase.firestore.TimeStamp

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateConversation = functions.firestore.document('messages/{messageId}').onWrite( (change, context) => {
    const messageData = change.after.exists ? change.after.data() : null;

    convoRef = db.collection('conversations')

    convoRef.doc(messageData.conversation).set({
        lastModified: CurrentTime
    },{
        merge: true
    })
})

