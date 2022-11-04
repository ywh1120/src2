import Vue from 'vue' 
import moment from 'moment' 
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";

Vue.prototype.$moment = moment 

//const firebaseConfig = { 
  //  FIREBASE_APIKEY: process.env.apiKey, 
    //FIREBASE_AUTHDOMAIN: process.env.authDomain, 
  //  FIREBASE_PROJECTID: process.env.projectId, 
  //  FIREBASE_STORAGEBUCKET: process.env.storageBucket,
  //  FIREBASE_MESSAGINGSENDERID: process.env.messagingSenderId, 
  //  FIREBASE_APPID: process.env.appId, 
  //  FIREBASE_MEASURMENTID: process.env.measurementId
//}

const firebaseConfig = {
  apiKey: "AIzaSyAd6rbFa_UtzUxK8wKeVf33XyEll2YdJr8",
  authDomain: "firetest-6d7c0.firebaseapp.com",
  projectId: "firetest-6d7c0",
  storageBucket: "firetest-6d7c0.appspot.com",
  messagingSenderId: "349760030860",
  appId: "1:349760030860:web:27d14af7d3bf0e80bb13a9"  
};
    
const app = initializeApp(firebaseConfig);
Vue.prototype.$db = getFirestore(app); 
//Vue.prototype.$db.settings({ timestampsInSnapshots: true }); 
