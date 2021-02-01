<template>
  <div class="app--group-main--target-finished-list">
    <div class="manage-content">
      <div class="title">
        <cy-icon-text iconify-name="heroicons-solid:menu-alt-2">
          未審核清單
        </cy-icon-text>
      </div>
      <div class="content" v-if="pendingList.length > 0">
        <div class="item" v-for="(item, i) in pendingList" :key="item.id">
          <span class="no">#{{ i }}</span>
          <span class="member">
            <cy-icon-text iconify-name="ant-design:user-outlined" class="text-large nickname">
              {{ item.memberNickname }}
            </cy-icon-text>
            <span class="username">{{ item.memberUsername }}</span>
          </span>
          <span class="target-name">
            <cy-icon-text iconify-name="ic-outline-menu-book" class="text-large name">
              {{ item.targetName }}
            </cy-icon-text>
          </span>
          <span class="target-score">{{ item.targetScore }}pt</span>
          <div v-if="item.auditable || item.cancelable">
            <cy-button v-if="item.auditable" iconify-name="ic-round-done"
              style="margin-right: 0.8rem;"
              @click="finishTarget(item.id)" class="inline">
              確認
            </cy-button>
            <cy-button v-if="item.cancelable" iconify-name="ic-round-close"
              style="color: var(--primary-light-2);"
              @click="unsubmitTarget(item.id)" class="inline">
              取消
            </cy-button>
          </div>
        </div>
      </div>
      <cy-default-tips v-else iconify-name="mdi-flower-tulip">
        都已經審核完畢了喔～
      </cy-default-tips>
    </div>
    <div class="manage-content">
      <div class="title">
        <cy-icon-text iconify-name="heroicons-solid:menu-alt-2">
          已完成紀錄
        </cy-icon-text>
        <cy-button class="inline" iconify-name="ant-design:search-outlined"
          style="margin-left: auto;"
          @click="searchOptionVisible = !searchOptionVisible">
          過濾
        </cy-button>
      </div>
      <div v-if="searchOptionVisible" class="search-options">
        <div class="top-container">
          <div>
            <cy-icon-input class="input-scope">
              <template v-slot:pretext>
                <cy-icon-text iconify-name="ant-design:search-outlined" />
              </template>
              <input type="text" ref="search-username" placeholder="使用者名稱">
            </cy-icon-input>
            <cy-icon-input class="input-scope">
              <template v-slot:pretext>
                <cy-icon-text iconify-name="ant-design:search-outlined" />
              </template>
              <input type="text" ref="search-target-name" placeholder="目標名稱">
            </cy-icon-input>
          </div>
          <cy-button class="inline" iconify-name="ant-design:search-outlined"
            style="margin-left: 1.2rem;"
            @click="searchTarget">
            更新
          </cy-button>
        </div>
        <div style="font-size: 0.9rem; color: var(--primary-light-4);">
          請於左邊的欄位輸入過濾條件，例如：使用者名稱輸入「t39」，則會過濾出所有使用者名稱包含「t39」的人，如「t3939」、「abct3920」。目標名稱同理。
          <br />過濾採複合條件，一個項目須同時符合兩個欄位所輸入的條件。
          <br />沒有輸入任何值(留白)的欄位，該條件會被忽略。也就是說，兩個欄位都沒輸入時就會顯示所有項目。
        </div>
      </div>
      <div class="content" v-if="finishedList.length > 0">
        <div class="item" v-for="(item, i) in finishedList" :key="item.id">
          <span class="no">#{{ i }}</span>
          <span class="member">
            <cy-icon-text iconify-name="ant-design:user-outlined" class="text-large nickname">
              {{ item.memberNickname }}
            </cy-icon-text>
            <span class="username">{{ item.memberUsername }}</span>
          </span>
          <span class="target-name">
            <cy-icon-text iconify-name="ic-outline-menu-book" class="text-large name">
              {{ item.targetName }}
            </cy-icon-text>
          </span>
          <span class="target-score">{{ item.targetScore }}pt</span>
        </div>
      </div>
      <cy-default-tips v-else iconify-name="bx-bx-wind">
        這裡目前空空如也。
      </cy-default-tips>
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
    data() {
      return {
        createTargetVisible: false,
        searchOptionVisible: false
      };
    },
    computed: {
      pendingList() {
        return this.groupAttrs.targetFinishedList
          .filter(p => !p.passed)
          .map(p => {
            const memberUser = this.$store.getters['group/memberUser'];
            const per = memberUser ? memberUser.permission : 100;

            return {
              id: p._id,
              targetName: p.target.name,
              targetScore: p.target.score,
              memberNickname: p.member.nickname,
              memberUsername: p.member.username,
              auditable: this.userId != p.member._id && per <= adminPermission,
              cancelable: this.userId == p.member._id || per <= adminPermission
            };
          });
      },
      finishedList() {
        return this.groupAttrs.targetFinishedList
          .filter(p => p.passed)
          .map(p => {
            return {
              id: p._id,
              targetName: p.target.name,
              targetScore: p.target.score,
              memberNickname: p.member.nickname,
              memberUsername: p.member.username
            };
          });
      },
      ...Vuex.mapState('group', {
        groupId: '_id',
        groupAttrs: 'attrs'
      }),
      ...Vuex.mapState('user', {
        userId: '_id'
      })
    },
    methods: {
      finishTarget(finishId) {
        this.$store.dispatch('group/finishTarget', { finishId })
          .then(() => ShowMessage('確認成功。'));
      },
      searchTarget() {
        const username = this.$refs['search-username'].value,
          targetName = this.$refs['search-target-name'].value;
        this.$store.dispatch('group/searchTarget', { username, targetName })
          .then(() => ShowMessage('更新完畢。'));
      },
      unsubmitTarget(unsubmitId) {
        this.$store.dispatch('group/unsubmitTarget', { unsubmitId })
          .then(() => ShowMessage('取消成功。'));
      }
    }
  };
</script>
<style lang="less" scoped>
.manage-content {
  .item {
    grid-template-columns: 4rem 18rem 20rem 6rem 9rem;

    > .target-score {
      font-size: 1.2rem;
      color: var(--primary-orange);
    }
  }
}

.search-options {
  padding: 0.6rem 1rem;
  margin: 1rem 0;
  border: 1px solid var(--primary-light-2);
  > .top-container {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
}
</style>