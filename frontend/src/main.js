import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VueChatScroll from 'vue-chat-scroll'
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'

Vue.use(VueCroppie);
Vue.use(VueChatScroll)
Vue.use(PerfectScrollbar);

Vue.config.productionTip = false

export const bus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
