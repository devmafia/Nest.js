import { provide, h, createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import "./style.css"
import apolloClient from './apollo-client';
import { DefaultApolloClient } from '@vue/apollo-composable'

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(router).use(store).mount('#app');
