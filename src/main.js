import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

new Vue({
  render: h => h(App),
}).$mount('#app');
