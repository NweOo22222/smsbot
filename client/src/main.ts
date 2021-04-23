import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Axios from "axios";
import VueAxios from "vue-axios";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";

Vue.use(VueAxios, Axios);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
