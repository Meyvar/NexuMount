<template>
  <div class="list-header">
    <el-button type="primary" @click="showEditForm = true">添加</el-button>
  </div>
  <div style="height: calc(100% - 50px); width: 100%; margin-top: 10px" ref="tableBox">
    <el-table :data="tableData" stripe style="width: 100%" :height="tableHeight">
      <el-table-column prop="username" label="用户名" min-width="120"/>
      <el-table-column prop="nike" label="昵称" min-width="120"/>
      <el-table-column prop="status" label="状态" min-width="80">
        <template #default="scope">
          {{ scope.row.status == '1' ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" link @click="remove(scope.row)">删除</el-button>
          <el-button type="primary" link @click="toForm(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <el-drawer v-model="showEditForm" direction="rtl" size="70%" @close="editForm = {}">
    <template #header>
      <h4>编辑</h4>
    </template>
    <template #default>
      <el-form :model="editForm" label-width="auto" label-suffix=":">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"/>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nike"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio value="1">启用</el-radio>
            <el-radio value="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="根路径">
          <el-tree-select
              v-model="editForm.rootPath"
              :data="data"
              check-strictly
              :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="editForm.permissions">
            <el-checkbox value="admin" name="permissions">后台管理</el-checkbox>
            <el-checkbox value="createOrUpload" name="permissions">创建目录或上传</el-checkbox>
            <el-checkbox value="move" name="permissions">文件移动</el-checkbox>
            <el-checkbox value="copy" name="permissions">文件复制</el-checkbox>
            <el-checkbox value="raname" name="permissions">文件重命名</el-checkbox>
            <el-checkbox value="remove" name="permissions">文件删除</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closureForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
export default ({
  data() {
    return {
      tableData: [],
      showEditForm: false,
      editForm: {},
      tableHeight: 0,
    }
  },
  mounted() {
    this.getTableList()
    this.tableHeight = this.$refs.tableBox.offsetHeight
  },
  methods: {
    getTableList() {
      this.$common.axiosForm("/sysUser/list.do").then((res) => {
        if (res.success) {
          this.tableData = res.data
          this.tableData.forEach(item => {
            if (item.permissions == null || item.permissions === '') {
              item.permissions = []
            } else {
              item.permissions = item.permissions.split(',')
            }
          })
        }
      })
    },
    toForm(data) {
      this.showEditForm = true
      this.editForm = data
    },
    closureForm() {
      this.showEditForm = false
      this.editForm = {}
    },
    submitForm() {
      this.editForm.permissions = this.editForm.permissions.join(",")
      this.$common.axiosForm("/sysUser/save.do", this.editForm, true).then((res) => {
        if (res.success) {
          this.showEditForm = false
          this.getTableList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    remove(row) {
      this.$common.axiosForm("/sysUser/delete.do", {uuid: row.uuid}, true).then((res) => {
        if (res.success) {
          this.getTableList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
})
</script>

<style scoped>
.list-header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
</style>