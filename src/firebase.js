import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyBrmA79Ko3d13jpOReYCrKUryoLbtJELVI',
  authDomain: 'mynote-118af.firebaseapp.com',
  databaseURL: 'https://mynote-118af.firebaseio.com',
  projectId: 'mynote-118af',
  storageBucket: '',
  messagingSenderId: '486854107876',
  appId: '1:486854107876:web:8a5c97caa26edb2a',
}

firebase.initializeApp(config)

const db = firebase.firestore()

export {db}
export default firebase
