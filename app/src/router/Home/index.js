import app from "./app.vue";

import vue_home from "@views/Home/Home/main.vue";
import vue_loginRegister from '@views/Home/Home/login-register.vue';
import init from "./init.js";

export default {
  path: '/',
  component: app,
  beforeEnter(to, from, next) {
    init().then(() => next());
  },
  meta: {
    title: null
  },
  children: [{
    path: '',
    component: vue_home
  }, {
    path: ':renderType(login|register)',
    component: vue_loginRegister
  }]
};