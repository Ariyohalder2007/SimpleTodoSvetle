// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ7cJxWUMgWNSuVao8JEztwBDazxuGPZM",
  authDomain: "nextfire-blogging-6a48e.firebaseapp.com",
  projectId: "nextfire-blogging-6a48e",
  storageBucket: "nextfire-blogging-6a48e.appspot.com",
  messagingSenderId: "244558484290",
  appId: "1:244558484290:web:a4c748f25e2ec2605a2edb",
  measurementId: "G-J3FV7Z6X8M",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
