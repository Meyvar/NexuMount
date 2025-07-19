<template>
  <div class="upload-box">
    <!-- 上传按钮 -->
    <div class="upload-actions">
      <el-button type="primary" @click="openFileSelect">上传文件</el-button>
      <el-button @click="openFolderSelect">上传文件夹</el-button>
      <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden-input"
          @change="handleFileChange"
      />
      <input
          ref="folderInput"
          type="file"
          multiple
          webkitdirectory
          class="hidden-input"
          @change="handleFolderChange"
      />
    </div>

    <!-- Tab -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="上传中" name="uploading">
        <div v-if="uploadingList.length" class="upload-section">
          <div v-for="item in uploadingList" :key="item.id" class="upload-item">
            <span class="filename">{{ item.name }}</span>
            <el-progress
                :percentage="item.progress"
                :status="item.error ? 'exception' : undefined"
                :stroke-width="14"
            />
            <span v-if="item.error" class="error-text">失败</span>
          </div>
        </div>
        <div v-else class="empty">暂无上传任务</div>
      </el-tab-pane>

      <el-tab-pane label="上传完成" name="finished">
        <div v-if="finishedList.length" class="upload-section">
          <div v-for="item in finishedList" :key="item.id" class="upload-item">
            <span class="filename">{{ item.name }}</span>
            <el-icon color="#67C23A">
              <CircleCheck/>
            </el-icon>
          </div>
        </div>
        <div v-else class="empty">暂无已上传文件</div>
      </el-tab-pane>

      <el-tab-pane label="上传失败" name="failed">
        <div v-if="failedList.length" class="upload-section">
          <div v-for="item in failedList" :key="item.id" class="upload-item">
            <span class="filename">{{ item.name }}</span>
            <span class="error-text">{{ item.msg }}</span>
            <el-button size="small" type="danger" @click="retryFailed(item)">重试</el-button>
          </div>
        </div>
        <div v-else class="empty">暂无失败文件</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {CircleCheck} from '@element-plus/icons-vue'

let uid = 0

export default {
  name: 'UploadBoxTabs',
  components: {CircleCheck},
  props: {
    uploadUrl: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default: () => ({})
    },
    refreshTable: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeTab: 'uploading',
      uploadingList: [],
      finishedList: [],
      failedList: []
    }
  },
  methods: {
    openFileSelect() {
      this.$refs.fileInput.click()
    },
    openFolderSelect() {
      this.$refs.folderInput.click()
    },
    handleFileChange(e) {
      const files = e.target.files
      this.uploadFiles(files, false)
      this.$refs.fileInput.value = null
    },
    handleFolderChange(e) {
      const files = e.target.files
      this.uploadFiles(files, true)
      this.$refs.folderInput.value = null
    },

    uploadFiles(files, isFolder) {
      Array.from(files).forEach(file => {
        this._uploadSingleFile(file, isFolder)
      })
    },

    _uploadSingleFile(file, isFolder) {
      const task = {
        id: uid++,
        file,
        name: isFolder ? file.webkitRelativePath : file.name,
        isFolder,
        progress: 0,
        error: false
      }

      this.uploadingList.push(task)

      const formData = new FormData()
      formData.append('file', file)
      let path = this.$route.path.replace('/home', '')
      formData.append('path', path)
      if (isFolder) {
        formData.append('toPath', this.getPathFromFile(file))
      }

      const headers = {
        'X-Oc-Mtime': Math.floor(file.lastModified / 1000)
      }

      this.$common.axiosUploadFile(this.uploadUrl, formData, e => {
        if (e.lengthComputable) {
          // ✅ 用 splice 替换整个对象，强制 Vue 3 响应式更新
          const newProgress = Math.round((e.loaded / e.total) * 100)
          const index = this.uploadingList.findIndex(t => t.id === task.id)
          if (index !== -1) {
            const updatedTask = { ...this.uploadingList[index], progress: newProgress }
            this.uploadingList.splice(index, 1, updatedTask)
          }
        }
      }, headers)
          .then(res => {
            const index = this.uploadingList.findIndex(t => t.id === task.id)
            if (res.success) {
              const finished = { ...task, progress: 100 }
              this.finishedList.push(finished)
              this.$store.commit('setFileList', {path: path, list: null})
              this.refreshTable()
            } else {
              const failed = { ...task, error: true, msg: res.msg }
              this.failedList.push(failed)
            }
          })
          .catch(() => {
            const failed = { ...task, error: true, msg: '上传失败' }
            this.failedList.push(failed)
          })
          .finally(() => {
            this.uploadingList = this.uploadingList.filter(t => t.id !== task.id)
          })
    },

    retryFailed(item) {
      this.failedList = this.failedList.filter(t => t.id !== item.id)
      this._uploadSingleFile(item.file, item.isFolder)
    },

    getPathFromFile(file) {
      return file.webkitRelativePath
          ? file.webkitRelativePath.substring(0, file.webkitRelativePath.lastIndexOf('/'))
          : ''
    }
  }
}
</script>

<style scoped>
.upload-box {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.upload-actions {
  margin-bottom: 16px;
}

.hidden-input {
  display: none;
}

.upload-section {
  margin-top: 16px;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.filename {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.error-text {
  color: red;
  margin-right: 10px;
}

.empty {
  color: #999;
  padding: 20px;
  text-align: center;
}
</style>
