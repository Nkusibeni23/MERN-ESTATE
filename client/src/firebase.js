// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYOElf75i1_z62gRCk6cycYTPWDeJKp1E",
  authDomain: "nkusiestate.firebaseapp.com",
  projectId: "nkusiestate",
  storageBucket: "nkusiestate.appspot.com",
  messagingSenderId: "45105395613",
  appId: "1:45105395613:web:4164789cb78491d8192174",
};
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
