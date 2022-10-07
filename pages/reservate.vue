<template> 
    <div> 
        <v-container> 
            <v-row > 
                <v-col v-for="count in 3" :key="count" cols="6"> 
                    <v-card class="pa-1" outlined> MRI #{{count}} 
                    </v-card> 
                    <v-col v-for="(time,index) in time_items" :key="index"> 
                        <v-card class="pa-1" outlined>
                            <v-row > 
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> {{time}} </v-label> 
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
                                    v-model="res_num">
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
                                    v-model="res_name">
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
                                    class="inline select-box" 
                                    hide-details 
                                    v-model="res_desc">
                                    </v-select> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> {{res_id == '' ? '예약없음' : res_id}} </v-label> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-btn color="primary" elevation="3" @click="reservate()">예약</v-btn> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-btn color="error" elevation="3" @click="reservate_cancel()">취소</v-btn> 
                                </v-col> 
                            </v-row> 
                        </v-card> 
                    </v-col> 
                </v-col> 
            </v-row> 
        </v-container> 
    </div>
</template> 
<script>
import { query, addDoc, getDocs, collection,orderBy } from "firebase/firestore";

export default { 
    data: () => ({ 
        res_num:'',
        res_name:'',
        res_desc:'',
        res_id:'',
        desc_items: [], 
        time_items:[], 
        rules: [ value => !!value || 'Required.', value => (value && value.length >= 3) || 'Min 3 characters', ], 
        
    }), 
    mounted() {
        this.read_Desc();
        this.read_Time();
    },

    methods: { 
        async read_Desc() { 
            this.desc_items = [];
            const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let get_data = JSON.stringify(doc.data());
                this.desc_items.push(JSON.parse(get_data).desc);
            });
        },
        async read_Time() {
            this.time_items = [];
            const q = query(collection(this.$db, "time"));
            const querySnapshot = await getDocs(q);

//const querySnapshot = {"data": {
  //  "20221007" : {
  //      time: "08",
  //      number:"1"
  //  },
  //          "20221007" : {

  //      time: "08",

  //      number:"1"

   //     }


//}}



            querySnapshot.forEach((doc) => {
                let get_data = JSON.stringify(doc.data());
                if(JSON.parse(get_data).use === 'Y'){
                    this.time_items.push(JSON.parse(get_data).time);
                }
            });
        },
        reservate(){

        },
        reservate_cancel(){

        }
    },
}
</script>