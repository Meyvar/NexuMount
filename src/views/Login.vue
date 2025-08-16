<template>
  <div class="login">
    <div class="icon-cards">
      <div class="icon-cards__content">
        <div class="login-wrapper">
          <span class="login-title">用户登录</span>
          <el-form ref="loginForm" :model="loginForm" class="login-form" :rules="LoginRules" @keyup.enter="login">
            <el-form-item required prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名" size="large"/>
            </el-form-item>
            <el-form-item required prop="password">
              <el-input v-model="loginForm.password" placeholder="密码" size="large" type="password"/>
            </el-form-item>
            <el-form-item style="padding-top: 20px">
              <el-button type="primary" @click="login" size="large" id="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loginForm: {
        username: process.env.VUE_APP_DEV_USERNAME,
        password: process.env.VUE_APP_DEV_PASSWORD,
      },
      LoginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    async login() {
      let valid = await this.$refs.loginForm.validate()
      if (valid) {
        let resp = await this.$common.axiosForm("/public/login.do", this.loginForm, true);
        if (resp.success) {
          localStorage.setItem("userInfo", JSON.stringify(resp.data));
          this.$router.push('/home')
        } else {
          this.$message.error(resp.msg)
        }
      }
    },
  },
  mounted() {
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;
  background: url("@/assets/login/bg.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.login-wrapper {
  width: calc(100% - 76px);
  height: 279px;
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  background: #FFFFFF;
  text-align: center;
  padding: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
}

.login-title {
  font-size: 30px;
}

.login-form {
  margin: 20px 0 0 0;
}

#login {
  width: 100%;
}

.icon-cards {
  position: absolute;
  height: 355px;
  width: 420px;
  perspective: 600px;
  right: 10%;
  @media (max-width: 640px) {
    width: 90%;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}

.icon-cards__content {
  position: absolute;
  height: 355px;
  width: 100%;
  transition: all 2s ease 0s;
}

.el-form-item {

}
</style>