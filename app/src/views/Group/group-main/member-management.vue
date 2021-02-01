<template>
  <div class="app--group-main--member-management">
    <div class="manage-content applicant">
      <div class="title">
        <cy-icon-text iconify-name="heroicons-solid:menu-alt-2">
          申請加入者列表
        </cy-icon-text>
      </div>
      <div class="content">
        <template v-if="applicants.length != 0">
          <div class="item" v-for="(item, i) in applicants" :key="item.id">
            <span class="no">#{{ i }}</span>
            <span class="member">
              <cy-icon-text iconify-name="ant-design:user-outlined" class="text-large nickname">
                {{ item.nickname }}
              </cy-icon-text>
              <span class="username">{{ item.username }}</span>
            </span>
            <span class="reason">
              {{ item.reason }}
            </span>
            <div class="buttons">
              <cy-button iconify-name="ic-round-done" @click="userJoin(item)" class="inline">
                加入群組
              </cy-button>
            </div>
          </div>
        </template>
        <cy-default-tips v-else iconify-name="bx-bx-message-alt-x">
          目前沒有人申請喔。
        </cy-default-tips>
      </div>
    </div>
    <div class="manage-content members">
      <div class="title">
        <cy-icon-text iconify-name="ant-design:user-outlined">
          成員列表
        </cy-icon-text>
      </div>
      <div class="content">
        <div class="item" v-for="(item, i) in groupMembers" :key="item.id">
          <span class="no">#{{ i }}</span>
          <span class="member">
            <cy-icon-text :iconify-name="item.isAdmin ? 'ic-outline-admin-panel-settings' : 'ant-design:user-outlined'"
              class="text-large nickname" :class="{ 'is-admin': item.isAdmin }">
              {{ item.nickname }}
            </cy-icon-text>
            <span class="username">{{ item.username }}</span>
          </span>
          <div class="buttons">
            <cy-button iconify-name="ic-round-close" v-if="item.removeable" class="inline button"
              @click="removeMember(item)">
              {{ item.isSelf ? '退出群組' : '移出群組' }}
            </cy-button>
            <cy-button iconify-name="ic-outline-admin-panel-settings" v-if="!item.isAdmin" class="inline button"
              @click="setAdmin(item)">
              設為管理員
            </cy-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from "@store/user";

  import Vuex from 'vuex';

  import ShowMessage from "@lib/modules/ShowMessage.js";
  import { adminPermission } from "@lib/project.js";

  export default {
    store,
    computed: {
      applicants() {
        return this.groupAttrs.applicants.map(p => {
          return {
            id: p._id,
            userId: p.user._id,
            username: p.user.username,
            nickname: p.user.nickname,
            reason: p.reason
          };
        });
      },
      groupMembers() {
        const memberUser = this.$store.getters['group/memberUser'];
        return this.groupAttrs.members.map(p => {
          const isSelf = memberUser._id == p._id;
          return {
            id: p._id,
            username: p.user.username,
            nickname: p.user.nickname,
            isAdmin: p.permission <= adminPermission,
            isFounder: p.permission == 0,
            removeable: memberUser.permission < p.permission || isSelf,
            isSelf
          };
        });
      },
      ...Vuex.mapState('group', {
        groupId: '_id',
        groupAttrs: 'attrs'
      }),
      ...Vuex.mapState('user', {
        userId: '_id',
      })
    },
    methods: {
      userJoin(item) {
        const userId = item.userId;
        const adminId = this.userId;
        this.$store.dispatch('group/join', { adminId, userId })
          .then(() => ShowMessage(`${item.nickname}(${item.username})已成功加入群組。`));
      },
      setAdmin(item) {
        const memberId = item.id;
        const permission = adminPermission;
        this.$store.dispatch('group/modifyMemberPermission', { memberId, permission })
          .then(() => ShowMessage(`${item.nickname}(${item.username})已調整為管理員。`));
      },
      removeMember(item) {
        const memberId = item.id;
        this.$store.dispatch('group/removeMember', { memberId })
          .then(() => ShowMessage(`${item.nickname}(${item.username})已從群組中被移除。`));
      }
    }
  };
</script>
<style lang="less" scoped>
.manage-content.applicant {
  .item {
    grid-template-columns: 4rem 18rem 20rem 7rem;

    > .reason {
      font-size: 1rem;
    }
  }
}
.manage-content.members {
  .item {
    grid-template-columns: 4rem 18rem 15rem;

    > .member {
      > .nickname.is-admin {
        --icon-color: var(--primary-water-blue);
      }
    }
  }
}
</style>