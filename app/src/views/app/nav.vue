<template>
    <nav class="app--nav">
      <div class="content">
        <template v-for="(item, i) in items">
          <iconify-icon v-if="i != 0" name="ic-round-keyboard-arrow-right" :key="item.title + '--icon'" />
          <span :key="item.title + '--text'">
            <router-link :to="item.path" v-if="i != items.length - 1">
              {{ item.title }}
            </router-link>
            <cy-icon-text v-else iconify-name="ant-design:home-outlined" class="text-small">
              <router-link :to="item.path">
                {{ item.title }}
              </router-link>
            </cy-icon-text>
            <!-- <template v-else>
              {{ item.title }}
            </template> -->
          </span>
        </template>
      </div>
      <cy-button v-if="userId"
        iconify-name="bx-bx-log-out" @click="logout"
        class="inline text-small" style="margin-left: auto;">
        登出
      </cy-button>
    </nav>
</template>

<script>
  import store from "@store/nav.js";
  import user_store from "@store/user";

  import Vuex from 'vuex';

  export default {
    store,
    computed: {
      ...Vuex.mapState(['items']),
      userId() {
        return user_store.getters.userId;
      }
    },
    methods: {
      logout() {
        this.$store.commit('logout');
        this.$router.replace('/login', () => this.$store.commit('user/setLoginRedirect', '/'));
      }
    }
  };
</script>

<style lang="less" scoped>
  @deep-operator: ~'>>>';

  .app--nav {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.4rem;
    border-bottom: 1px solid var(--primary-light);
    margin-bottom: 1rem;
    min-height: 2.5rem;
  }

  .content {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    overflow-y: auto;
    font-size: 0.9rem;
    padding: 0 0.6rem;

    // @{deep-operator} svg {
    //   width: 1.2rem;
    //   height: 1.2rem;
    //   fill: currentcolor;
    //   color: var(--primary-light-2);
    //   margin: 0 0.6rem;
    // }
  }

  .setting-button {
    margin-left: auto;
  }
</style>