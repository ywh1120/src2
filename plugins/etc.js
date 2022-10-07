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


    apiKey: "AIzaSyA69_YhiaHQbLBoVzMtLEM4k1NK7awHYSY",
    
    
    authDomain: "exam-app-40a1f.firebaseapp.com",
    
    
    databaseURL: "https://exam-app-40a1f-default-rtdb.asia-southeast1.firebasedatabase.app",
    
    
    projectId: "exam-app-40a1f",
    
    
    storageBucket: "exam-app-40a1f.appspot.com",
    
    
    messagingSenderId: "283457636276",
    
    
    appId: "1:283457636276:web:c7b71c1f4e2d7c24ad54e1"
    
    
};
    
const app = initializeApp(firebaseConfig);
Vue.prototype.$db = getFirestore(app); 
//Vue.prototype.$db.settings({ timestampsInSnapshots: true }); 
