// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBJjMatGGVc-FBgq8PJRQiDTEqKlgH1enM',
  authDomain: 'masums-lms.firebaseapp.com',
  projectId: 'masums-lms',
  storageBucket: 'masums-lms.firebasestorage.app',
  messagingSenderId: '14933092901',
  appId: '1:14933092901:web:9eeb9079a9668ecae22dcc',
  measurementId: 'G-DBB1SFR9DE',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
