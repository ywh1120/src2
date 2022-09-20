<template> 
    <div> 
        <v-container> 
            <v-row > 
                <v-col v-for="count in 3" :key="count" cols="6"> 
                    <v-card class="pa-1" outlined> MRI #{{count}} 
                    </v-card> 
                    <v-col v-for="time in times" :key="time"> 
                        <v-card class="pa-1" outlined>
                            <v-row > 
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> {{time}} </v-label> 
                                </v-col> 
                                <v-col cols="2" align-self="center" >
                                    <v-text-field label="환자번호" placeholder="환자번호나 공백입력" elevation="3" outlined hide-details="auto" :rules="rules" dense >
                                    </v-text-field> 
                                </v-col> 
                                <v-col cols="2" align-self="center"> 
                                    <v-text-field label="예약자성함" placeholder="이름입력" elevation="3" outlined hide-details dense >
                                    </v-text-field> 
                                </v-col> 
                                <v-col cols="3" align-self="center"> 
                                    <v-select :items="items" label="검사명" elevation="3" dense full-width solo class="inline select-box" hide-details >
                                    </v-select> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-label> NS1030 </v-label> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-btn color="primary" elevation="3" >예약</v-btn> 
                                </v-col> 
                                <v-col cols="auto" align-self="center"> 
                                    <v-btn color="error" elevation="3" >취소</v-btn> 
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
export default { 
    data: () => ({ 
        items: ['','LSP', 'CSP', 'TLSP', 'Shoulder','Knee','Foot-Ankle','Elbow','Other'], 
        times:['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'], 
        rules: [ value => !!value || 'Required.', value => (value && value.length >= 3) || 'Min 3 characters', ], }), 
    method: () => ({ 

    }),
}
</script>