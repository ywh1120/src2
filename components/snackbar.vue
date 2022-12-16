<template>
    <v-snackbar v-model="snackbar" 
        :timeout="snack_timeout" > {{ snack_text }} 
    </v-snackbar>
</template>
<script>
export default { 
    data: () => ({ 
        snackbar: false, 
        snack_text: '', 
        snack_timeout: 3000,
    }),
    methods:{
        open(snack_text){
            this.snack_text = snack_text;
            this.snackbar = true;
        }
    }
}
</script>