<template>
  <div class="file-layout">
    <div class="file-layout__header"></div>
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
.file-layout {
  height: 100%;
}
.file-layout__header{
  height: 40px;
  background: #42b983;
}
</style>