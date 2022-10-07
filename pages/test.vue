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
    import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";
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
                    const docRef = await addDoc(collection(this.$db, "users"), {
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
                    const querySnapshot = await getDocs(collection(this.$db, "users"));
                    querySnapshot.forEach((doc) => {
                        this.txt = JSON.stringify(doc.data())
                        console.log(`${doc.id} => ${doc.data()}`);
                    });
                } 
            } 
    }
</script>