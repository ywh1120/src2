import Vue from 'vue' 
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import http from '@/plugins/http'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID 
};
    
const app = initializeApp(firebaseConfig);
Vue.prototype.$db = getFirestore(app);
Vue.prototype.$http = http;