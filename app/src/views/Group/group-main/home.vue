<template>
  <div class="app--group-main--home">
    <div class="title">
      <cy-icon-text iconify-name="mdi-leaf" class="text-large">
        {{ groupAttrs.name }}
      </cy-icon-text>
    </div>
    <div class="introduction" v-if="groupAttrs.introduction">
      {{ groupAttrs.introduction }}
    </div>
    <div class="targets">
      <template v-if="groupAttrs.targets.length != 0">
        <div class="target-item" v-for="data in groupTargets" :key="data.name">
          <div class="score-container">
            <span>{{ data.score }}</span>
          </div>
          <div class="content">
            <div class="content-title">
              <cy-icon-text iconify-name="mdi-flower-tulip">
                {{ data.name }}
              </cy-icon-text>
            </div>
            <div class="inner-content">
              <cy-icon-text iconify-name="ant-design:user-outlined" class="text-small">
                被完成了{{ data.finished }}次
              </cy-icon-text>
            </div>
          </div>
          <cy-button v-if="memberUser" iconify-name="ic-round-done"
            class="finished-button" @click="submitTarget(data.targetId)">
            我完成了
          </cy-button>
        </div>
      </template>
      <template v-else>
        <cy-default-tips iconify-name="bx-bx-message-rounded-x" style="grid-column-start: span 2;">
          這個群組的管理員很懶，還沒有建立任何目標。
        </cy-default-tips>
      </template>
    </div>
  </div>
</template>
<script>
  import store from "@store/user";

  import Vuex from 'vuex';

  import ShowMessage from "@lib/modules/ShowMessage.js";

  export default {
    store,
    computed: {
      groupTargets() {
        return this.groupAttrs.targets.map(p => {
          return {
            name: p.name,
            score: p.score,
            finished: p.finished,
            targetId: p._id
          }
        });
      },
      ...Vuex.mapGetters('group', {
        memberUser: 'memberUser'
      }),
      ...Vuex.mapState('group', {
        groupId: '_id',
        groupAttrs: 'attrs'
      })
    },
    methods: {
      submitTarget(targetId) {
        this.$store.dispatch('group/submitTarget', { targetId })
          .then(() => ShowMessage('提交成功，請等待管理員審核。'));
      }
    }
  };
</script>
<style lang="less" scoped>
.introduction {
  padding: 0.6rem;
  margin-bottom: 1rem;
}
.targets {
  display: grid;
  grid-template-columns: repeat(auto-fit, 28rem);

  > .target-item {
    border-top: 1px solid var(--primary-light);
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0.2rem 0.4rem;

    > .score-container {
      margin-right: 1rem;
      width: 4rem;
      height: 4rem;
      border: 2px solid var(--primary-light-3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      > span {
        font-size: 1.5rem;
      }
    }

    > .content {
      > .content-title {
        color: var(--primary-purple);
      }
      > .inner-content {
        padding: 0.3rem 0.7rem;
      }
    }

    > .finished-button {
      margin-left: auto;
    }
  }
}
</style>