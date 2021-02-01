import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    items: []
  },
  mutations: {
    setItems(state, { items }){
      state.items = [{
        title: '主頁',
        path: '/'
      }, ...items];
    }
  }
});

export default store;