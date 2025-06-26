<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>webdav</h1>
        <el-dropdown trigger="click">
          <el-button text class="user">
            超级管理员
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>后台管理</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
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
    return {}
  },
  mounted() {

  },
  methods: {},
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