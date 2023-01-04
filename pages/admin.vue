<template>
    <v-container> 
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 사용자등록하기 </v-card> 
            </v-col> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 
                    <v-btn @click="useropen()">등록</v-btn> <v-btn @click="userviewopen()">보기</v-btn>
                </v-card> 
            </v-col>
            
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 시간표등록 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="timeopen()">등록</v-btn> </v-card> 
            </v-col>
        </v-row> 
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 검사명등록 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="descopen()">등록</v-btn> </v-card> 
            </v-col>
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 공지사항입력 </v-card> 
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
        <snackbar ref="sb" />
<v-row justify="center">
    <userdialog ref="ud"/>
    <timetabs ref="tt" />
    <descdialog ref="dd" />

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
    <v-dialog v-model="user_view_dialog" persistent max-width="600px">
        <v-card>
            <v-card-title> 
                <span class="text-h5">사용자 명단</span> 
            </v-card-title> 
            <v-card-text> 
        <v-container>
            <v-row v-for="(users,user) in user_data" :key="user" class="mb-6" no-gutters >
                <v-col v-if="users.auth == 'M' ">
                    {{ users.id }} : 관리자
                </v-col>
                <v-col v-else-if="users.auth == 'R' ">
                    {{ users.id }} : 방사선사
                </v-col>
                <v-col v-else-if="users.auth == 'N' ">
                    {{ users.id }} : 외래사용자
                </v-col>
                <v-col v-else-if="users.auth == 'U' ">
                    {{ users.id }} : 일반사용자
                </v-col>
            </v-row>
        
        </v-container>
        </v-card-text>
        <v-card-actions> 
        <v-spacer></v-spacer> 
        <v-btn color="blue darken-1" text @click="user_view_dialog = false" > 닫기 </v-btn> 
                            
        </v-card-actions>
        </v-card>
    </v-dialog>
</v-row> 
</v-container>
</template>
<script>

import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc } from "firebase/firestore";
import dayjs from "dayjs";
import axios from "axios";
import snackbar from '~/components/snackbar'
import timetabs from '~/components/timetabs'
import descdialog from '~/components/descdialog'
import userdialog from '~/components/userdialog'

export default {
    data() { 
        return {
            notice_dialog: false,
            oct_dialog:false,
            user_view_dialog:false,
            dialog: false,
            notice_content:'',
            notice_onboard:'',
            oct_content:'',
            snackbar: false, 
            snack_text: '', 
            snack_timeout: 3000,
            user_data:[]
        } 
    }, 
    components: {
        snackbar,
        timetabs,
        descdialog,
        userdialog
    },
    mounted() {
        if(this.$cookies.get('login').auth !== "M"){
            location.href = '/';
        }
        
        this.read_notice();
        this.read_oct();
        this.read_user();
    },
    methods: { 
        timeopen(){
            this.$refs.tt.open();
        },
        descopen(){
            this.$refs.dd.open();
        },
        useropen(){
            this.$refs.ud.open();
        },
        userviewopen(){
            this.user_view_dialog = true;
        },
        async read_user(){
            try {
                const querySnapshot = await getDocs(collection(this.$db, "users"))

                querySnapshot.forEach((doc)=>{
                    this.user_data.push(doc.data());
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
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
                
                this.$refs.sb.open('공지사항 등록이 완료되었습니다.');
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
                this.$refs.sb.open('On Call Tab 등록이 완료되었습니다.');
            } catch (e) {

            }
        },
        
    }
}
</script>