<template>
  <div class="app--group-main">
    <template v-if="groupId !== null">
      <div class="join-tips" v-if="!memberUser">
        <div>
          <cy-icon-text iconify-name="ri-error-warning-line" style="color: var(--primary-light-3)">
            你還不是這個群組的成員
          </cy-icon-text>
          <div style="padding: 0.6rem;">想要加入嗎？請點擊右邊的按紐。</div>
        </div>
        <cy-button iconify-name="ant-design:user-add-outlined" style="margin-left: 2rem;"
          @click="tryToApplyToJoinGroup">
          加入群組
        </cy-button>
        <span style="color: var(--primary-water-blue); font-size: 0.9rem;">
          {{ this.groupAttrs.options.join == 0 ? '審核制' : '自由加入' }}
        </span>
      </div>
      <div class="target-content">
        <div class="top-menu">
          <cy-button v-for="(item, i) in contentList" :key="item.iid" :iconify-name="item.icon" class="nav-button selection inline" :class="{ selected: currentContentIdx == i }" @click="selectCurrentContent(i)">
            {{ item.text }}
          </cy-button>
        </div>
        <div class="content">
          <group-home v-if="currentContentIdx == 0" />
          <target-finished-list v-else-if="currentContentIdx == 1" />
          <target-management v-else-if="currentContentIdx == 2" />
          <member-management v-else-if="currentContentIdx == 3" />
        </div>
      </div>
    </template>
    <div>
      <cy-window :visible="applyToJoinGroupWindowVisible" @close-window="toggleApplyToJoinGroupWindowVisible(false)">
        <template v-slot:title>
          <cy-icon-text iconify-name="ant-design:user-add-outlined">申請加入</cy-icon-text>
        </template>
        <div>請輸入您加入此群組的理由。亦可以不輸入直接跳過。</div>
        <div class="group-reason">
          <textarea ref="group-reason"></textarea>
        </div>
        <div style="text-align: right;">
          <cy-button iconify-name="ant-design:user-add-outlined" style="margin-left: 2rem;"
            @click="applyToJoinGroup">
            申請加入
          </cy-button>
        </div>
      </cy-window>
    </div>
  </div>
</template>
<script>
import store from "@store/user";

import Vuex from 'vuex';

import vue_home from "./group-main/home.vue";
import vue_targetManagement from "./group-main/target-management.vue";
import vue_targetFinishedList from "./group-main/target-finished-list.vue";
import vue_memberManagement from "./group-main/member-management.vue";

import ShowMessage from "@lib/modules/ShowMessage.js";
import { adminPermission } from "@lib/project.js";

export default {
  store,
  data() {
    return {
      currentContentIdx: 0,
      applyToJoinGroupWindowVisible: false
    };
  },
  beforeCreate() {
    this.$store.dispatch('group/select', this.$route.params.groupId);
  },
  methods: {
    toggleApplyToJoinGroupWindowVisible(force) {
      force = force === void 0 ? !this.applyToJoinGroupWindowVisible : force;
      this.applyToJoinGroupWindowVisible = force;
    },
    selectCurrentContent(idx) {
      this.currentContentIdx = idx;
    },
    applyToJoinGroup() {
      const reason = this.$refs['group-reason'].value;
      this.$store.dispatch('group/applyToJoin', { reason })
        .then(() => {
          ShowMessage('申請成功。請靜待群組管理員審核。');
          this.toggleApplyToJoinGroupWindowVisible(false);
        });
    },
    tryToApplyToJoinGroup() {
      if (!this.userId) {
        ShowMessage('請先登入。');
        this.$router.replace('/login');
      }
      if (this.groupAttrs.applicants.find(p => p.user._id == this.userId)) {
        ShowMessage('你已經申請過了。請靜待群組管理員審核。');
        return;
      }
      if (this.groupAttrs.options.join == 0) {
        this.toggleApplyToJoinGroupWindowVisible(true);
      }
      else {
        const adminId = this.groupAttrs.members.find(p => p.permission == 0).user._id;
        const userId = this.userId;
        this.$store.dispatch('group/join', { adminId, userId });
      }
    }
  },
  computed: {
    contentList() {
      const list = [{
        icon: 'jam-box',
        text: '首頁',
        permission: 100
      }, {
        icon: 'ic-outline-menu-book',
        text: '完成目標紀錄',
        permission: 10
      }, {
        icon: 'ic-outline-menu-book',
        text: '目標管理',
        permission: adminPermission
      }, {
        icon: 'ant-design:user-outlined',
        text: '成員管理',
        permission: adminPermission
      }];

      const per = this.memberUser ? this.memberUser.permission : 100;

      const res = list.filter(p => p.permission >= per);
      res.forEach((p, i) => p.iid = i);

      return res;
    },
    ...Vuex.mapGetters('group', {
      memberUser: 'memberUser'
    }),
    ...Vuex.mapState('group', {
      groupId: '_id',
      groupAttrs: 'attrs'
    }),
    ...Vuex.mapState('user', {
      userId: '_id',
    })
  },
  components: {
    'group-home': vue_home,
    'target-management': vue_targetManagement,
    'target-finished-list': vue_targetFinishedList,
    'member-management': vue_memberManagement
  }
};
</script>
<style lang="less" scoped>
@deep-operator: ~'>>>';

.join-tips {
  display: flex;
  align-items: center;
  padding: 1rem;

  border: 2px solid var(--primary-light-3);
}

.group-reason {
  margin: 1rem 0;

  > textarea {
    border: 1px solid var(--primary-light-2);
    max-width: 23rem;
    min-width: 23rem;
    min-height: 10rem;
    padding: 0.4rem;
  }
}

.app--group-main {
  padding: 0.3rem 0.8rem;
  width: 100%;
}

.target-content {
  margin-top: 0.5rem;

  >.top-menu {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--primary-light-2);
    padding: 0.4rem 0.6rem;
    flex-wrap: wrap;

    >.nav-button {
      margin-right: 1rem;
    }
  }

  >.content {
    padding: 0.6rem;
  }
}

@{deep-operator} .manage-content {
  margin-top: 1rem;
  > .title {
    color: var(--primary-light-4);
    display: flex;
    align-items: center;
  }
  > .content {
    margin-top: 0.6rem;

    > .item {
      padding: 0.7rem 0.9rem;
      border-top: 1px solid var(--primary-light);
      transition: 0.3s;
      display: grid;
      align-items: center;

      &:hover {
        background-color: rgba(var(--rgb-primary-light), 0.5);
      }

      > .no {
        font-size: 1.2rem;
      }

      > .member {
        display: inline-flex;
        align-items: center;
        > .nickname {
          margin-right: 0.8rem;
        }
        > .username {
          color: var(--primary-light-2);
          align-self: flex-end;
        }
      }

      > .buttons {
        display: inline-flex;
        align-items: center;

        > .button {
          margin-right: 0.8rem;
        }
      }
    }
  }
}
</style>