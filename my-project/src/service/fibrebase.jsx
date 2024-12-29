// Firebase setup file: firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6_X2sfmJRIhNHAfOlYWpQ67yIvjBisCE",
  authDomain: "articlegenerate-4e259.firebaseapp.com",
  databaseURL: "https://articlegenerate-4e259-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "articlegenerate-4e259",
  storageBucket: "articlegenerate-4e259.firebasestorage.app",
  messagingSenderId: "916675271283",
  appId: "1:916675271283:web:0e72a5758110fafa86a806",
  measurementId: "G-HJFD94JGF5"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
