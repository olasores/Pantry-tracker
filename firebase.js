// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// add database 
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXo7uitz_UAheAN1hJGdjon0UUldNHTpE",
  authDomain: "inventory-management-sys-1dcfb.firebaseapp.com",
  projectId: "inventory-management-sys-1dcfb",
  storageBucket: "inventory-management-sys-1dcfb.appspot.com",
  messagingSenderId: "229031550090",
  appId: "1:229031550090:web:db0c335ac860fb10246173",
  measurementId: "G-7K6H4SWWWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}