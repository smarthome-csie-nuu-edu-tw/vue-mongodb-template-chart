<template>
  <div class="main--user-login-register">
    <div class="container">
      <div class="sub-container">
        <div class="title">
          <cy-icon-text iconify-name="ant-design:user-outlined" class="text-small">
            {{ renderType == 'login' ? '登入' : '註冊' }}
          </cy-icon-text>
        </div>
        <div class="content">
          <form>
            <cy-icon-input class="input-item">
              <template v-slot:pretext>
                <cy-icon-text iconify-name="ant-design:user-outlined">帳號</cy-icon-text>
              </template>
              <input type="text" placeholder="帳號" autocomplete="username" ref="username">
            </cy-icon-input>
            <cy-icon-input class="input-item">
              <template v-slot:pretext>
                <cy-icon-text iconify-name="mdi-key">密碼</cy-icon-text>
              </template>
              <input type="password" placeholder="密碼" autocomplete="current-password" ref="password"
                @keyup.enter="passwordKeyupEnter">
            </cy-icon-input>
            <cy-icon-input v-if="renderType == 'register'" class="input-item">
              <template v-slot:pretext>
                <cy-icon-text iconify-name="bx-bx-game">暱稱</cy-icon-text>
              </template>
              <input type="text" placeholder="...." ref="nickname">
            </cy-icon-input>
          </form>
        </div>
        <div class="buttons">
          <cy-button v-if="renderType == 'login'"
            iconify-name="ic-round-login" class="inline" style="margin-left: auto;"
            @click="login">
            登入
          </cy-button>
          <cy-button v-else iconify-name="ic-round-done" class="inline" style="margin-left: auto;"
            @click="register">
            註冊
          </cy-button>
        </div>
      </div>
      <template v-if="renderType == 'login'">
        <div style="width: 100%;"></div>
        <div class="tips">
          <div>沒有帳號嗎？點這裡<router-link to="/register">註冊</router-link></div>
        </div>
      </template>
    </div>
    <div class="fix-line"></div>
  </div>
</template>
<script>
import store from "@store/user";
import ShowMessage from "@lib/modules/ShowMessage.js";

export default {
  store,
  computed: {
    renderType() {
      return this.$route.params.renderType;
    }
  },
  methods: {
    passwordKeyupEnter() {
      this.renderType == 'login' && this.login();
    },
    login() {
      const username = this.$refs['username'].value,
        password = this.$refs['password'].value;

      if (!this.checkField({ username, password }))
        return;

      this.$store.dispatch('user/login', { username, password })
        .then(() => {
          ShowMessage('登入成功。');
          this.$router.replace(this.$store.getters['user/loginRedirect'] || '/');
        })
        .catch(err => {
          if (err.message == 'wrong-password') {
            ShowMessage('密碼錯誤。請重新輸入。');
            this.$refs['password'].value = '';
          }
          else if (err.message == 'username-not-found') {
            ShowMessage('不存在的使用者名稱。請確認使用者名稱是否正確。');
          }
          else {
            ShowMessage('處理登入程序發生未知的錯誤，請稍後再試。');
          }
        });
    },
    register() {
      const username = this.$refs['username'].value,
        password = this.$refs['password'].value,
        nickname = this.$refs['nickname'].value;

      if (!this.checkField({ username, password }))
        return;

      this.$store.dispatch('user/register', { username, password, nickname })
        .then(() => {
          ShowMessage('註冊成功。');
          ShowMessage('自動導向登入頁面...');
          this.$router.replace('/login', () => this.$store.commit('user/setLoginRedirect', '/'));
        })
        .catch(err => {
          console.log(err);
          if (err.message == 'username-duplicate')
            ShowMessage('這個使用者名稱已經被使用過了。');
          else
            ShowMessage('處理註冊程序發生未知的錯誤，請稍後再試。');
        });
    },
    checkField({ username, password }) {
      const check1 = v => /^[a-zA-Z0-9_]+$/.test(v);

      if (!check1(username) || !check1(password)) {
        ShowMessage('帳號及密碼只能包含英文、數字及底線，並且不得為空。');
        return false;
      }
      if (username.length < 4 || username.length > 32) {
        ShowMessage('帳號必須至少4個字元，最多32個字元。');
        return false;
      }
      if (password.length < 4 || password.length > 64) {
        ShowMessage('密碼必須至少4個字元，最多64個字元。');
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="less" scoped>
.main--user-login-register {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-item {
  margin-top: 0.7rem;
  --input-left-space: 4.5rem;
}
.container {
  width: 100%;
  border-top: 1px solid var(--primary-light-2);
  border-bottom: 1px solid var(--primary-light-2);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 2rem;
  background-color: var(--white);

  .sub-container {
    padding-bottom: 2rem;
    > .title {
      padding: 0.1rem 0.4rem;
    }
    > .content {
      padding: 1rem;
    }
    > .buttons {
      display: flex;
      align-items: center;
      margin-top: 1.2rem;
    }
  }

  > .tips {
    border-top: 1px solid var(--primary-light);
    padding-top: 1.5rem;
    padding-bottom: 2rem;
    text-align: center;
    width: 30rem;
    font-size: 0.9rem;
  }
}

.fix-line {
  position: absolute;
  z-index: -1;
  height: 100vh;
  width: 3rem;
  right: 23%;
  top: 0;
  background-color: var(--primary-light);
}
</style>