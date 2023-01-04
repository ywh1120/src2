<template>
<v-dialog v-model="user_dialog" persistent max-width="600px" > 
        
    <v-card>
        <v-card-title> 
                <span class="text-h5">사용자 등록</span> 
        </v-card-title> 
        <v-card-text> 
            <v-container> 
                <v-row> 
                    <v-col cols="12"> 
                        <v-text-field 
                        v-model="user_id" 
                        label="아이디*"
                        :rules="user_id_rule" 
                        required >
                        </v-text-field> 
                    </v-col>  
                    <v-col cols="12"> 
                        <v-text-field
                        v-model="user_pass" 
                        label="패스워드*"
                        :rules="user_pass_rule"
                        
                        required >
                        </v-text-field> 
                    </v-col> 
                    <v-col cols="12" sm="6" >
                        <v-select 
                        v-model="user_auth" 
                        label="권한*" 
                        :items="authList" 
                        item-text="name" 
                        item-value="value" 
                        :rules="user_auth_rule" > 
                        </v-select>  
                    </v-col>
                     
                </v-row> 
                         
                <small>*별표시는 필수값입니다.</small> 
            </v-container>
        </v-card-text> 
        <v-card-actions> 
            <v-spacer></v-spacer> 
            <v-btn color="blue darken-1" text @click="user_dialog = false" > 닫기 </v-btn> 
            <v-btn color="blue darken-1" text @click="user_Submit()" > 저장 </v-btn>
        </v-card-actions> 
    </v-card> 
</v-dialog>

</template>

<script>
import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc } from "firebase/firestore";

export default {
    data() { 
        return{
            user_id:'',
            user_pass:'',
            user_auth: '', 
            user_data:[],
            user_dialog: false,
            authList: [ { name: '관리자', value: 'M'}, { name: '방사선사', value: 'R'},{ name: '외래 사용자', value: 'N'},{ name: '일반 사용자', value: 'U'} ], 
            user_auth_rule: [ v => !!v || '권한은 필수 선택 사항입니다.' ],
            user_id_rule: [ v => !!v || '아이디는 필수 입력 사항입니다.' ],
            user_pass_rule: [ v => !!v || '패스워드는 필수 입력 사항입니다.' ],
        }
    },
    mounted() {
        
    },
    methods: { 
        open(){
            
            this.user_dialog = true;
            
        },
        
        async user_Submit() { 
            console.log(this.user_id, this.user_pass, this.user_auth);
            try {
                await setDoc(doc(this.$db, "users", this.user_id), {
                    id: this.user_id,
                    pass: this.user_pass,
                    auth: this.user_auth
                });
                this.user_dialog = false;

                //this.$refs.sb.open('사용자 등록이 완료되었습니다.');
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    }
}
</script>