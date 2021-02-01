import app from "./app.vue";

import vue_group from "@views/Group/main.vue";
import init from "./init.js";

export default {
  path: '/group',
  component: app,
  beforeEnter(to, from, next) {
    init().then(() => next());
  },
  meta: {
    title: null
  },
  children: [{
    path: ':groupId',
    component: vue_group
  }]
};