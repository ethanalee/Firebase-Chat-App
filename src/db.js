import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// Get a Firestore instance
const db = firebase
  .initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_KEY_MESSAGING
  })
  .firestore()

const GeoPoint = firebase.firestore.GeoPoint
const TimeStamp = firebase.firestore.TimeStamp
const CurrentTime = firebase.firestore.FieldValue.serverTimestamp()
const FieldValue = firebase.firestore.FieldValue

const auth = {
  emailLogIn: (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(
        email,
        password
      )
  },
  emailSignup: (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
  },
  currentUser: () => {
    return firebase.auth().currentUser
  },
  logOut: () => {
    return firebase.auth().signOut()
  },
  socialLogin: () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase
      .auth()
      .signInWithPopup(provider)
  },
}

const storage = {
  root: () => {
    return firebase.storage()
  },
  images: (fileName) => {
    return firebase
      .storage().ref()
      .child(
        `/images/${fileName}`
      )
  }
}

export { db, storage, GeoPoint, TimeStamp, CurrentTime, auth, FieldValue }
