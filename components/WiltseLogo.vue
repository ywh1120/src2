<template>
  <img class="vuetify-logo" alt="Vuetify Logo" src="/wiltse.png" />
</template>

<style>
.vuetify-logo {
  height: 300px;
  width: 300px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>