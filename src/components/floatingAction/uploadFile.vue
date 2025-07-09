<template>
  <div class="upload-box">
    <!-- 上传按钮区域 -->
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

    <!-- Tab栏展示上传中与上传完成 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="上传中" name="uploading">
        <div v-if="uploadingList.length" class="upload-section">
          <div
              v-for="item in uploadingList"
              :key="item.id"
              class="upload-item"
          >
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
          <div
              v-for="item in finishedList"
              :key="item.id"
              class="upload-item"
          >
            <span class="filename">{{ item.name }}</span>
            <el-icon color="#67C23A"><CircleCheck /></el-icon>
          </div>
        </div>
        <div v-else class="empty">暂无已上传文件</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'

let uid = 0

export default {
  name: 'UploadBoxTabs',
  components: { CircleCheck },
  props: {
    uploadUrl: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeTab: 'uploading',
      uploadingList: [],
      finishedList: []
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
        const task = {
          id: uid++,
          name: isFolder ? file.webkitRelativePath : file.name,
          progress: 0,
          error: false
        }
        this.uploadingList.push(task)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', this.$route.path)
        if (isFolder) {
          formData.append('toPath', this.getPathFromFile(file))
        }

        const xhr = new XMLHttpRequest()
        xhr.open('POST', this.uploadUrl, true)

        Object.entries(this.headers).forEach(([key, val]) => {
          xhr.setRequestHeader(key, val)
        })

        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            task.progress = Math.round((e.loaded / e.total) * 100)
          }
        }

        xhr.onload = () => {
          const isSuccess = xhr.status >= 200 && xhr.status < 300
          task.progress = 100
          if (isSuccess) {
            this.finishedList.push({ ...task })
            ElMessage.success(`${task.name} 上传成功`)
          } else {
            task.error = true
            ElMessage.error(`${task.name} 上传失败`)
          }
          this.uploadingList = this.uploadingList.filter(t => t.id !== task.id)
        }

        xhr.onerror = () => {
          task.error = true
          ElMessage.error(`${task.name} 上传异常`)
        }

        xhr.send(formData)
      })
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
  justify-content: space-between; /* 左右分散 */
  align-items: center;
  width: 100%; /* 占满父容器 */
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
  flex-shrink: 0;
}

.empty {
  color: #999;
  padding: 20px;
  text-align: center;
}
</style>
