<template>
  <div class="fab-container">
    <transition-group name="fab" tag="div" class="fab-actions">
      <button
          v-if="expanded"
          v-for="(action, i) in actions"
          :key="action.label"
          class="fab-item"
          @click="action.handler"
          :style="{ transitionDelay: `${i * 0.1}s` }"
      >
        <span class="label">{{ action.label }}</span>
      </button>
    </transition-group>
    <button class="fab-main" @click="expanded = !expanded">
      <el-icon>
        <component :is="expanded ? 'Close' : 'Plus'"/>
      </el-icon>
    </button>
  </div>

  <el-dialog
      v-model="showUploadFile"
      title="文件上传"
      :width="uploadWidth"
      class="responsive-upload-dialog"
  >
    <UploadBox ref="uploadBox" :upload-url="uploadUrl" :refresh-table="this.refreshTable"/>
  </el-dialog>

  <el-dialog
      v-model="createFolder"
      class="responsive-upload-dialog"
      :width="uploadWidth"
      title="新建文件夹"
      :destroy-on-close="true"
      :before-close="closeCreate"
  >
    <el-form :model="createForm" label-width="auto">
      <el-form-item label="">
        <el-input v-model="createForm.name" placeholder="请输入名称"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeCreate">取消</el-button>
        <el-button type="primary" @click="create">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import UploadBox from "@/components/floatingAction/uploadFile.vue";

export default {
  props: {
    refreshTable: {
      type: Function,
      default: () => {
      }
    }
  },
  components: {UploadBox},
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth)
  },
  data() {
    return {
      expanded: false,
      showUploadFile: false,
      actions: [],
      uploadWidth: 800,
      createFolder: false,
      createForm: {},
      uploadUrl: process.env.VUE_APP_BASE_API + '/pub/dav/upload.do',
    }
  },
  mounted() {
    this.createButton()
    window.addEventListener('resize', this.updateWidth)
    this.updateWidth()
  },
  methods: {
    create() {
      let api = "/pub/dav/createFolder.do"
      if (this.createForm.type === 'file') {
        api = "/pub/dav/createFile.do"
      }
      let path = decodeURIComponent(this.$route.path)
      if (path == '/home') {
        path = '/'
      } else {
        path = path.replace('/home', '')
      }
      this.$common.axiosForm(api, {path: path + "/" + this.createForm.name}, true).then(resp => {
        if (resp.success) {
          this.closeCreate()
          this.refreshTable()
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    closeCreate() {
      this.createFolder = false
      this.createForm = {}
    },
    createButton() {
      this.actions = [
        {
          label: '刷新列表',
          handler: () => {
            this.refreshTable()
          }
        },
        {
          label: '上传文件',
          handler: () => this.showUploadFile = true
        },
        {
          label: '新建文件夹',
          handler: () => {
            this.createFolder = true
            this.createForm.type = 'folder'
          }
        },
        {
          label: '新建文件',
          handler: () => {
            this.createFolder = true
            this.createForm.type = 'file'
          }
        }
      ]
    },
    updateWidth() {
      let innerWidth = window.innerWidth
      if (innerWidth >= 940) {
        this.uploadWidth = 800
      } else {
        this.uploadWidth = '85%'
      }
    }
  }
}
</script>

<style scoped>
.fab-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 主按钮 */
.fab-main {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.fab-main:hover {
  transform: scale(1.1);
}

/* 子按钮 */
.fab-item {
  background: white;
  border: 1px solid #ddd;
  padding: 6px 12px;
  margin-bottom: 10px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
  opacity: 1;
  transform: translateY(0);
}

.fab-item:hover {
  transform: scale(1.06);
  background: #f8f8f8;
}

/* 图标与文字 */
.fab-item i {
  margin-right: 6px;
}

.fab-item .label {
  white-space: nowrap;
}

/* 出现/离开动画 */
.fab-enter-active,
.fab-leave-active {
  transition: all 0.25s ease;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fab-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 在全局或 scoped 样式中添加 */
.responsive-upload-dialog {
  width: 95%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
}

@media (max-width: 768px) {
  .responsive-upload-dialog {
    border-radius: 0 !important;
    padding: 0 !important;
  }
}
</style>
<style>
.createButton .el-form-item__content {
  justify-content: flex-end;
}
</style>