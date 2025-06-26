<template>
  <div class="file-layout">
    <div class="file-layout__header">
      <div class="files-path">
        <el-icon size="25">
          <HomeFilled/>
        </el-icon>
        主页
      </div>
      <div class="files-view-type">
        <el-icon>
          <Grid/>
        </el-icon>
      </div>
    </div>
    <div class="file-layout__table">
      <el-scrollbar style="height: calc(100vh - 220px);">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.file-layout, .file-layout__header, .file-layout__table {
  width: 100%;
}

.file-layout__table {
  background: white;
  box-shadow: var(--el-box-shadow-light)
}

.file-layout, .files-path, .files-view-type {
  height: 100%;
}

.files-view-type {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

.files-view-type:hover {
  background: rgb(232.8, 233.4, 234.6);
}

.files-path {
  width: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.file-layout__header {
  height: 40px;
  display: flex;
}
</style>