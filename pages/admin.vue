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
                            <v-text-field label="아이디*" required ></v-text-field> 
                        </v-col>  
                        <v-col cols="12"> 
                            <v-text-field label="패스워드*" type="password" required ></v-text-field> 
                        </v-col> 
                        <v-col cols="12" sm="6" > 
                            <v-select :items="['1', '2', '3']" label="권한*" required ></v-select> 
                        </v-col>
                         
                    </v-row> 
                             
                    <small>*별표시는 필수값입니다.</small> 
                </v-container>
            </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer> 
                    <v-btn color="blue darken-1" text @click="user_dialog = false" > 닫기 </v-btn> 
                    <v-btn color="blue darken-1" text @click="user_dialog = false" > 저장 </v-btn>
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
            <v-row> 
                <v-col cols="12" sm="6"> 
                    <v-text-field label="아이디*" required ></v-text-field> 
                </v-col>
            </v-row>  
        </v-container>
        </v-card-text> 
        <v-card-actions> 
            <v-spacer></v-spacer> 
                <v-btn color="blue darken-1" text @click="time_dialog = false" > 닫기 </v-btn> 
                <v-btn color="blue darken-1" text @click="time_dialog = false" > 저장 </v-btn>
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
                        <v-text-field label="검사명추가" required ></v-text-field> 
                    </v-col> 
                    <v-col cols="12">
                        <v-autocomplete :items="['LSP', 'CSP', 'TLSP', 'Shoulder','Knee','Foot-Ankle','Elbow','Other']" label="검사명" multiple ></v-autocomplete> 
                    </v-col> 
                </v-row> 
                 
            </v-container>
        </v-card-text> 
            <v-card-actions> 
                <v-spacer></v-spacer> 
            <v-btn color="blue darken-1" text @click="desc_dialog = false" > 닫기 </v-btn> 
            <v-btn color="blue darken-1" text @click="desc_dialog = false" > 저장 </v-btn>
            </v-card-actions> 
        </v-card> 
    </v-dialog>


        </v-row> 
    </v-container>
</template>
<script>
export default {
    data() { 
        return { 
            user_dialog: false,
            time_dialog: false,
            desc_dialog: false,
            notice_dialog: false,
            dialog: false, 
            mode: 'create', 
            form: { title: '', content: '' }, 
            
            items: [], 
            selectedItem: null 
        } 
    }, 
    mounted() {},
    methods: { 
        openDialog(mode, sel) { 
            this.mode = mode 
            if (mode === 'create') { 
                this.form.title = '' 
                this.form.content = '' 
            } else { 
                this.form.title = sel.title 
                this.form.content = sel.content 
                this.selectedItem = sel 
            } this.dialog = true 
        }, 
        create() { 
            const item = { 
                id: Math.floor(Math.random() * 10000), 
                createAt: new Date(), 
                title: this.form.title, 
                content: this.form.content 
            } 
            this.items.push(item) 
            this.dialog = false 
        }, 
        read() { 
            console.log('r') 
        }, 
        update() { 
            console.log('u') 
        }, 
        remove() { 
            console.log('d') 
        } 
    }
}
</script>