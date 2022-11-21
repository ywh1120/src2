<template>
    <v-container> 
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 사용자등록하기 </v-card> 
            </v-col> 
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="user_dialog = true">등록</v-btn> </v-card> 
            </v-col>
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 시간표등록 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="time_dialog = true">등록</v-btn> </v-card> 
            </v-col>
        </v-row> 
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 검사명등록 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="desc_dialog = true">등록</v-btn> </v-card> 
            </v-col>
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 공자사항입력 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="notice_dialog = true">등록</v-btn> </v-card> 
            </v-col>
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > On Call Tab 입력 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="oct_dialog = true">등록</v-btn> </v-card> 
            </v-col>
        </v-row>

<v-snackbar v-model="snackbar" 
:timeout="snack_timeout" > {{ snack_text }} 
</v-snackbar>

<v-row justify="center">
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
                            type="password" 
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
    <v-dialog v-model="time_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">시간표 추가/삭제</span> 
            </v-card-title> 
        <v-card-text> 
        <v-container>
            <v-row class="mb-6" no-gutters >
                <v-col v-for="t_item in time_items" :key="t_item" >
                     <v-checkbox 
                     v-model="selected_time" 
                     :label="t_item" 
                     :value="t_item">
                     </v-checkbox>
                </v-col> 
            </v-row>
        </v-container>
        </v-card-text> 
        <v-card-actions> 
            <v-spacer></v-spacer> 
                <v-btn color="blue darken-1" text @click="time_dialog = false" > 닫기 </v-btn> 
                <v-btn color="blue darken-1" text @click="time_submit()" > 저장 </v-btn>
            </v-card-actions> 
        </v-card> 
    </v-dialog>
    <v-dialog v-model="desc_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">검사명 추가/삭제</span> 
            </v-card-title> 
        <v-card-text> 
            <v-container> 
                <v-row> 
                    <v-col cols="12" sm="6"> 
                        <v-text-field 
                        v-model="add_desc"
                        label="검사명추가" 
                        required >
                        </v-text-field> 
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
    <v-dialog v-model="notice_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">공지사항 입력</span> 
            </v-card-title> 
            <v-card-text> 
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col>
                            <v-textarea 
                            outlined label="공지사항 입력" 
                            v-model="notice_content" ></v-textarea>
                        </v-col> 
                    </v-row>
                    <v-row class="mb-6" no-gutters >
                        <v-col>
                            <v-checkbox 
                            outlined label="노출여부"
                            false-value="N"
                            true-value="Y" 
                            v-model="notice_onboard" ></v-checkbox>
                        </v-col> 
                    </v-row>
                </v-container>
            </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="notice_dialog = false" > 닫기 </v-btn> 
                <v-btn color="blue darken-1" text @click="notice_submit()" > 저장 </v-btn>
            </v-card-actions> 
        </v-card> 
    </v-dialog>
    <v-dialog v-model="oct_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">On Call Tab 입력</span> 
            </v-card-title> 
            <v-card-text> 
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col>
                            <v-textarea outlined label="On Call Tab 입력" v-model="oct_content" ></v-textarea>
                        </v-col> 
                    </v-row>
                </v-container>
            </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="oct_dialog = false" > 닫기 </v-btn> 
                <v-btn color="blue darken-1" text @click="oct_submit()" > 저장 </v-btn>
            </v-card-actions> 
        </v-card> 
    </v-dialog>
</v-row> 
</v-container>
</template>
<script>

import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc } from "firebase/firestore";
import dayjs from "dayjs";

export default {
    data() { 
        return {
            user_id:'',
            user_pass:'',
            user_auth: '', 
            user_dialog: false,
            time_dialog: false,
            desc_dialog: false,
            notice_dialog: false,
            oct_dialog:false,
            dialog: false,
            add_desc:'',
            selected_desc:null,
            desc_items: [],
            //desc_items: [LSP,CSP,TLSP,Elbow,Knee,Foot-Ankle,Shoulder,Other],
            time_items: ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
            selected_time: [],
            notice_content:'',
            notice_onboard:'',
            oct_content:'',
            authList: [ { name: '관리자', value: 'M'}, { name: '방사선사', value: 'R'},{ name: '외래 사용자', value: 'N'} ], 
            user_auth_rule: [ v => !!v || '권한은 필수 선택 사항입니다.' ],
            user_id_rule: [ v => !!v || '아이디는 필수 입력 사항입니다.' ],
            user_pass_rule: [ v => !!v || '패스워드는 필수 입력 사항입니다.' ],
            snackbar: false, 
            snack_text: '', 
            snack_timeout: 3000,
        } 
    }, 
    mounted() {
        if(this.$cookies.get('login').auth !== "M"){
            location.href = '/';
        }
        this.read_Desc();
        this.read_time();
        this.read_notice();
        this.read_oct();
    },
    methods: { 
        async user_Submit() { 
            console.log(this.user_id, this.user_pass, this.user_auth);
            try {
                await setDoc(doc(this.$db, "users", this.user_id), {
                    id: this.user_id,
                    pass: this.user_pass,
                    auth: this.user_auth
                });
                this.user_dialog = false;
                this.snack_text = '사용자 등록이 완료되었습니다.';
                this.user_snackbar = true;
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        },
        async desc_submit(){
            console.log(this.user_id, this.user_pass, this.user_auth);

            try {
                await setDoc(doc(this.$db, "description", this.add_desc), {
                    desc:this.add_desc
                });

                //console.log("Document written with ID: ", docRef.id);
                this.add_desc = '';
                this.desc_dialog = false;
                this.snack_text = '검사명 등록이 완료되었습니다.';
                this.snackbar = true;
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
                this.snack_text = '검사명 삭제가 완료되었습니다.';
                this.snackbar = true;
                this.read_Desc();
            }catch(e){

            }
        },
        async read_Desc() { 
            this.desc_items = [];
            const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                this.desc_items.push(get_data.desc);
                console.log(JSON.stringify(doc.data()));
            });

        },
        async read_time(){
            this.selected_time = [];
            const q = query(collection(this.$db,"time"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                let get_data = doc.data();
                if(get_data.use === 'Y'){
                    this.selected_time.push(get_data.time);
                }
            });
        },
        async read_notice(){
            try{
                const docSnap = await getDoc(doc(this.$db, "notice", "notice"));
                if(docSnap.exists){
                    const get_data = docSnap.data();
                    this.notice_content = get_data.notice;
                    this.notice_onboard = get_data.onboard;
                }
            }catch(e){

            }
        },
        async read_oct(){
            try{
                const docSnap = await getDoc(doc(this.$db, "oct", "oct"));
                if(docSnap.exists){
                    const get_data = docSnap.data();
                    this.oct_content = get_data.oct;
                }
            }catch(e){

            }
        },
        async notice_submit(){
            //const date = dayjs().format("YYYY-MM-DD"); 
            try {
                await setDoc(doc(this.$db, "notice", "notice"), {
                    notice:this.notice_content,
                    onboard:this.notice_onboard
                });

                //this.notice_content = '';
                this.notice_dialog = false;
                this.snack_text = '공지사항 등록이 완료되었습니다.';
                this.snackbar = true;

            } catch (e) {

            }
        },
        async oct_submit(){
            //const date = dayjs().format("YYYY-MM-DD"); 
            try {
                await setDoc(doc(this.$db, "oct", "oct"), {
                    oct:this.oct_content
                });

                //this.oct_content = '';
                this.oct_dialog = false;
                this.snack_text = 'On Call Tab 등록이 완료되었습니다.';
                this.snackbar = true;

            } catch (e) {

            }
        },
        time_submit(){
            try {
                this.time_items.forEach(async (this_time)=>{
                    let use_time='N';
                    this.selected_time.forEach((selt)=>{
                       if(selt === this_time){
                        use_time='Y';
                       } 
                    });
                    await setDoc(doc(this.$db, "time", this_time), {
                        time:this_time,
                        use:use_time
                    });
                });
                
                this.time_dialog = false;
                this.snack_text = '시간표 변경이 완료되었습니다.';
                this.snackbar = true;
                this.read_time();
            } catch {

            }
        }
    }
}
</script>