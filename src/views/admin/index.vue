<template>
  <el-container style="height: 100%;">
    <el-aside :width="menuWidth">
      <div class="logo">
        <h1 style="text-align: center" v-show="!isCollapse">后台管理</h1>
        <h1 style="text-align: center" v-show="isCollapse">🏠</h1>
      </div>
      <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
      >
        <el-menu-item index="/admin/setting">
          <el-icon><Setting /></el-icon>
          <span>系统配置</span>
        </el-menu-item>
        <el-menu-item index="/admin/user/list">
          <el-icon>
            <UserFilled/>
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/bucket/list">
          <el-icon>
            <List/>
          </el-icon>
          <span>存储管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/task/list">
          <el-icon><Management /></el-icon>
          <span>任务管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-button type="primary" plain @click="isCollapse = !isCollapse">
          <el-icon>
            <Fold/>
          </el-icon>
        </el-button>
        <el-button type="danger" plain @click="logout()">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default ({
  data() {
    return {
      isCollapse: false,
      menuWidth: '240px',
    }
  },
  watch: {
    isCollapse: {
      deep: true,
      handler() {
        this.menuWidth = this.isCollapse ? '65px' : '240px'
      }
    }
  },
  mounted() {
    this.updateByWindow()
    window.addEventListener('resize', this.updateByWindow)
  },
  methods: {
    logout() {
      this.$common.axiosGet("/public/logout.do", true).then((res) => {
        if (res.success) {
          this.$router.push("/")
        }
      });
    },
    updateByWindow() {
      this.isCollapse = window.innerWidth < 980
    }
  }
})
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--el-menu-bg-color);
  border-bottom: 1px solid var(--el-menu-border-color);
}


.el-aside {
  background-color: var(--el-menu-bg-color);
  border-right: 1px solid var(--el-menu-border-color);
  transition: width 0.5s ease;
}

.el-menu {
  border: none;
}
</style>