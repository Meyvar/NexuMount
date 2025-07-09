<template>
  <div class="list-header">
    <el-button type="primary" @click="add">添加</el-button>
  </div>
  <div style="height: calc(100% - 50px); width: 100%; margin-top: 10px" ref="tableBox">
    <el-table :data="tableData" stripe style="width: 100%" :height="tableHeight">
      <el-table-column prop="path" label="挂载路径" min-width="120">
        <template #default="scope">
          /{{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column prop="adapter" label="适配器" min-width="120">
        <template #default="scope">
          {{ adapterMap[scope.row.adapter] }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80"/>
      <el-table-column prop="status" label="状态" min-width="120"/>
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
      <h4>用户编辑</h4>
    </template>
    <template #default>
      <el-form :model="editForm" label-width="auto" label-suffix=":" :rules="formRules">
        <el-form-item label="适配器" prop="adapter">
          <el-select v-model="editForm.adapter" placeholder="请选择适配器">
            <el-option v-for="(adapter, i) in adapterList" :label="adapter.title" :value="adapter.name" :key="i"/>
          </el-select>
        </el-form-item>
        <el-form-item label="挂着路径" prop="path">
          <el-input v-model="editForm.path" placeholder="本地挂着路径">
            <template #prepend>/</template>
          </el-input>
        </el-form-item>
        <el-form-item label="源路径" prop="sourcePath">
          <el-input v-model="editForm.sourcePath" placeholder="远程文件路径"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" placeholder="文件排序"/>
        </el-form-item>
        <el-form-item label="文件加密">
          <el-switch
              v-model="editForm.encryption"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-value="1"
              inactive-value="0"
          />
          <el-alert type="info" :closable="false">开启加密后大部门文件无法在线预览</el-alert>
        </el-form-item>

        <el-form-item label="加密密钥" v-show="editForm.encryption == 1">
          <el-input v-model="editForm.aesKey" placeholder="AES加密key（128位）" readonly/>
          <el-alert type="warning" :closable="false">请妥善保存密钥，丢失后已上传加密文件无法还原！</el-alert>
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
      formRules: {
        adapter: [
          {required: true, message: '请选择适配器', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '请输入挂着路径', trigger: 'blur'}
        ],
        sourcePath: [
          {required: true, message: '请输入源路径', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序', trigger: 'blur'}
        ],
      },
      tableData: [],
      showEditForm: false,
      editForm: {},
      tableHeight: 0,
      adapterList: [],
      adapterMap: {},
    }
  },
  mounted() {
    this.getAdapterList()
    this.tableHeight = this.$refs.tableBox.offsetHeight
  },
  methods: {
    getAdapterList() {
      this.$common.axiosGet("/fileBucket/getFileAdapterList.do", false).then(res => {
        if (res.success) {
          this.adapterList = res.data
          this.adapterList.forEach(item => {
            this.adapterMap[item.name] = item.title
          })

          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getTableList() {
      this.$common.axiosForm("/fileBucket/list.do").then((res) => {
        if (res.success) {
          this.tableData = res.data
        }
      })
    },
    toForm(data) {
      this.showEditForm = true
      this.editForm = data
    },
    async add() {
      this.editForm = {
        sort: 0,
        encryption: 0,
        aesKey: await this.generateAesKeyBase64()
      }
      this.showEditForm = true
    },
    closureForm() {
      this.showEditForm = false
      this.editForm = {}
    },
    submitForm() {
      this.$common.axiosForm("/fileBucket/save.do", this.editForm, true).then((res) => {
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
      this.$common.axiosForm("/fileBucket/delete.do", {uuid: row.uuid}, true).then((res) => {
        if (res.success) {
          this.getTableList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async generateAesKeyBase64() {
      let res = await this.$common.axiosGet("/public/getAesKey.do", false)
      return res.data
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