<template>
  <el-tabs model-value="running" class="taskTabs" ref="taskTabs">
    <el-tab-pane label="未完成" name="running">
      <div class="table-head">
        <el-button type="primary">批量启动</el-button>
        <el-button type="warning">批量暂停</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="runningList" :height="tableHeight" style="width: 100%">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="文件名" width="180"/>
        <el-table-column prop="status" label="状态" width="180"/>
        <el-table-column prop="schedule" label="进度" width="180"/>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="remove(scope.row)">删除</el-button>
            <el-button type="primary" link @click="toForm(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="已完成" name="completed">Config</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      runningList: [],
      tableHeight: 0,
    }
  },
  mounted() {
    this.tableHeight = document.querySelector('.taskTabs')?.offsetHeight
  }
}
</script>

<style scoped>
.taskTabs {
  background: #FFFFFF;
  padding: 15px 25px;
  height: calc(100% - 30px);
}

.table-head {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>