// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh5nDwm2oBeLzSj0_yLoq2ye7JGPDN-NM",
  authDomain: "apcar-data.firebaseapp.com",
  projectId: "apcar-data",
  storageBucket: "apcar-data.appspot.com",
  messagingSenderId: "565515851566",
  appId: "1:565515851566:web:68892bec82a81e7951ccbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db , auth , app};