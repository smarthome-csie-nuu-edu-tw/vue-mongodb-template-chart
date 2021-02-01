<template>
  <div class="main--group-content">
    <div v-if="userId != null">
      <div class="top">
        <div class="buttons">
          <cy-button iconify-name="uil-create-dashboard" class="inline"
            @click="toggleCreateGroupWindow(true)">
            建立群組
          </cy-button>
        </div>
      </div>
      <div class="groups-content">
        <cy-icon-text iconify-name="bx-bxs-user-detail" class="content-title">
          群組列表
        </cy-icon-text>
        <template v-if="userAttrs && userAttrs.groups.length > 0">
          <div v-for="(g, i) in userAttrs.groups" :key="g._id" class="group-item"
            @click="selectGroup(g._id)">
            <span class="group-no">#{{ i }}</span>
            <cy-icon-text iconify-name="mdi-leaf" class="text-large group-name">
              {{ g.name }}
            </cy-icon-text>
          </div>
        </template>
        <cy-default-tips v-else iconify-name="carbon-circle-dash">
          您還沒有加入任何群組。<br />您可以建立新的群組，或是透過其他人分享的網址加入群組。
        </cy-default-tips>
      </div>
    </div>
    <cy-default-tips v-else iconify-name="bx-bxs-user-x">
      請先<router-link to="/login">登入</router-link>。
    </cy-default-tips>
    <div class="window-container">
      <cy-window :visible="createGroupVisible" @close-window="toggleCreateGroupWindow(false)"
        class="create-group">
        <template v-slot:title>
          <cy-icon-text iconify-name="ic-baseline-group-add">
            群組資訊
          </cy-icon-text>
        </template>
        <template v-slot:default>
          <fieldset class="column">
            <legend>群組名稱</legend>
            <input type="text" ref="input-group-name">
          </fieldset>
          <fieldset class="column">
            <legend>群組簡述</legend>
            <textarea ref="input-group-introduction"></textarea>
          </fieldset>
          <div style="text-align: right;">
            <cy-button iconify-name="ic-round-done" @click="createGroup">
              建立群組
            </cy-button>
          </div>
        </template>
      </cy-window>
    </div>
  </div>
</template>
<script>
  import store from "@store/user";

  import Vuex from 'vuex';

  import ShowMessage from "@lib/modules/ShowMessage.js";

  export default {
    store,
    data() {
      return {
        createGroupVisible: false
      };
    },
    computed: {
      ...Vuex.mapState('user', {
        userId: '_id',
        userAttrs: 'attrs'
      })
    },
    methods: {
      toggleCreateGroupWindow(force) {
        force = force === void 0 ? !this.createGroupVisible : force;
        this.createGroupVisible = force;
      },
      createGroup() {
        const name = this.$refs['input-group-name'].value,
          introduction = this.$refs['input-group-introduction'].value;

        const data = { name, introduction };
        store.dispatch('user/createGroup', data)
          .then(() => {
            this.toggleCreateGroupWindow(false);
            ShowMessage('建立群組成功。');
          })
          .catch(e => console.log(e));
      },
      selectGroup(id) {
        this.$router.replace('/group/' + id);
      }
    }
  };
</script>
<style lang="less" scoped>
  @deep-operator: ~'>>>';

  .main--group-content {
    width: 100%;
    padding: 0.6rem 1rem;
  }
  .top {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--primary-light-3);
    padding: 0.2rem 0.8rem;

    .buttons {
      margin-left: auto;
    }
  }

  .groups-content {
    > .content-title {
      margin: 0.6rem 0.5rem;
      margin-bottom: 0;
    }

    > .group-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--primary-light);
      padding: 0.8rem 1rem;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        background-color: rgba(var(--rgb-primary-light), 0.5);
      }

      > .group-no {
        font-size: 1.2rem;
        margin-right: 1.5rem;
      }

      > .group-name {
      }
    }
  }

  .create-group {
    .column {
      border: 1px solid var(--primary-light-2);
      margin-bottom: 1rem;

      legend {
        color: var(--primary-light-3);
        font-size: 0.9rem;
        padding: 0 0.6rem;
      }

      > input {
        border: 0;
        width: 100%;
        font-size: 1rem;
      }

      > textarea {
        max-width: 21rem;
        min-width: 21rem;
        min-height: 5rem;
        border: 0;
        outline: 0!important;
        font-size: 1rem;
      }
    }
  }
</style>