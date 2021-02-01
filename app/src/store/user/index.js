import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

import user from "./user.js";
import group from "./group.js";

const store = new Vuex.Store({
  modules: {
    user,
    group
  },
  getters: {
    userId(state) {
      return state.user._id;
    }
  }
});

export default store;