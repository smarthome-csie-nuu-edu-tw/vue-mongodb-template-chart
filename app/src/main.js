import "@css/main/font/font.css";
import "@css/main/main.less";

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex);

Vue.config.productionTip = false

import vue_iconifyIcon from "@global-components/iconify-icon.vue";

import vuecy_window from "@global-components/Cyteria/window.vue";
import vuecy_button from "@global-components/Cyteria/button.vue";
import vuecy_iconText from "@global-components/Cyteria/icon-text.vue";
import vuecy_titleInput from "@global-components/Cyteria/title-input.vue";
import vuecy_stickyHeader from "@global-components/Cyteria/sticky-header.vue";
import vuecy_dragBar from "@global-components/Cyteria/drag-bar.vue";
import vuecy_inputCounter from "@global-components/Cyteria/input-counter.vue";
import vuecy_iconInput from "@global-components/Cyteria/icon-input.vue";
import vuecy_defaultTips from "@global-components/Cyteria/default-tips.vue";

Vue.component('iconify-icon', vue_iconifyIcon);

Vue.component('cy-window', vuecy_window);
Vue.component('cy-button', vuecy_button);
Vue.component('cy-icon-text', vuecy_iconText);
Vue.component('cy-title-input', vuecy_titleInput);
Vue.component('cy-sticky-header', vuecy_stickyHeader);
Vue.component('cy-drag-bar', vuecy_dragBar);
Vue.component('cy-input-counter', vuecy_inputCounter);
Vue.component('cy-icon-input', vuecy_iconInput);
Vue.component('cy-default-tips', vuecy_defaultTips);

import router from "./router/index.js";

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
