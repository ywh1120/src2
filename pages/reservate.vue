<template> 
    <div> 
        <v-progress-linear v-if="$store.state.prograss"
        indeterminate
        color="blue"
        ></v-progress-linear>
        <v-container>
            <v-row >
                <v-col v-for="(reservate,count) in entire_reservate" :key="count" cols="12" sm="6"> 
                    <v-card v-if="count < 2" class="pa-1" outlined color="#6666FF"> 
                        <v-label>
                        MRI #{{count+1}} 
                        </v-label>
                    </v-card>
                    <v-card v-else class="pa-1" outlined color="#FFCC99"> 
                        <v-label>
                        TCD
                        </v-label>
                    </v-card> 
                    
                        <v-card v-for="(reserve,index) in reservate" :key="index" 
                            outlined 
                            elevation="15" 
                            :class="colorClass(reserve)"
                            class="justify-center pt-3">
                            <v-row class="justify-center"> 
                                <v-col cols="11" sm="1" align-self="center"> 
                                    <v-label> 
                                        <span v-if="(count < 2)" v-bind:id="'MRI'+(count+1)+'_'+reserve.time"> {{reserve.time}} </span>
                                        <span v-else v-bind:id="'TCD_'+reserve.time"> {{reserve.time}} </span>
                                    </v-label> 
                                </v-col>  
                                <v-col cols="11" sm="3" align-self="center" >
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
                                <v-col cols="11" sm="3" align-self="center"> 
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
                                <v-col v-if="count < 2" cols="11" sm="4" align-self="center"> 
                                    <v-select 
                                    :items="desc_items"
                                    :item-text="'name'"
                                    :item-value="'value'"
                                    label="검사명" 
                                    elevation="3" 
                                    dense 
                                    full-width 
                                    solo 
                                    :disabled="reserve.reservated == 'Y'"
                                    @change="descselectevent(reserve,count+1)"
                                    class="inline select-box" 
                                    hide-details 
                                    v-model="reserve.res_desc">
                                    </v-select> 
                                </v-col> 
                                <v-col v-else cols="11" sm="4" align-self="center">
                                    <v-label>TCD</v-label>
                                </v-col>
                            </v-row> 
                            <v-row class="justify-center mt-1">
                                <v-col cols="3">
                                    <v-autocomplete 
                                    v-model="reserve.res_reading"
                                    :items="reading_items" 
                                    label="판독여부" 
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
                                    v-else-if="((reserve.res_id == $cookies.get('login').id) || 'M' == $cookies.get('login').auth || 'R' == $cookies.get('login').auth) && reserve.reservated == 'Y'" 
                                    color="warning" 
                                    elevation="3" 
                                    @click="reservate_modify(reserve)">변경
                                    </v-btn> 
                                </v-col> 
                                <v-col cols="auto" align-self="center" v-if="(reserve.reservated == 'Y')"> 
                                    <v-btn v-if="((reserve.res_id == $cookies.get('login').id) || 'M' == $cookies.get('login').auth || 'R' == $cookies.get('login').auth)" 
                                    color="error" 
                                    elevation="3" 
                                    @click="reservate_cancel(reserve,count+1)">취소
                                    </v-btn> 
                                </v-col>
                            </v-row>
                        </v-card> 
                    
                </v-col> 
            </v-row> 
            <confirm ref="cf" />
            <snackbar ref="sb" />

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
import { query, setDoc,doc, updateDoc, getDocs,getDoc, collection,orderBy,deleteField,onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";
import confirm from '~/components/confirm'
import snackbar from '~/components/snackbar'

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
        notice_dialog:false,
        notice_content:'',
        rules: [ value => !!value || 'Required.', value => (value && value.length >= 3) || 'Min 3 characters', ], 
        prograss_interval: {},
        prograss_value: 0,
        onehour_res : 'N',
        confirm_msg_title:'',
        confirm_msg : '',
        confirm_dialog : false,
        confirmed : false,
        data_modify : false
    }), 
    components: {
        confirm
    },
    created(){
        this.entire_reservate=[];
        this.reservate1=[];
        this.reservate2=[];
        this.reservate3=[];
        //this.getDate = this.$store.state.loadDate;
    },
    mounted() {
        //this.$router.go();
        
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
        colorClass(reservate) {
    	    let color = (reservate.reservated === 'Y' ) ? 'green lighten-3' : 'white';
    	    return 'color: '+color;
        },
        init_screen(){//화면 초기화 함수
            //this.$store.state.prograss = true;
            
            this.read_Desc();
            this.read_Time();
            this.read_reservate();
            this.load_notice();
        },
        async load_notice(){
            const q = doc(this.$db, "notice","notice");
            const docSnapshot = await getDoc(q);
            if(docSnapshot.exists){
                const get_data = docSnapshot.data();
                if(get_data && (get_data.onboard === 'Y')){
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
            this.read_reservate();
        },

        async descselectevent(get_reservate,mrinum){
            let dupdeny = '';
            this.desc_items.forEach((mydesc)=>{
                if(mydesc.value === get_reservate.res_desc){
                    this.onehour_res = mydesc.onehour;
                    dupdeny = mydesc.dupdeny;
                    return false;
                }
            });
            if(dupdeny === 'Y'){
                let find_val = false;
                switch(mrinum){
                    case 1:
                        {
                            this.entire_reservate[1].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                            this.entire_reservate[2].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                            
                            
                        }
                        break;
                    case 2:
                        {
                            this.entire_reservate[0].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                            this.entire_reservate[2].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                        }
                        break;
                    case 3:
                        {
                            this.entire_reservate[0].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                            this.entire_reservate[1].forEach((reserve)=>{
                                if((reserve.res_desc === get_reservate.res_desc) && (reserve.time === get_reservate.time)){
                                    find_val = true;
                                    return false;
                                }
                            });
                        }
                        break;
                }
                if(find_val){
                    await this.$refs.sb.open(get_reservate.res_desc+'는 동시예약할 수 없습니다.');
                    get_reservate.res_desc = '';
                    this.onehour_res = 'N';
                    return;
                }
                
            }
            
        },
        async read_Desc() {//관리자 페이지에서 등록한 검사명 읽어 들이는 함수 
            this.desc_items = [];
            const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
            const querySnapshot = await getDocs(q);
            this.desc_items.push({name:'검사명', value:''});
            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                let desc_item = {
                                name:get_data.desc, 
                                value:get_data.desc, 
                                onehour:get_data.onehour_desc,
                                dupdeny:get_data.dup_deny
                                };
                this.desc_items.push(desc_item);
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

            this.entire_reservate.push(this.reservate1);
            this.entire_reservate.push(this.reservate2);
            this.entire_reservate.push(this.reservate3);
        },


        read_reservate(){//예약된 데이터 읽어오기, 읽어온 데이터는 미리 세팅된 시간표 배열에 동일한 시간인지 확인하여 넣어준다.
            
            try{
                const date = this.getDate;
                const q = onSnapshot(doc(this.$db, "reservate",date),(docSnapshot)=>{
                    if(docSnapshot.exists){
                        let ar_cnt = 1;
                        this.entire_reservate.forEach((in_reservate)=>{
                            in_reservate.forEach((set_reserve)=>{
                            const get_key = "mri"+ar_cnt+"_"+(set_reserve.time).replace(":","");
                            const get_data = docSnapshot.data()?.[get_key];//해당 키값을 찾는지 못찾는지는 optional chaining으로 확인(?.)

                            if(get_data !== undefined){
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

                                }else if(get_data === undefined){
                                    set_reserve.res_desc = '';
                                    set_reserve.res_name = '';
                                    set_reserve.res_num = '';
                                    set_reserve.res_id = '';
                                    set_reserve.res_reading = '';
                                    set_reserve.res_comment = '';
                                    set_reserve.mri_num = '';
                                    set_reserve.reservated = 'N';
                                }
                            });
                            ar_cnt = ar_cnt+1;
                        });
                    }
                });
            }catch(e){

            }
            this.$store.state.prograss = false;
        },

        async reservate_mri(reserve, count){//예약함수

            const todate = dayjs().format("YYYY-MM-DD");
            const date = this.getDate;
            const comptime = reserve.time.split(":");
            
            if(todate > date){
                this.$refs.sb.open('예약가능한 날짜가 아닙니다.');
                return;
            }
            if(todate === date){
                if(dayjs().hour() > comptime[0]){
                    this.$refs.sb.open('예약가능한 시간이 아닙니다.');
                    return;
                }
                else if(dayjs().hour() == comptime[0]){
                    if(comptime[1] == '30' && (dayjs().minute() > 15)){
                        this.$refs.sb.open('예약가능한 시간이 아닙니다.');
                        return;      
                    }
                    if(comptime[1] == '00' && (dayjs().minute() > 0)){
                        this.$refs.sb.open('예약가능한 시간이 아닙니다.');
                        return;      
                    }
                }

                else if(dayjs().hour() == (comptime[0] - 1)){
                    if(comptime[1] == '00' && (dayjs().minute() > 45)){
                        this.$refs.sb.open('예약가능한 시간이 아닙니다.');
                        return;      
                    }
                }
            }
            if(reserve.res_num === ''){
                if(todate !== date){
                    this.$refs.sb.open('환자번호를 입력해 주십시오.');
                    return;
                }
            }

            if(reserve.res_name === ''){
                this.$refs.sb.open('예약자성함을 입력해 주십시오.');
                return;
            }
            
            if(reserve.res_desc === '' && count != 3){
                this.$refs.sb.open('검사명을 입력해 주십시오.');
                this.snackbar = true;
                return;
            }else if(count == 3){
                reserve.res_desc = 'TCD';
            }
            
            //reserve.res_id = this.$cookies.get('login').id;
            if(this.data_modify){
                const rs = await this.$refs.cf.open('변경확인','정말 변경하시겠습니까');
                if(!rs){ return; }
            }
            try {
                                
                if(this.onehour_res === 'Y'){//한시간짜리 예약의 경우 다음행까지 동일 내용으로 자동 예약 되어야 함
                    if(reserve.time === '17:00'){
                        this.$refs.sb.open(reserve.res_desc+'는 17:00 예약이 불가능합니다. 1시간이 소요되는 검사입니다.');
                        return;
                    }

                    let reservate_data1 = 'mri'+count+'_'+(reserve.time).replace(":","");
                    let reservate_data2 = '';
                    let computetime = '';
                    if(comptime[0] === '08' || comptime[0] === '09'){//여기서 부터 시간을 숫자로 변환하여 다음 행을 예약하는 로직
                        if(comptime[1] === '30')//30분의 경우 다음행은 1시간이 되므로 70을 더해준다
                            computetime = "0"+String(Number((reserve.time).replace(":",""))+70);
                        else//00분의 경우 다음행은 30분이 되므로 30을 더해준다
                            computetime = "0"+String(Number((reserve.time).replace(":",""))+30);
                    }else{//08시 및 09시는 앞에 별도의 0을 붙여줄 필요 없음
                        if(comptime[1] === '30')
                            computetime = String(Number((reserve.time).replace(":",""))+70);
                        else
                            computetime = String(Number((reserve.time).replace(":",""))+30);
                    }
                    reservate_data2 = 'mri'+count+'_'+computetime;
                    const searchDoc = await getDoc(doc(this.$db, "reservate",date));

                    if(searchDoc.exists){
                        const get_data = searchDoc.data()?.[reservate_data2];
                        
                        if(get_data !== undefined){//예약하려는 아이디가 이미 예약된 데이터의 아이디 값과 다를 경우
                            this.$refs.sb.open(reserve.res_desc+'는 1시간 단위로만 예약 가능합니다.');
                            reserve.res_desc = '';
                            reserve.res_name = '';
                            reserve.res_num = '';
                            reserve.res_id = '';
                            reserve.res_reading = '';
                            reserve.res_comment = '';
                            return;
                        }
                    }

                    await setDoc(doc(this.$db, "reservate", date), {
                        [reservate_data1]:{
                            time:reserve.time,
                            res_desc:reserve.res_desc,
                            res_name:reserve.res_name,
                            res_num:reserve.res_num,
                            res_id:this.$cookies.get('login').id,
                            res_reading:reserve.res_reading,
                            res_comment:reserve.res_comment,
                            mri_num:count,
                            res_chained:reservate_data2
                        },
                        [reservate_data2]:{
                            time:computetime.slice(0,2) + ':' + computetime.slice(2, 4),
                            res_desc:reserve.res_desc,
                            res_name:reserve.res_name,
                            res_num:reserve.res_num,
                            res_id:this.$cookies.get('login').id,
                            res_reading:reserve.res_reading,
                            res_comment:reserve.res_comment,
                            mri_num:count,
                            res_chained:reservate_data1
                        }
                    },{merge:true});
                }else{
                    const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");//데이터 베이스 콜렉션 안에 담을 문서의 key형태(ex)mri1_0800)
                    const searchDoc = await getDoc(doc(this.$db, "reservate",date));
                    if(searchDoc.exists){
                        const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");
                        const get_data = searchDoc.data()?.[reservate_data];
                        if(get_data !== undefined){
                            if((get_data.res_id !== this.$cookies.get('login').id) && (this.$cookies.get('login').auth !== 'M') && (this.$cookies.get('login').auth !== 'R')){//예약하려는 아이디가 이미 예약된 데이터의 아이디 값과 다를 경우
                                reserve.reservated = 'Y';
                                this.$refs.sb.open('이미 예약된 데이터입니다.');
                                return;
                            }
                        }
                    }
                    
                    await setDoc(doc(this.$db, "reservate", date), {
                        [reservate_data]:{
                            time:reserve.time,
                            res_desc:reserve.res_desc,
                            res_name:reserve.res_name,
                            res_num:reserve.res_num,
                            res_id:this.$cookies.get('login').id,
                            res_reading:reserve.res_reading,
                            res_comment:reserve.res_comment,
                            mri_num:count,
                            res_chained:''
                        }
                    },{merge:true});
                }  
                reserve.reservated = 'Y';
                if(this.data_modify)
                    this.$refs.sb.open('변경이 완료되었습니다.');
                else
                    this.$refs.sb.open('예약이 완료되었습니다.');

                this.data_modify = false;
                
            } catch (e) {

            }
            
        },
        async reservate_modify(reserve){
            reserve.reservated = 'N';
            this.data_modify = true;
        },
        
        async reservate_cancel(reserve,count){
            const rs = await this.$refs.cf.open('삭제확인','정말 삭제하시겠습니까');
            if(!rs){
                return;
            }
            const date = this.getDate;
            try{
                const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");
                const searchDoc = await getDoc(doc(this.$db, "reservate",date));
                let chainedData = '';
                if(searchDoc.exists){
                    const get_data = searchDoc.data()?.[reservate_data];
                    if(get_data !== undefined){
                        chainedData = get_data.res_chained;
                    }else{
                        this.$refs.sb.open('이미 취소된 데이터입니다.');
                        return;
                    }
                }
                if(chainedData === ''){
                    await updateDoc(doc(this.$db, "reservate", date), {
                        [reservate_data]: deleteField()
                    },{merge:true});
                }else{
                    await updateDoc(doc(this.$db, "reservate", date), {
                        [reservate_data]: deleteField(),
                        [chainedData]: deleteField()
                    },{merge:true});
                }
                reserve.res_desc = '';
                reserve.res_name = '';
                reserve.res_num = '';
                reserve.res_id = '';
                reserve.res_reading = '';
                reserve.res_comment = '';
                reserve.mri_num = '';
                reserve.reservated='N';
                this.$refs.sb.open('예약이 취소되었습니다.');
                //this.socket.emit('toclient',{msg:'ins'});
            }catch(e){

            }
        }
    },
}
</script>