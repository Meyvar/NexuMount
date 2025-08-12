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
        <el-table-column prop="describe" label="任务信息"/>
        <el-table-column prop="status" label="状态" width="180"/>
        <el-table-column prop="schedule" label="进度环节" width="180"/>
        <el-table-column prop="progress" label="传输进度" width="180"/>
        <el-table-column prop="elapsed" label="传输速度" width="180"/>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link @click="cancel(scope.row)">取消</el-button>
            <el-button type="primary" v-if="scope.row.status === 'RUNNING'" link @click="pause(scope.row)">暂停</el-button>
            <el-button type="primary" v-if="scope.row.status === 'PAUSED'" link @click="resume(scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="已完成" name="completed">
      <div class="table-head">
        <el-button type="success" @click="removeSuccess">清除已完成</el-button>
        <el-button type="primary">重启失败任务</el-button>
        <el-button type="warning">删除已取消任务</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="completedList" :height="tableHeight" style="width: 100%">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="describe" label="任务信息"/>
        <el-table-column prop="status" label="状态" width="180"/>
        <el-table-column prop="error" label="错误信息"/>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" v-if="scope.row.status === 'ERROR'" link @click="restartFailedTask(scope.row)">重启</el-button>
            <el-button type="primary" v-if="scope.row.status === 'CANCELLED'" link @click="removeTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      timerId: null,
      runningList: [],
      completedList: [],
      tableHeight: 0,
    }
  },
  mounted() {
    this.tableHeight = document.querySelector('.taskTabs')?.offsetHeight


    this.timerId = setInterval(this.loadTables, 1000);
  },
  methods: {
    loadTables() {
      this.getRunningList()
      this.getCompletedList()
    },
    async getRunningList() {
      let res = await this.$common.axiosGet("/sysFileTask/running.do", false);
      if (res.success){
        res.data.forEach(item => {
          item.progress = item.progress + "%"
          item.elapsed = this.$common.formatSize(item.elapsed * 1024)
        })
        this.runningList = res.data
      }
    },
    async getCompletedList(){
      let res = await this.$common.axiosGet("/sysFileTask/completed.do", false);
      if (res.success){
        this.completedList = res.data
      }
    },
    removeSuccess(){
       this.$common.axiosGet("/sysFileTask/removeAllCompletedTasks.do", false);
    },
    cancel(row){
      this.$common.axiosJson("/sysFileTask/cancel.do", [row.taskId],false);
    },
    pause(row){
      this.$common.axiosJson("/sysFileTask/pause.do", [row.taskId],false);
    },
    resume(row){
      this.$common.axiosJson("/sysFileTask/resume.do", [row.taskId],false);
    },
    restartFailedTask(row){
      this.$common.axiosJson("/sysFileTask/restartFailedTask.do", [row.taskId],false);
    },
    removeTask(row){
      this.$common.axiosJson("/sysFileTask/removeTask.do", [row.taskId],false);
    }
  },
  beforeUnmount() {
    // 组件卸载时清理定时器
    clearInterval(this.timerId);
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