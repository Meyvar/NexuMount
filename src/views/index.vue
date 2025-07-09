<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1 style="padding-left: 10px">webdav</h1>
        <el-dropdown trigger="click">
          <el-button text class="user">
            {{ userInfo.nike }}
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="this.$router.push('/admin')" v-if="userInfo.uuid === '7a207a4a3b4d4d92b6b84329829bdeab'">后台管理</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>©Meyvar 2025</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  },
  methods: {
    logout() {
      this.$common.axiosGet("/public/logout.do", true).then((res) => {
        if (res.success){
          this.$router.push("/")
        }
      });
    }
  },
}
</script>

<style scoped>
.common-layout {
  height: 100%;
  width: min(90%, 980px);
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.el-main, .el-header, .el-footer {
  padding: 0;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-footer{
  display: flex;
  align-items: center;
  justify-content: center;
}

.user{
  height: 60px;
  font-size: 18px;
  font-weight: bold;
}
</style>