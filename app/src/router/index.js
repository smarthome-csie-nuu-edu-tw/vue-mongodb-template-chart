import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// routers
import Home from "./Home";
import Group from "./Group";
import Page404 from "./Page404";

// stores
import navStore from "@store/nav.js";


// init of router

const routes = [
  Home,
  Page404,
  Group
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// ===== options of router ======
import store_user from "@store/user";

router.beforeEach(async (to, from, next) => {
  if (to) {
    { // set title and meta tags
      const data = to.matched.slice().reverse().find(p => p.meta && p.meta.title);
      if (data) {
        const title = data.meta.title;
        document.title = '主頁' + '｜' + (typeof title == 'function' ? title() : title);
      }
    }

    // set nav
    navStore.commit('setItems', {
      items: to.matched
        .filter(p => p.meta && p.meta.title)
        .map(p => {
          const title = p.meta.title;
          return {
            title: typeof title == 'function' ? title() : title,
            path: p.path
          };
        })
    });
  }

  if (to.path == '/login') { // 切換到登入頁面前，紀錄最後停留的頁面
    store_user.commit('user/setLoginRedirect', from.path);
  }

  // login
  // if (store_user.getters.userId === null && !['/login', '/register'].includes(to.path)) {
  //   next('/login');
  //   return;
  // }

  next();
});

export default router;