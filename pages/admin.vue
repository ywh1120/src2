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
                <v-card class="pa-2" outlined tile > <v-btn @click="oct_dialog = true">등록</v-btn></v-card> 
            </v-col>
        </v-row>
        <v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 데이터 엑셀 다운로드 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > <v-btn @click="exceldown()">다운로드</v-btn> </v-card> 
            </v-col>
        </v-row>
        <!--v-row class='mb-6'> 
            <v-col> 
                <v-card class="pa-2" outlined tile > 지난 데이터 삭제 </v-card> 
            </v-col>
            <v-col> 
                <v-card class="pa-2" outlined tile > 
                    <v-row>
                        <v-col>
                            <v-text-field
                            label="년"
                            v-model="del_year"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            label="월"
                            v-model="del_month"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            label="일"
                            v-model="del_day"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn @click="del_confirm()">
                                이전삭제
                            </v-btn>
                        </v-col>
                    </v-row> 
                </v-card> 
            </v-col>
        </v-row-->
        <snackbar ref="sb" />
<v-row justify="center">
    <userdialog ref="ud"/>
    <timetabs ref="tt" />
    <descdialog ref="dd" />
    <confirm ref="cf" />
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

    <v-dialog v-model="test_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">테스트 다이얼로그</span> 
            </v-card-title> 
            <v-card-text> 
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col>
                            <v-textarea outlined label="On Call Tab 입력" v-model="test_content" ></v-textarea>
                        </v-col> 
                    </v-row>
                </v-container>
            </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="test_dialog = false" > 닫기 </v-btn> 
                
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

import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc,where,documentId, Firestore } from "firebase/firestore";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from 'xlsx'
import snackbar from '~/components/snackbar'
import timetabs from '~/components/timetabs'
import descdialog from '~/components/descdialog'
import userdialog from '~/components/userdialog'
import confirm from '~/components/confirm'

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
            user_data:[],
            del_year:'',
            del_month:'',
            del_day:'',
            test_dialog:false,
            test_content:''
        } 
    }, 
    components: {
        snackbar,
        timetabs,
        descdialog,
        userdialog,
        confirm
    },
    mounted() {
        if(!this.$cookies.get('login')){
            location.href = '/';
        }

        if(this.$cookies.get('login').auth !== "M"){
            location.href = '/';
        }
        
        this.read_notice();
        this.read_oct();
        this.read_user();

        this.del_year = '2022';
        this.del_month = '12';
        this.del_day = '01';
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
        
        async read_user(){
            try {
                const querySnapshot = collection(this.$db, "reservate")

                this.test_content = querySnapshot.get(options=Firestore.SnapshotOptions(server_timestamps=true, read_time));
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
        async del_confirm(){
            const rs = await this.$refs.cf.open('데이터 삭제 경고','해당 지정일자 이전 데이터는 모두 삭제됩니다. 정말 삭제하시겠습니까?');
            if(!rs){ return; }
            else{
                const rs2 = await this.$refs.cf.open('삭제확인','정말 삭제하시겠습니까?');
                if(!rs2){ return; }
                else {this.del_past();}
            }
        },
        
        async del_past(){
            const del_date = this.del_year+'-'+this.del_month+'-'+this.del_day;
            console.log(del_date);
            const q = query(collection(this.$db, "reservate"), where(documentId(), "<", del_date));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (mydoc) => {
            // doc.data() is never undefined for query doc snapshots
                console.log(mydoc.id, " => ", mydoc.data());
                await deleteDoc(doc(this.$db,"reservate",mydoc.id),{});
            });
            
        },

        async exceldown(){
            const wb = XLSX.utils.book_new() // 엑셀 파일 생성 (workbook)
            const excel_time= ['0800','0830','0900','0930','1000','1030','1100','1130','1200','1230','1300','1330','1400','1430','1500','1530','1600','1630','1700'];
            let testar = [];
            const q = query(collection(this.$db, "reservate"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                excel_time.forEach((extime)=>{
                    const get_key = "mri1_"+extime;
                    const excel_data = doc.data()?.[get_key];
                    let ar2={
                        time:'',
                        res_desc:'',
                        res_name:'',
                        res_num:'',
                        res_id:'',
                        mri_num:'',
                        res_chained:'',
                        date:''
                    };

                    if(excel_data !== undefined){
                        ar2.time = excel_data.time;
                        ar2.res_desc = excel_data.res_desc;
                        ar2.res_name = excel_data.res_name;
                        ar2.res_num = excel_data.res_num;
                        ar2.res_id = excel_data.res_id;
                        ar2.mri_num = excel_data.mri_num;
                        ar2.res_chained = excel_data.res_chained;
                        ar2.date = doc.id;
                        testar.push(ar2);
                    }
                    const get_key2 = "mri2_"+extime;
                    const excel_data2 = doc.data()?.[get_key2];//해당 키값을 찾는지 못찾는지는 optional chaining으로 확인(?.)
                    let ar3={
                        time:'',
                        res_desc:'',
                        res_name:'',
                        res_num:'',
                        res_id:'',
                        mri_num:'',
                        res_chained:'',
                        date:''
                    };

                    if(excel_data2 !== undefined){
                        ar3.time = excel_data2.time;
                        ar3.res_desc = excel_data2.res_desc;
                        ar3.res_name = excel_data2.res_name;
                        ar3.res_num = excel_data2.res_num;
                        ar3.res_id = excel_data2.res_id;
                        ar3.mri_num = excel_data2.mri_num;
                        ar3.res_chained = excel_data2.res_chained;
                        ar3.date = doc.id;
                        testar.push(ar3);
                    }
                    const get_key3 = "mri3_"+extime;
                    const excel_data3 = doc.data()?.[get_key3];//해당 키값을 찾는지 못찾는지는 optional chaining으로 확인(?.)
                    let ar4={
                        time:'',
                        res_desc:'',
                        res_name:'',
                        res_num:'',
                        res_id:'',
                        mri_num:'',
                        res_chained:'',
                        date:''
                    };

                    if(excel_data3 !== undefined){
                        ar4.time = excel_data3.time;
                        ar4.res_desc = excel_data3.res_desc;
                        ar4.res_name = excel_data3.res_name;
                        ar4.res_num = excel_data3.res_num;
                        ar4.res_id = excel_data3.res_id;
                        ar4.mri_num = excel_data3.mri_num;
                        ar4.res_chained = excel_data3.res_chained;
                        ar4.date = doc.id;
                        testar.push(ar4);
                    }

                });
            });


            //alert(testar);
            const ws = XLSX.utils.json_to_sheet(testar) // 시트 생성 (worksheet) 및 데이터 삽입
            XLSX.utils.book_append_sheet(wb, ws, "reservate") // 엑셀 파일에 시트 추가
            XLSX.writeFile(wb, 'mribackup.xlsx') // 엑셀 다운로드
        }


    }
}
</script>
