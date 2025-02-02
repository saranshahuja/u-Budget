// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3obRCSG9kyRL80iUPybWuH5Y-fMt8kGw",
  authDomain: "ubudget-2365f.firebaseapp.com",
  projectId: "ubudget-2365f",
  storageBucket: "ubudget-2365f.firebasestorage.app",
  messagingSenderId: "135084737072",
  appId: "1:135084737072:web:a91e09af68e4ead39d63f5",
  measurementId: "G-XG1WDMY7XH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, db, auth };


