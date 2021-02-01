<template>
  <div class="app--group-members">
    <template v-if="groupId !== null">
      <div class="title">
        <cy-icon-text iconify-name="ant-design:user-outlined" class="text-small">
          成員名單
        </cy-icon-text>
      </div>
      <div class="group-members">
        <div class="item" v-for="data in memberDatas" :key="data.userId"
          :class="{ 'is-admin': data.isAdmin }">
          <cy-icon-text iconify-name="ant-design:user-outlined" class="name">
            {{ data.nickname }}
          </cy-icon-text>
          <span class="score">{{ data.scoreSum }}pt</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import store from "@store/user";

  import Vuex from 'vuex';

  import { adminPermission } from "@lib/project.js";

  export default {
    store,
    computed: {
      memberDatas() {
        return this.groupAttrs.members.map(({ user, permission }) => {
          return {
            userId: user._id,
            nickname: user.nickname,
            scoreSum: user.groupScores.find(a => a.group == this.groupId).score,
            isAdmin: permission <= adminPermission,
          };
        })
        .sort((a, b) => b.scoreSum - a.scoreSum);
      },
      ...Vuex.mapState('group', {
        groupId: '_id',
        groupAttrs: 'attrs'
      })
    },
  };
</script>
<style lang="less" scoped>
  .app--group-members {
    padding: 0 0.9rem;
    width: 20rem;
    border-left: 1px solid var(--primary-light-2);

    > .title {
      color: var(--primary-light-4);
      margin-bottom: 0.6rem;
    }
  }

  .group-members {
    > .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--primary-light);
      padding: 0.4rem 0.6rem;

      &.is-admin {
        > .name {
          --icon-color: var(--primary-water-blue);
        }
      }

      > .score {
        margin-left: auto;
        color: var(--primary-orange);
      }
    }
  }
</style>