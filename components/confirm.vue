<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>

        <v-card-text>
          {{ msg }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click.native="cancel"
          >
            취소
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click.native="ok"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        title:'',
        msg:'',
        resolve:null,
        reject:null
      }
    },
    methods:{
      open(title, msg){
        this.dialog = true;
        this.title = title;
        this.msg = msg;
        return new Promise((resolve, reject)=>{
          this.resolve = resolve;
          this.reject = reject;
        });
      },
      ok(){
        this.resolve(true);
        this.dialog = false;
      },
      cancel(){
        this.resolve(false);
        this.dialog = false;
      }
    }
  }
</script>