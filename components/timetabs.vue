<template>
    <v-dialog v-model="time_dialog" persistent max-width="600px" > 
        <v-card>
            <v-card-title> 
                <span class="text-h5">시간표 추가/삭제</span> 
            </v-card-title> 
        <v-card-text> 
        <v-tabs>
            <v-tab >MRI#1</v-tab>
            <v-tab >MRI#2</v-tab>
            <v-tab >TCD</v-tab>

            <v-tab-item>
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col v-for="t_item in time_items" :key="t_item" >
                            <v-checkbox 
                            v-model="selected_time1" 
                            :label="t_item" 
                            :value="t_item">
                            </v-checkbox>
                        </v-col> 
                    </v-row>
                    <v-card-actions> 
                        <v-spacer></v-spacer> 
                            <v-btn color="blue darken-1" text @click="time_dialog = false" > 닫기 </v-btn> 
                            <v-btn color="blue darken-1" text @click="time_submit(1)" > 저장 </v-btn>
                    </v-card-actions>
                </v-container>
            </v-tab-item>

            <v-tab-item>
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col v-for="t_item in time_items" :key="t_item" >
                            <v-checkbox 
                            v-model="selected_time2" 
                            :label="t_item" 
                            :value="t_item">
                            </v-checkbox>
                        </v-col> 
                    </v-row>
                    <v-card-actions> 
                        <v-spacer></v-spacer> 
                            <v-btn color="blue darken-1" text @click="time_dialog = false" > 닫기 </v-btn> 
                            <v-btn color="blue darken-1" text @click="time_submit(2)" > 저장 </v-btn>
                    </v-card-actions>
                </v-container>
            </v-tab-item>

            <v-tab-item>
                <v-container>
                    <v-row class="mb-6" no-gutters >
                        <v-col v-for="t_item in time_items" :key="t_item" >
                            <v-checkbox 
                            v-model="selected_time3" 
                            :label="t_item" 
                            :value="t_item">
                            </v-checkbox>
                        </v-col> 
                    </v-row>
                    <v-card-actions> 
                        <v-spacer></v-spacer> 
                            <v-btn color="blue darken-1" text @click="time_dialog = false" > 닫기 </v-btn> 
                            <v-btn color="blue darken-1" text @click="time_submit(3)" > 저장 </v-btn>
                    </v-card-actions>
                </v-container>
            </v-tab-item>
        </v-tabs>
        </v-card-text> 
             
        </v-card> 
    </v-dialog>
</template>
<script>
import { query, deleteDoc,getDoc, getDocs, collection,orderBy,setDoc,doc } from "firebase/firestore";

export default {
    data() { 
        return{
            tab:null,
            time_dialog:false,
            time_items: ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
            selected_time1: [],
            selected_time2: [],
            selected_time3: [],
        }
    },
    mounted() {
        this.read_time();
    },
    methods: { 
        open(){
            this.time_dialog = true;
        },
        async read_time(){
            this.selected_time1 = [];
            this.selected_time2 = [];
            this.selected_time3 = [];

            const q1 = query(collection(this.$db,"time1"));
            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach((doc)=>{
                let get_data = doc.data();
                if(get_data.use === 'Y'){
                    this.selected_time1.push(get_data.time);
                }
            });

            const q2 = query(collection(this.$db,"time2"));
            const querySnapshot2 = await getDocs(q2);
            querySnapshot2.forEach((doc)=>{
                let get_data = doc.data();
                if(get_data.use === 'Y'){
                    this.selected_time2.push(get_data.time);
                }
            });

            const q3 = query(collection(this.$db,"time3"));
            const querySnapshot3 = await getDocs(q3);
            querySnapshot3.forEach((doc)=>{
                let get_data = doc.data();
                if(get_data.use === 'Y'){
                    this.selected_time3.push(get_data.time);
                }
            });
        },
        time_submit(whatnum){
            try {
                let search_time;
                let search_table;
                switch(whatnum){
                    case 1:
                        search_time = this.selected_time1;
                        search_table = "time1";
                    break;

                    case 2:
                        search_time = this.selected_time2;
                        search_table = "time2";    
                    break;

                    case 3:
                        search_time = this.selected_time3;
                        search_table = "time3";
                    break;
                }
                this.time_items.forEach(async (this_time)=>{
                    let use_time='N';
                    search_time.forEach((selt)=>{
                        if(selt === this_time){
                            use_time='Y';
                        } 
                    });
                    await setDoc(doc(this.$db, search_table, this_time), {
                        time:this_time,
                        use:use_time
                    });
                });
                this.time_dialog = false;
                
                //this.$refs.sb.open('시간표 변경이 완료되었습니다.');
                //this.read_time();
            } catch {

            }
        }
    }
}
</script>