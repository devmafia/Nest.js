<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
onMounted( () => {
    store.commit('loadCartFromStorage');
 }
)

</script>

<style scoped>


</style>
