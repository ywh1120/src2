<template> 
    <div> 
        <v-progress-linear v-if="$store.state.prograss"
        indeterminate
        color="blue"
        ></v-progress-linear>
        <v-container>
            
            <v-row > 
                
                <v-col v-for="(reservate,count) in entire_reservate" :key="count" cols="6"> 
                    <v-card class="pa-1" outlined> 
                        <v-label v-if="count < 2">
                        MRI #{{count+1}} 
                        </v-label>
                        <v-label v-else>
                        TCD
                        </v-label>
                    </v-card> 
                    <v-col v-for="(reserve,index) in reservate" :key="index"> 
                        <v-card class="pa-1" outlined>
                            <v-row > 
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> {{reserve.time}} </v-label> 
                                </v-col> 
                                <v-col cols="2" align-self="center" >
                                    <v-text-field 
                                    label="환자번호" 
                                    placeholder="환자번호나 공백입력" 
                                    elevation="3" 
                                    outlined 
                                    hide-details="auto" 
                                     
                                    dense 
                                    :disabled="reserve.reservated == 'Y'"
                                    v-model="reserve.res_num">
                                    </v-text-field> 
                                </v-col> 
                                <v-col cols="2" align-self="center"> 
                                    <v-text-field 
                                    label="예약자성함" 
                                    placeholder="이름입력" 
                                    elevation="3" 
                                    outlined 
                                    hide-details 
                                    dense 
                                    :disabled="reserve.reservated == 'Y'"
                                    v-model="reserve.res_name">
                                    </v-text-field> 
                                </v-col> 
                                <v-col cols="3" align-self="center"> 
                                    <v-select 
                                    :items="desc_items" 
                                    label="검사명" 
                                    elevation="3" 
                                    dense 
                                    full-width 
                                    solo 
                                    :disabled="reserve.reservated == 'Y'"
                                    class="inline select-box" 
                                    hide-details 
                                    v-model="reserve.res_desc">
                                    </v-select> 
                                </v-col> 
                                <v-col cols="3">
                                    <v-autocomplete 
                                    v-model="reserve.res_reading"
                                    :items="reading_items" 
                                    label="판독" 
                                    :disabled="reserve.reservated == 'Y'"
                                    multiple >
                                    </v-autocomplete> 
                                </v-col>
                                <v-col cols="4" align-self="center"> 
                                    <v-text-field 
                                    label="메모" 
                                    placeholder="메모입력" 
                                    elevation="3" 
                                    outlined 
                                    hide-details 
                                    dense 
                                    :disabled="reserve.reservated == 'Y'"
                                    v-model="reserve.res_comment">
                                    </v-text-field> 
                                </v-col>
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> {{reserve.res_id == '' ? '예약없음' : reserve.res_id}} </v-label> 
                                </v-col> 

                                <v-col cols="auto" align-self="center"> 
                                    <v-btn v-if="reserve.reservated == 'N'" color="primary" elevation="3" @click="reservate_mri(reserve, count+1)">예약</v-btn>
                                    <v-btn 
                                    v-else-if="(reserve.res_id == $cookies.get('login').id || 'M' == $cookies.get('login').auth) && reserve.reservated == 'Y'" 
                                    color="warning" 
                                    elevation="3" 
                                    @click="reservate_modify(reserve)">변경
                                    </v-btn> 
                                </v-col> 
                                <v-col cols="auto" align-self="center" v-if="reserve.reservated == 'Y'"> 
                                    <v-btn v-if="reserve.res_id == $cookies.get('login').id || 'M' == $cookies.get('login').auth" 
                                    color="error" 
                                    elevation="3" 
                                    @click="reservate_cancel(reserve, count+1)">취소
                                    </v-btn> 
                                </v-col> 
                            </v-row> 
                        </v-card> 
                    </v-col> 
                </v-col> 
            </v-row> 
            <v-snackbar v-model="snackbar" 
            :timeout="snack_timeout" > {{ snack_text }} 
            </v-snackbar>

            <v-dialog v-model="notice_dialog" persistent max-width="600px" > 
                <v-card>
                    <v-card-title> 
                        <span class="text-h5">공지사항</span> 
                    </v-card-title> 
                    <v-card-text> 
                        <v-container>
                            <v-row class="mb-6" no-gutters >
                                <v-col>
                                    <v-textarea 
                                    outlined label="공지사항" 
                                    readonly 
                                    v-model="notice_content" >
                                    </v-textarea>
                                </v-col> 
                            </v-row>
                        </v-container>
                    </v-card-text> 
                    <v-card-actions> 
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="notice_dialog = false" > 닫기 </v-btn> 
                    </v-card-actions> 
                </v-card> 
            </v-dialog>
        </v-container> 
    </div>

</template> 
<script>
import { query, setDoc,doc, updateDoc, getDocs,getDoc, collection,orderBy,deleteField } from "firebase/firestore";
import io from "socket.io-client"; 
import dayjs from "dayjs";

export default { 
    data: () => ({ 
        res_num:'',
        res_name:'',
        res_desc:'',
        res_id:'',
        desc_items: [], 
        time_items:[], 
        reading_items:["판독","의뢰","폐소"],
        entire_reservate:[],
        reservate1:[],
        reservate2:[],
        reservate3:[],
        snackbar: false, 
        snack_text: '', 
        snack_timeout: 3000,
        notice_dialog:false,
        notice_content:'',
        rules: [ value => !!value || 'Required.', value => (value && value.length >= 3) || 'Min 3 characters', ], 
        prograss_interval: {},
        prograss_value: 0,
        socket:null
    }), 
    async created(){
        this.socket = io('http://localhost:5003');
        this.socket.on('toclient', function(msg){
            this.read_reservate('init');
        });
    },
    mounted() {
        if(!this.$cookies.get('login')){
            location.href = '/';
        }
        
        this.init_screen();
        
    },
    computed: {
        getDate() {
            return this.$store.state.loadDate;
        }
    },
    watch: {
        getDate() {
            //this.init_screen();
            this.load_date();
        }
    },
    methods: { 
        init_screen(){//화면 초기화 함수
            this.entire_reservate=[];
            this.reservate1=[];
            this.reservate2=[];
            this.reservate3=[];
            this.read_Desc();
            this.read_Time();
            this.read_reservate("init");
            this.load_notice();
        },
        async load_notice(){
            const q = doc(this.$db, "notice","notice");
            const docSnapshot = await getDoc(q);
            if(docSnapshot.exists){
                const get_data = docSnapshot.data();
                if(get_data.onboard === 'Y'){
                    this.notice_content = get_data.notice;
                    this.notice_dialog = true;
                }
                
            }
        },
        load_date(){
            //this.init_screen()
            this.entire_reservate.forEach((input_reservate)=>{
                input_reservate.forEach((reservate_data)=>{
                    reservate_data.res_desc='';
                    reservate_data.res_name='';
                    reservate_data.res_num='';
                    reservate_data.res_id='';
                    reservate_data.res_reading='';
                    reservate_data.res_comment='';
                    reservate_data.mri_num='';
                    reservate_data.reservated='N';
                });
            });
            this.read_reservate("date");
        },
        async read_Desc() {//관리자 페이지에서 등록한 검사명 읽어 들이는 함수 
            this.desc_items = [];
            const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                this.desc_items.push(get_data.desc);
            });
            
        },
        async read_Time() {//관리자 페이지에서 등록한 시간표 읽어 들이는 함수
            this.time_items = [];
            const q = query(collection(this.$db, "time"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                if(get_data.use === 'Y'){//시간 데이터중 사용하겠다는 속성을 가진 시간만 넣어준다
                    this.time_items.push(get_data.time);
                }
            });
            
            this.set_timetable(this.time_items);
        },

        set_timetable(t_items){//읽어온 시간표 배열 데이터에 세팅
            t_items.forEach((time)=>{
                let reserve1={
                    time:time,
                    res_desc:'',
                    res_name:'',
                    res_num:'',
                    res_id:'',
                    res_reading:'',
                    res_comment:'',
                    mri_num:'',
                    reservated:'N'
                };
                let reserve2={
                    time:time,
                    res_desc:'',
                    res_name:'',
                    res_num:'',
                    res_id:'',
                    res_reading:'',
                    res_comment:'',
                    mri_num:'',
                    reservated:'N'
                };
                let reserve3={
                    time:time,
                    res_desc:'',
                    res_name:'',
                    res_num:'',
                    res_id:'',
                    res_reading:'',
                    res_comment:'',
                    mri_num:'',
                    reservated:'N'
                };
                this.reservate1.push(reserve1);
                this.reservate2.push(reserve2);
                this.reservate3.push(reserve3);
            });
        },

        async read_reservate(type_var){//예약된 데이터 읽어오기, 읽어온 데이터는 미리 세팅된 시간표 배열에 동일한 시간인지 확인하여 넣어준다.
            try{
                this.$store.state.prograss = true;
                const date = this.getDate;
                const q = doc(this.$db, "reservate",date);
                const docSnapshot = await getDoc(q);
                
                if(docSnapshot.exists){
                    if(type_var === "init"){//화면이 첫 로딩되어 초기화 될때는 각 배열 데이터 새로 생성하여 넣어준다.
                        this.reservate1.forEach((time_data,idx)=>{
                            const get_key = "mri1_"+(time_data.time).replace(":","");
                            const get_data = docSnapshot.data()[get_key];

                            if(get_data){
                                const get_reserve={
                                    time:get_data.time,
                                    res_desc:get_data.res_desc,
                                    res_name:get_data.res_name,
                                    res_num:get_data.res_num,
                                    res_id:get_data.res_id,
                                    res_reading:get_data.res_reading,
                                    res_comment:get_data.res_comment,
                                    mri_num:get_data.mri_num,
                                    reservated:'Y'
                                };
                                this.reservate1[idx] = get_reserve;

                            }  
                        });

                        this.reservate2.forEach((time_data,idx)=>{
                            const get_key = "mri2_"+(time_data.time).replace(":","");
                            const get_data = docSnapshot.data()[get_key];  
                            if(get_data){
                                const get_reserve={
                                    time:get_data.time,
                                    res_desc:get_data.res_desc,
                                    res_name:get_data.res_name,
                                    res_num:get_data.res_num,
                                    res_id:get_data.res_id,
                                    res_reading:get_data.res_reading,
                                    res_comment:get_data.res_comment,
                                    mri_num:get_data.mri_num,
                                    reservated:'Y'
                                };
                                this.reservate2[idx] = get_reserve;
                            }  
                        });

                        this.reservate3.forEach((time_data,idx)=>{
                            const get_key = "mri3_"+(time_data.time).replace(":","");
                            const get_data = docSnapshot.data()[get_key];  
                            if(get_data){
                                const get_reserve={
                                    time:get_data.time,
                                    res_desc:get_data.res_desc,
                                    res_name:get_data.res_name,
                                    res_num:get_data.res_num,
                                    res_id:get_data.res_id,
                                    res_reading:get_data.res_reading,
                                    res_comment:get_data.res_comment,
                                    mri_num:get_data.mri_num,
                                    reservated:'Y'
                                };
                                this.reservate3[idx] = get_reserve;
                            }  
                        });
                    
                    }else if(type_var === "date"){//날짜만 바꿔줄떄는 이미 존재하는 배열데이터의 위치에 맞게 데이터에 넣어준다.
                        
                        let ar_cnt = 1;
                        this.entire_reservate.forEach((in_reservate)=>{
                            in_reservate.forEach((set_reserve)=>{
                                let get_key = "mri"+ar_cnt+"_"+(set_reserve.time).replace(":","");
                                let get_data = docSnapshot.data()[get_key];
                                
                                if(get_data){
                                    if((get_data.time === set_reserve.time)){
                                        set_reserve.res_desc = get_data.res_desc;
                                        set_reserve.res_name = get_data.res_name;
                                        set_reserve.res_num = get_data.res_num;
                                        set_reserve.res_id = get_data.res_id;
                                        set_reserve.res_reading = get_data.res_reading;
                                        set_reserve.res_comment = get_data.res_comment;
                                        set_reserve.mri_num = get_data.mri_num;
                                        set_reserve.reservated = 'Y';
                                    }
                                }
                            });
                            ar_cnt = ar_cnt+1;
                        });
                    }
                }
            }catch(e){

            }
            if(type_var == "init"){//화면 첫로딩때는 전체 배열데이터에 넣어준다.
                this.entire_reservate.push(this.reservate1);
                this.entire_reservate.push(this.reservate2);
                this.entire_reservate.push(this.reservate3);
            }
            this.$store.state.prograss = false;
        },
        async reservate_mri(reserve, count){//예약함수
            const todate = dayjs().format("YYYY-MM-DD");
            const date = this.getDate;
            const comptime = reserve.time.split(":");
            if(todate === date){
                if(dayjs().hour() > comptime[0]){
                    this.snack_text = '예약가능한 시간이 아닙니다.';
                    this.snackbar = true;
                    return;
                }

                if(dayjs().hour() === comptime[0]){
                    if((comptime[1] - dayjs().minute()) < 15){
                        this.snack_text = '예약가능한 시간이 아닙니다.';
                        this.snackbar = true;
                        return;      
                    }
                }
            }
            
            const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");//데이터 베이스 콜렉션 안에 담을 문서의 key형태(ex)mri1_0800)
            reserve.res_id = this.$cookies.get('login').id;
            
            try {
                //const docSnap = await getDoc(doc(this.$db, "reservate",date));
                //if(docSnap.exists){
                    //const get_data = docSnap.data()[reservate_data];
                    //if(get_data.res_id !== reserve.res_id && this.$cookies.get('login').auth !== 'M'){//예약하려는 아이디가 이미 예약된 데이터의 아이디 값과 다를 경우
                        //reserve.res_id = '';
                        //this.snack_text = '이미 예약된 데이터입니다.';
                        //this.snackbar = true;
                    //}else if(get_data.res_id !== reserve.res_id || this.$cookies.get('login').auth !== 'M'){
                        await setDoc(doc(this.$db, "reservate", date), {
                            [reservate_data]:{
                                time:reserve.time,
                                res_desc:reserve.res_desc,
                                res_name:reserve.res_name,
                                res_num:reserve.res_num,
                                res_id:reserve.res_id,
                                res_reading:reserve.res_reading,
                                res_comment:reserve.res_comment,
                                mri_num:count
                            }
                        },{merge:true});
                        
                        reserve.reservated = 'Y';
                        this.snack_text = '예약이 완료되었습니다.';
                        this.snackbar = true;
                        //this.$socket.emit('update');
                        this.socket.emit('toclient',{msg:'ins'});
                    //}
                //}
                
                
            } catch (e) {

            }
            
        },
        reservate_modify(reserve){
            reserve.reservated = 'N';
        },
        async reservate_cancel(reserve,count){
            const date = this.getDate;
            try{
                const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");
                await updateDoc(doc(this.$db, "reservate", date), {
                    [reservate_data]: deleteField()
                });
                
                reserve.res_desc = '';
                reserve.res_name = '';
                reserve.res_num = '';
                reserve.res_id = '';
                reserve.res_reading = '';
                reserve.res_comment = '';
                reserve.mri_num = '';
                reserve.reservated='N';
                this.snack_text = '예약이 취소되었습니다.';
                this.snackbar = true;
                this.socket.emit('toclient',{msg:'ins'});
            }catch(e){

            }
        }
    },
}
</script>