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
        <v-date-picker v-model="picker" locale="ko-kr" full-width class="mt-4" >
        </v-date-picker> 
      </v-row>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-container v-if="cookie">
        Welcome, {{cookie.id}}!<v-btn color="warning" dark @click="logout()"> 로그아웃 </v-btn>        
      </v-container>
      <v-container v-else>
        <v-row>
          <v-col>
            <v-text-field v-model="id" label="아이디" placeholder="아이디입력" elevation="3" outlined hide-details dense ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="pass" label="비밀번호" placeholder="비밀번호입력" elevation="3" outlined hide-details dense ></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="success" dark @click="login()"> 로그인 </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-dialog v-model="dialog" persistent max-width="290" > 
          <v-card> 
            <v-card-title class="text-h5"> 아이디 패스워드 확인 </v-card-title> 
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

<script>
import { doc, query, getDoc, collection, getDocs } from "firebase/firestore";

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
      dialog_text:false,
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
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
    this.$store.state.loadDate = '2022.11.10';
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
  },
  methods: {
    selectedDates(val){
        this.$store.state.loadDate = val;
    },
    async login(){
      //const q = query(collection(this.$db, "users"), where("id","==",this.id));
      //const q = query(collection(this.$db, "description"), orderBy("desc","asc"));
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
    }
  }
}
</script>
