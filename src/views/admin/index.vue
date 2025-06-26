<template>
  <el-container>
    <el-aside width="240px">
      <h1 style="text-align: center">后台管理</h1>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default({
  name: "index"
})
</script>

<style scoped>

</style>