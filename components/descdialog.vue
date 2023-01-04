<template>
    <v-dialog v-model="desc_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">검사명 추가/삭제</span> 
            </v-card-title> 
        <v-card-text> 
            <v-container> 
                <v-row> 
                    <v-col cols="12" sm="4"> 
                        <v-text-field 
                        v-model="add_desc"
                        label="검사명추가" 
                        required >
                        </v-text-field> 
                    </v-col> 
                    <v-col cols="12" sm="4"> 
                        <v-checkbox 
                        v-model="onehour_desc"
                        label="1시간검사"
                        false-value="N"
                        true-value="Y" 
                        required >
                        </v-checkbox> 
                    </v-col>
                    <v-col cols="12" sm="4"> 
                        <v-checkbox 
                        v-model="dup_deny"
                        label="동시불가"
                        false-value="N"
                        true-value="Y" 
                        required >
                        </v-checkbox> 
                    </v-col> 
                    <v-col cols="12">
                        <v-autocomplete 
                        v-model="selected_desc"
                        :items="desc_items" 
                        label="검사명" 
                        multiple >
                        </v-autocomplete> 
                    </v-col> 
                </v-row> 
                 
            </v-container>
        </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer> 
            <v-btn color="blue darken-1" text @click="desc_dialog = false" > 닫기 </v-btn> 
            <v-btn color="blue darken-1" text @click="desc_submit()" > 저장 </v-btn>
            <v-btn color="blue darken-1" text @click="desc_remove()" > 삭제 </v-btn>
            </v-card-actions> 
        </v-card> 
    </v-dialog>
</template>

<script>
import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc } from "firebase/firestore";

export default {
    data() { 
        return{
            tab:null,
            desc_dialog: false,
            add_desc:'',
            selected_desc:null,
            desc_items: [],
            //desc_items: [LSP,CSP,TLSP,Elbow,Knee,Foot-Ankle,Shoulder,Other],
            onehour_desc: '',
            dup_deny:'',
        }
    },
    mounted() {
        this.read_Desc();
    },
    methods: { 
        open(){
            this.desc_dialog = true;
        },
        async read_Desc() { 
            this.desc_items = [];
            const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                this.desc_items.push(get_data.desc);
                
            });

        },
        async desc_submit(){
            console.log(this.user_id, this.user_pass, this.user_auth);

            try {
                await setDoc(doc(this.$db, "description", this.add_desc), {
                    desc:this.add_desc,
                    onehour_desc:this.onehour_desc,
                    dup_deny:this.dup_deny
                });

                //console.log("Document written with ID: ", docRef.id);
                this.add_desc = '';
                this.desc_dialog = false;
                
                //this.$refs.sb.open('검사명 등록이 완료되었습니다.');
                this.read_Desc();
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        },
        desc_remove(){
            try{
                this.selected_desc.forEach(async (del_desc)=>{
                    await deleteDoc(doc(this.$db, "description", del_desc));
                });
                //await deleteDoc(doc(this.$db, "description", "DC"));
                this.desc_dialog = false;
                
                //this.$refs.sb.open('검사명 등록이 완료되었습니다.');
                this.read_Desc();
            }catch(e){

            }
        },
    }
}
</script>