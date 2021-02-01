import Vue from "vue";

import { ExpressServer } from "@lib/project.js";

const store = {
  namespaced: true,
  state() {
    return {
      _id: null,
      attrs: {}
    };
  },
  getters: {
    checkTargetExist: state => ({ name }) => {
      return state.attrs.targets.find(p => p.name == name);
    },
    memberUser(state, getters, rootState, rootGetters) {
      return state.attrs.members.find(p => p.user._id == rootGetters.userId);
    }
  },
  mutations: {
    setCurrent(state, group) {
      state._id = group._id;
      state.attrs = group;
    },
    updateAttr(state, { name, data }) {
      state.attrs[name] = data;
    },
    modifyArrayAttr(state, { name, index, data, type }) {
      const p = state.attrs[name];
      if (!Array.isArray(p))
        throw new Error(`attr name: ${name} of group is not array.`);
      if (type == 'replace')
        Vue.set(p, index, data);
      else if (type == 'remove')
        p.splice(index, 1);
    }
  },
  actions: {
    async select({ commit }, groupId) {
      const res = await fetch(ExpressServer('/api/group/data/' + groupId));
      const data = await res.json();

      if (!data.success)
        throw new Error('fetch group data false.');

      commit('setCurrent', data.group);
    },
    async modifyMemberPermission({ commit, state, rootState }, { memberId, permission }) {
      const bodyData = {
        adminId: rootState.user._id,
        groupId: state._id,
        memberId,
        permission
      };
      const res = await fetch(ExpressServer('/api/group/member/permission'), {
        method: 'PATCH',
        body: JSON.stringify(bodyData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Create target false.');

      commit('updateAttr', {
        name: 'members',
        data: data.members
      });
    },
    async removeMember({ commit, state, rootState }, { memberId }) {
      const bodyData = {
        adminId: rootState.user._id,
        groupId: state._id,
        memberId
      };
      const res = await fetch(ExpressServer('/api/group/member/remove'), {
        method: 'DELETE',
        body: JSON.stringify(bodyData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Create target false.');

      commit('updateAttr', {
        name: 'members',
        data: data.members
      });
    },
    async createTarget({ commit, state, rootState }, { name, score }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const createData = {
        name, score,
        userId: rootState.user._id,
        groupId: state._id
      };
      const res = await fetch(ExpressServer('/api/group/target/create'), {
        method: 'POST',
        body: JSON.stringify(createData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Create target false.');

      if (data.targets) {
        commit('updateAttr', {
          name: 'targets', data: data.targets
        });
      }
      else if (data.pendingTargetList) {
        commit('updateAttr', {
          name: 'pendingTargetList', data: data.pendingTargetList
        });
      }
    },
    async submitTarget({ commit, state, rootState }, { targetId }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        userId: rootState.user._id,
        groupId: state._id,
        targetId
      };
      const res = await fetch(ExpressServer('/api/group/target/submit'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Submit target false.');
      commit('updateAttr', {
        name: 'targetFinishedList', data: data.targetFinishedList
      });
    },
    async unsubmitTarget({ commit, state, rootState }, { unsubmitId }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        adminId: rootState.user._id,
        groupId: state._id,
        unsubmitId
      };
      const res = await fetch(ExpressServer('/api/group/target/unsubmit'), {
        method: 'DELETE',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Unsubmit target false.');
      commit('updateAttr', {
        name: 'targetFinishedList', data: data.targetFinishedList
      });
    },
    async finishTarget({ commit, state, rootState }, { finishId }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        adminId: rootState.user._id,
        groupId: state._id,
        finishId
      };
      const res = await fetch(ExpressServer('/api/group/target/finish'), {
        method: 'PATCH',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Finish target false.');
      commit('updateAttr', {
        name: 'targetFinishedList', data: data.targetFinishedList
      });
      commit('updateAttr', {
        name: 'members', data: data.members
      });
      commit('updateAttr', {
        name: 'targets', data: data.targets
      });
    },
    async deleteTarget({ commit, state, rootState }, { targetId }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        adminId: rootState.user._id,
        groupId: state._id,
        targetId
      };
      const res = await fetch(ExpressServer('/api/group/target/delete'), {
        method: 'DELETE',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Delete target false.');
      commit('updateAttr', {
        name: 'targetFinishedList', data: data.targetFinishedList
      });
      commit('updateAttr', {
        name: 'targets', data: data.targets
      });
    },
    async searchTarget({ commit, state, rootState }, { username, targetName }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        groupId: state._id,
        username, targetName
      };
      const res = await fetch(ExpressServer('/api/group/target/search'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Search target false.');
      
      commit('updateAttr', {
        name: 'targetFinishedList', data: data.targetFinishedList
      });
    },
    async applyToJoin({ state, commit, rootState }, { reason }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        userId: rootState.user._id,
        groupId: state._id,
        reason
      };
      const res = await fetch(ExpressServer('/api/group/apply-to-join'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Apply to join group false.');
      commit('updateAttr', {
        name: 'applicants', data: data.applicants
      });
    },
    async join({ state, commit, rootState }, { adminId, userId }) {
      if (!rootState.user._id)
        throw new Error('User not login.');
      const submitData = {
        adminId, userId,
        groupId: state._id
      };
      const res = await fetch(ExpressServer('/api/group/join'), {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const data = await res.json();
      if (!data.success)
        throw new Error('Join to group false.');
      commit('updateAttr', {
        name: 'members', data: data.members
      });
      commit('updateAttr', {
        name: 'applicants', data: data.applicants
      });
    }
  }
};

export default store;