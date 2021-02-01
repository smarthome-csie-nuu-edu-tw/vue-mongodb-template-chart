import { ExpressServer } from "@lib/project.js";

const store = {
  namespaced: true,
  state() {
    return {
      _id: null,
      attrs: {},
      loginRedirect: '/'
    };
  },
  getters: {
    loginRedirect(state) {
      return state.loginRedirect;
    }
  },
  mutations: {
    login(state, data){
      state._id = data._id;
      state.attrs = data;
    },
    logout(state) {
      state._id = null;
      state.attrs = {};
    },
    updateGroups(state, groups) {
      state.attrs.groups = groups;
      console.log(groups);
    },
    setLoginRedirect(state, path) {
      state.loginRedirect = path;
    }
  },
  actions: {
    async createGroup({ state, commit }, { name, introduction }) {
      if (!state._id)
        throw new Error('User not login.');
      const createData = { name, introduction, userId: state._id };
      const res = await fetch(ExpressServer('/api/group/create'), {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Create group false.');
      commit('updateGroups', data.groups);
    },
    async register(context, { username, password, nickname }) {
      const submitData = { username, password, nickname };

      const f = await fetch(ExpressServer('/api/user/register'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      const res = await f.json();
      if (!res.success) {
        if (res.error && res.message)
          throw new Error(res.message);
        throw new Error('Register false');
      }
    },
    async login({ commit }, { username, password }) {
      const submitData = { username, password };

      const f = await fetch(ExpressServer('/api/user/login'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await f.json();
      if (data.success) {
        commit('login', data.user);
        return;
      }
      else if (data.error) {
        throw new Error(data.type);
      }
    }
  }
};

export default store;