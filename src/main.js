import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/router';
import store from '@/store/store';

import 'bootstrap/dist/css/bootstrap.css';
//import 'bootswatch/dist/[theme]/bootstrap.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('init');
  }
}).$mount('#app');
