<template>
  
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-row justify="center"> 
        <v-col>
          <v-date-picker v-model="picker" locale="ko-kr" full-width class="mt-4" ></v-date-picker> 
        </v-col>
      </v-row>
      <v-row justify="center"> 
        <v-col>
          <v-btn @click="movetoday()">TODAY</v-btn>
        </v-col> 
      </v-row>
      <v-row justify="center">
        <v-col> 
          <v-textarea label="On Call" auto-grow v-model="oct_content"  readonly></v-textarea> 
        </v-col>
      </v-row>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      
      <v-toolbar-title v-text="title" />
      <v-spacer/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" >
            <v-icon>검사명 안내</v-icon>
          </v-btn> 
        </template>
        <span style="white-space:pre;">{{ notice_content }}</span>
      </v-tooltip>
      <v-spacer/>
      <v-btn @click="scrollReservate('MRI')">
        <v-icon>ScrollMRI</v-icon>
      </v-btn>
      <v-spacer/>
      <v-btn @click="scrollReservate('TCD')">
        <v-icon>ScrollTCD</v-icon>
      </v-btn>
      <v-spacer/>
      <div v-if="cookie">
        Welcome, {{cookie.id}}!<v-btn color="warning" dark @click="logout()"> 로그아웃 </v-btn>  
      </div>
      <div style="display:flex" v-else>
        <div><v-text-field v-model="id" label="아이디" placeholder="아이디입력" elevation="3" outlined hide-details dense ></v-text-field></div>
        <div><v-text-field v-model="pass" label="비밀번호" placeholder="비밀번호입력" elevation="3" outlined hide-details dense @keyup.enter="login()"></v-text-field></div>
        <div><v-btn color="success" dark @click="login()"> 로그인 </v-btn></div>  
      </div>
      
    </v-app-bar>
    <v-main>
      <v-container>
        <v-dialog v-model="dialog" persistent max-width="290" > 
          <v-card> 
            <v-card-title class="text-h5"> {{ dialog_title }} </v-card-title> 
            <v-card-text>
              {{ dialog_text }}
            </v-card-text> 
            <v-card-actions> 
              <v-spacer></v-spacer> 
            <v-btn color="green darken-1" text @click="dialog = false" > 닫기 </v-btn> 
            </v-card-actions> 
          </v-card> 
        </v-dialog>
        <Nuxt />
        
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>

  
</template>
<style scoped>

.v-date-picker:deep(.v-date-picker-table .v-btn:not(.v-btn--disabled) .holiday-color){
  color: red;
}

</style>
<script>
import { doc, query, getDoc,onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";

export default {
  name: 'DefaultLayout',
  watch: {
      picker() {
          this.$store.state.loadDate = this.picker;
      }
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      dialog: false,
      dialog_text:'',
      dialog_title:'',
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      oct_content:'',
      notice_content:'',
      id:'',
      pass:'',
      auth:'',
      cookie:[],
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
        icon: 'mdi-account-cog',
        title: 'Admin',
        to: '/admin',
        },
        {
        icon: 'mdi-calendar-month',
        title: 'Reservate',
        to: '/reservate',
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MRI Reservate System',
    }
  },
  mounted(){
    //const date = dayjs().format("YYYY-MM-DD");
    this.$store.state.loadDate = this.picker;
    this.items = [];
    this.items.push(
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/',
      }
    );
    this.cookie = this.$cookies.get('login');

    if(this.cookie){
      this.items.push(
        {
          icon: 'mdi-calendar-month',
          title: 'Reservate',
          to: '/reservate',
        }
      );
      if(this.cookie.auth === 'M'){
        this.items.push(
          {
          icon: 'mdi-account-cog',
          title: 'Admin',
          to: '/admin',
          }
        );
      }
    }
    this.oct_load();
    this.notice_load();
  },
  methods: {
    scrollReservate(where){
      let target = '';
      let targetTop = '';
      let abTop = '';
      let pretime = dayjs().hour();
      if(pretime == '8' || pretime == '9'){
        pretime = '0'+pretime;
      }
      this.dialog_title = '스크롤 불가';
      if(where === 'TCD'){
        if(document.getElementById("TCD_"+pretime+":00")){
          target = document.getElementById("TCD_"+pretime+":00");
        }else{
          this.dialog_text = '예약가능한 TCD 시간이 존재하지 않습니다.';
          this.dialog = true;
          return;
        }
      }
      if(where === 'MRI'){
        if(document.getElementById("MRI1_"+pretime+":00")){
          target = document.getElementById("MRI1_"+pretime+":00");
        }else{
          this.dialog_text = '예약가능한 MRI 시간이 존재하지 않습니다.';
          this.dialog = true;
          return;
        }
      }
      targetTop = target.getBoundingClientRect().top;
      abTop = window.pageYOffset + targetTop;
      
      window.scrollTo({top:abTop-100, behavior:'smooth'});
    },
    movetoday(){
      //const todate = dayjs().format("YYYY-MM-DD");
      //this.picker = todate;
      location.href = '/reservate';
    },
    disablePastDates(date_val){
      return date_val >= new Date().toISOString().substr(0,10);
    },
    async login(){
      this.dialog_title = '아이디 패스워드 확인';
      if(this.id === ''){
        this.dialog_text = '아이디를 입력하십시오.';
        this.dialog = true;
        return;
      }
      if(this.pass === ''){
        this.dialog_text = '패스워드를 입력하십시오.';
        this.dialog = true;
        return;
      }
      const q = doc(this.$db, "users", this.id);
      const docSnap = await getDoc(q);

      if (docSnap.exists()) {
          const get_data = docSnap.data();
          const login_data = get_data;
          if(login_data.pass === this.pass){
            this.$cookies.set('login', login_data); 
            location.reload();
          }else{
            this.dialog_text = '아이디와 패스워드 정보가 일치하지 않습니다.';
            this.dialog = true;    
          }
      } else {
        console.log("No such document!");
        this.dialog_text = '아이디 정보가 존재하지 않습니다.';
        this.dialog = true;
      }
      
    },
    logout(){
      this.$cookies.remove('login');
      location.href = '/';
    },
    async oct_load(){
      const q = onSnapshot(doc(this.$db, "oct", "oct"),(docSnap)=>{
        if (docSnap.exists()) {
          const get_data = docSnap.data();

          this.oct_content = get_data.oct;
        }
      });
    },

    async notice_load(){
      const q = onSnapshot(doc(this.$db, "notice", "notice"),(docSnap)=>{
        if (docSnap.exists()) {
          const get_data = docSnap.data();
          this.notice_content = get_data.notice;
        }
      });
    }


  }
}
</script>
