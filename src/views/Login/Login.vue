<template>
  <div class="login-container">
    <img src="../../assets/img_slogen.png" class="slogen" />
    <div class="login-box">
      <img src="../../assets/img_logo.png" class="logo"/>
      <div class="welcome">您好！</div>
      <form>
        <div class="form-label">公司名或ID</div>
        <div class="input-box">
          <el-input ref="scompanyname" placeholder="请输入公司名或ID" v-model="form.scompanyname" :maxlength="50" @keyup.enter.native="onSubmit"></el-input>
          <show-error-tip ref="showErrorTip" class="error-tip" :showError="!form.scompanyname && error.scompanynameError" errorText="请输入公司名或ID" />
        </div>
        <div class="form-label">账户名</div>
        <div class="input-box">
          <el-input ref="username" placeholder="请输入账户名" v-model="form.username" :maxlength="50" @keyup.enter.native="onSubmit"></el-input>
          <show-error-tip ref="showErrorTip" class="error-tip" :showError="!form.username && error.usernameError" errorText="请输入账户名" />
        </div>
        <div class="form-label">密码</div>
        <div class="input-box">
          <el-input ref="password" placeholder="请输入密码" v-model="form.password" type="password" @keyup.enter.native="onSubmit"></el-input>
          <show-error-tip ref="showErrorTip" class="error-tip" :showError="!form.password && error.passwordError" errorText="请输入密码" />
        </div>

        <div class="submit-box">
          <img src="../../assets/img_login_submit.png" class="btn-login" @click="onSubmit"/>
          <show-error-tip ref="showErrorTip" class="error-tip" :showError="loginResult" :errorText="resultText" />
        </div>
      </form>
    </div>
    <div class="footer">Copyright @ 2013-2018 All Rights Reserved | 美味不用等（上海）信息科技股份有限公司版权所有 |
      <a target="blank" href="http://www.miitbeian.gov.cn/">沪ICP备12024155号-7</a>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { ShowErrorTip } from 'components';
  import { ACCOUNT_INFO } from 'constant/constants';
  import localStorage from 'utils/localstorageUtil';

  export default {
    name: 'Login',
    components: {
      ShowErrorTip
    },
    data () {
      return {
        form: {
          scompanyname: '',
          username: '',
          password: ''
        },
        error: {
          scompanynameError: false,
          usernameError: false,
          passwordError: false
        },
        loginResult: false,
        resultText: ''
      };
    },
    computed: {
      errorMsg () {
        let msg = this.$store.state.user.errorMsg;
        if (msg.length) {
          setTimeout(() => {
            this.clearError();
          }, 3000);
        }
        return msg;
      }
    },
    methods: {
      ...mapActions([
        'login',
        'clearError'
      ]),
      async onSubmit () {
        this.loginResult = false;
        const { form } = this;
        for (let key in form) {
          if (!form[key].length) {
            this.$refs[key].focus();
            this.error[`${key}Error`] = true;
            return;
          }
          this.error[`${key}Error`] = false;
        }

        const loginUrl = process.env.NODE_ENV === 'production' ? 'http://www.mwpos.cn/Account/LoginInfo' : 'http://test.www.mwpos.cn/Account/LoginInfo';
        this.$jsonp(loginUrl, this.form).then(data => {
          const { success, token, value, foodTradeId } = data;
          if (!success) {
            this.loginResult = true;
            this.resultText = value;
            return;
          }

          localStorage.getInstance().setItem(ACCOUNT_INFO, { token });
          if (+foodTradeId === 1) {
            window.location.href = process.env.NODE_ENV === 'production' ? 'http://www.mwpos.cn/Home/Index' : 'http://test.www.mwpos.cn/Home/Index';
          } else {
            window.location.href = process.env.HOST + 'shopinfo';
          }
        });
//        await this.login({ ...form });
//        const { errorMsg } = this.$store.state.user;
//        if (!errorMsg.length) {
//          this.$router.push({ path: 'index' });
//        }
      }
    }
  };
</script>

<style lang="scss">
  .login-container {
    height: 100%;
    width: 100%;
    background: url('../../assets/img_login_bg.png') no-repeat;
    background-size: 100% 100%;

    .slogen {
      width: 50%;
      padding-left: 5%;
      float: left;
      margin-top: 15%;
    }

    .login-box {
      float: right;
      width: 35%;
      padding-left: 3.2%;

      .logo {
        margin-top: 8.5%;
      }

      .welcome {
        margin: 12% 0 7% 0;
        font-size: 42px;
        color: #121F3E;
      }

      .form-label {
        margin-top: 20px;
        font-size: 16px;
        color: #999999;
      }

      .mw-tooltip {
        background: #1F2D3D !important;
      }

      .mw-tooltip .popper__arrow {
        border-right-color: #1F2D3D !important;
      }

      .mw-tooltip .popper__arrow::after {
        border-right-color: #1F2D3D !important;
      }

      .input-box {
        position: relative;

        .error-tip {
          width: 100px;
          top: 6px;
          left: 104px;
        }
      }

      .el-input {
        width: 80%;
      }

      .el-input__inner {
        padding: 0;
      }

      .el-input .el-input__inner {
        font-size: 16px;
        color: #333333;
        background: transparent;
        border: none;
        border-bottom: 1px solid #E5E5E5;
      }

      .el-input + .el-input {
        margin-top: 20px;
      }

      .submit-box {
        position: relative;
        display: block;
        margin-top: 10%;
        height: 58px;
        width: 175px;
        cursor: pointer;

        .mw-tooltip {
          text-align: center;
          left: 180px;
          top: 16px;
          width: 150px;
        }
      }
    }

    .footer {
      position: fixed;
      bottom: 10px;
      left: 5%;
      font-size: 12px;
      color: #C63413;
      letter-spacing: 0;
      text-align: center;
      a {
        text-decoration: none;
        color: #C63413;
      }
    }
  }
</style>
