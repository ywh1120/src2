<template> 
    <div> 
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
                                    :rules="rules" 
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
                                <v-col cols="2" align-self="center"> 
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
                                    <v-btn v-else color="primary" elevation="3" @click="reservate_modify(reserve)">변경</v-btn> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-btn v-if="reserve.res_id != ''" color="error" elevation="3" @click="reservate_cancel()">취소</v-btn> 
                                </v-col> 
                            </v-row> 
                        </v-card> 
                    </v-col> 
                </v-col> 
            </v-row> 
            <v-snackbar v-model="snackbar" 
            :timeout="snack_timeout" > {{ snack_text }} 
            </v-snackbar>
        </v-container> 
    </div>

</template> 
<script>
import { query, setDoc,doc, addDoc, getDocs,getDoc, collection,orderBy } from "firebase/firestore";
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
        rules: [ value => !!value || 'Required.', value => (value && value.length >= 3) || 'Min 3 characters', ], 
        
    }), 
    mounted() {
        if(!this.$cookies.get('login')){
            location.href = '/';
        }
        this.init_screen();
        
    },

    methods: { 
        init_screen(){
            this.entire_reservate=[];
            this.reservate1=[];
            this.reservate2=[];
            this.reservate3=[];
            this.read_Desc();
            this.read_Time();
            this.read_reservate();
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
        async read_Time() {
            this.time_items = [];
            const q = query(collection(this.$db, "time"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                let get_data = doc.data();
                if(get_data.use === 'Y'){
                    this.time_items.push(get_data.time);
                }
            });
            
            this.set_timetable(this.time_items);
        },

        set_timetable(t_items){
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

        async read_reservate(){
            try{
                const date = dayjs().format("YYYY.MM.DD");
                const q = doc(this.$db, "reservate",date);
                const querySnapshot = await getDoc(q);
                
                if(querySnapshot.exists){
                    this.reservate1.forEach((time_data,idx)=>{
                        const get_key = "mri1_"+(time_data.time).replace(":","");
                        const get_data = querySnapshot.data()[get_key];

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
                        const get_data = querySnapshot.data()[get_key];  
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
                        const get_data = querySnapshot.data()[get_key];  
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
                    
                    this.entire_reservate.push(this.reservate1);
                    this.entire_reservate.push(this.reservate2);
                    this.entire_reservate.push(this.reservate3);
                }
            }catch(e){

            }
        },
        async reservate_mri(reserve, count){
            const date = dayjs().format("YYYY.MM.DD");
            const reservate_data = 'mri'+count+'_'+(reserve.time).replace(":","");
            reserve.res_id = this.$cookies.get('login').id;
            //const reservate_data = 'mritest';
            try {
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
            } catch (e) {

            }
            
        },
        reservate_modify(reserve){
            reserve.reservated = 'N';
        },
        reservate_cancel(){

        }
    },
}
</script>