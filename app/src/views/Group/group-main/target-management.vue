<template>
  <div class="app--group-main--target-management">
    <fieldset class="create-target" :class="{ unfold: createTargetVisible }">
      <legend>
        <cy-button iconify-name="ic-round-add-circle-outline" class="inline"
          @click="toggleCreateTargetVisible()">
          新增目標
        </cy-button>
      </legend>
      <div v-if="createTargetVisible" class="content">
        <div class="column">
          <cy-icon-input>
            <template v-slot:pretext>
              <cy-icon-text iconify-name="bx-bx-list-plus" />
            </template>
            <input type="text" ref="create-target-name" placeholder="名稱">
          </cy-icon-input>
        </div>
        <div class="column">
          <cy-icon-input class="input-scope">
            <template v-slot:pretext>
              <cy-icon-text iconify-name="typcn-sort-numerically" />
            </template>
            <input type="number" ref="create-target-score" placeholder="分數" style="width: 6rem;">
          </cy-icon-input>
        </div>
        <cy-button iconify-name="ic-round-done" @click="createTarget" class="inline">
          新增目標
        </cy-button>
      </div>
    </fieldset>
    <div class="manage-content applicant">
      <div class="title">
        <cy-icon-text iconify-name="heroicons-solid:menu-alt-2">
          目標清單
        </cy-icon-text>
      </div>
      <div class="content">
        <template v-if="groupTargets.length != 0">
          <div class="item" v-for="(item, i) in groupTargets" :key="item.id">
            <span class="no">#{{ i }}</span>
            <span class="target-name">
            <cy-icon-text iconify-name="ic-outline-menu-book" class="text-large name">
              {{ item.name }}
            </cy-icon-text>
          </span>
          <span class="target-score">{{ item.score }}pt</span>
            <div class="buttons">
              <cy-button iconify-name="ic-round-delete" @click="deleteTarget(item)" class="inline">
                刪除
              </cy-button>
            </div>
          </div>
        </template>
        <cy-default-tips v-else iconify-name="bx-bx-message-alt-x">
          此群組還沒有任何目標。請點選上方的「建立目標」來建立。
        </cy-default-tips>
      </div>
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
        createTargetVisible: false
      };
    },
    computed: {
      groupTargets() {
        return this.groupAttrs.targets.map(p => {
          return {
            id: p._id,
            targetId: p._id,
            name: p.name,
            score: p.score
          }
        });
      },
      ...Vuex.mapState('group', {
        groupId: '_id',
        groupAttrs: 'attrs'
      })
    },
    methods: {
      toggleCreateTargetVisible(force) {
        force = force === void 0 ? !this.createTargetVisible : force;
        this.createTargetVisible = force;
      },
      createTarget() {
        let name = this.$refs['create-target-name'].value,
          score = this.$refs['create-target-score'].value;

        if (this.$store.getters['group/checkTargetExist']({ name })) {
          ShowMessage('目標的名稱不得重複。');
          return;
        }

        score = parseInt(score, 10);
        if (!name || !score)
          return;

        this.$store.dispatch('group/createTarget', { name, score })
          .then(() => {
            this.toggleCreateTargetVisible(false);
            ShowMessage('建立目標成功。');
          });
      },
      deleteTarget({ targetId }) {
        this.$store.dispatch('group/deleteTarget', { targetId })
          .then(() => ShowMessage('刪除目標成功。'));
      }
    }
  };
</script>
<style lang="less" scoped>
.create-target {
  transition: 0.5s ease;
  padding: 0.9rem;
  padding-left: 0;
  border: 0;

  > legend {
    padding: 0 0.6rem;
  }

  &.unfold {
    padding-left: 1rem;
    border: 1px solid var(--primary-light-2);
  }

  > .content {
    > .column {
      display: inline-block;
      margin-right: 1rem;
    }
  }
}
.manage-content {
  .item {
    grid-template-columns: 4rem 20rem 6rem 9rem;

    > .target-score {
      font-size: 1.2rem;
      color: var(--primary-orange);
    }
  }
}
</style>