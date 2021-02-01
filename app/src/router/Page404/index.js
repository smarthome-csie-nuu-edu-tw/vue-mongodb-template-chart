import vue_page404 from "@views/app/page404.vue";
import init from "./init.js";

export default {
  path: '*',
  component: vue_page404,
  beforeEnter(to, from, next) {
    init().then(() => next());
  },
  meta: {
    title: () => '404',
  }
};