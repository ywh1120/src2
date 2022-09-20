<template> 
    <v-card> 
        <v-card-text> 
            <v-textarea v-model="txt" /> 
        </v-card-text> 
        <v-card-actions> 
            <v-btn @click="write">write</v-btn> 
            <v-btn @click="read">read</v-btn> 
            </v-card-actions> 
    </v-card> 
</template>
<script> 
    import { initializeApp } from "firebase/app";
    import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";

    // TODO: Replace the following with your app's Firebase project configuration
    // See: https://firebase.google.com/docs/web/learn-more#config-object
    const firebaseConfig = {
        apiKey: "AIzaSyA69_YhiaHQbLBoVzMtLEM4k1NK7awHYSY",
        authDomain: "exam-app-40a1f.firebaseapp.com",
        databaseURL: "https://exam-app-40a1f-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "exam-app-40a1f",
        storageBucket: "exam-app-40a1f.appspot.com",
        messagingSenderId: "283457636276",
        appId: "1:283457636276:web:c7b71c1f4e2d7c24ad54e1"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    export default { 
        data() { 
            return { 
                txt: ''
            } 
        }, 
        mounted() { 
            
            
        }, 
        methods: { 
                async write() { 
                   try {
                    const docRef = await addDoc(collection(db, "users"), {
                        first: "Alan",
                        middle: "Mathison",
                        last: "Turing",
                        born: 1912
                    });
                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }, 
                async read() {  
                    const querySnapshot = await getDocs(collection(db, "users"));
                    querySnapshot.forEach((doc) => {
                        this.txt = JSON.stringify(doc.data())
                        console.log(`${doc.id} => ${doc.data()}`);
                    });
                } 
            } 
    }
</script>