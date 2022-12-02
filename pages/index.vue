<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <WiltseLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Wiltse MRI Reservate System
        </v-card-title>
        <v-card-text>
          <p>
            윌스 MRI 예약 시스템 메인페이지입니다.
          </p>
          <p>
            예약 시스템 기능을 이용하시려면 먼저 로그인을 해주세요.
          </p>
          
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/reservate"> 예약시작 </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>
