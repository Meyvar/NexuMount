<template>
  <div class="upload-box">
    <!-- 上传按钮 -->
    <div class="upload-actions">
      <el-button type="primary" @click="openFileSelect">上传文件</el-button>
      <el-button type="primary" @click="openFolderSelect">上传文件夹</el-button>
      <el-button @click="clearFinished">清除已完成</el-button>

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
        <div v-if="uploadingList.length || queueVisible.length || pausedList.length" class="upload-section">
          <el-scrollbar height="300px">
            <div v-for="item in uploadingList" :key="item.id" class="upload-item">
              <span class="filename">{{ item.name }}</span>

              <el-progress
                  :percentage="item.progress"
                  :status="item.error ? 'exception' : undefined"
                  :stroke-width="14"
                  class="progress"
              />

              <div class="item-actions">
                <el-button size="mini" type="warning" @click="pauseTask(item)" v-if="item.status === 'uploading'">暂停
                </el-button>
                <el-button size="mini" type="primary" @click="resumeTask(item)" v-if="item.status === 'paused'">恢复
                </el-button>
                <el-button size="mini" type="danger" @click="deleteTask(item)">删除</el-button>
              </div>
              <span v-if="item.error" class="error-text">失败</span>
            </div>

            <!-- 等待队列 -->
            <div v-for="item in queueVisible" :key="item.id" class="upload-item queue-item">
              <span class="filename">{{ item.name }}</span>
              <span class="queue-label">等待中</span>
              <div class="item-actions">
                <el-button size="mini" @click="cancelQueuedTask(item)">删除</el-button>
              </div>
            </div>

            <!-- 暂停列表 -->
            <div v-for="item in pausedList" :key="item.id" class="upload-item paused-item">
              <span class="filename">{{ item.name }}</span>
              <span class="queue-label">已暂停（{{ item.progress }}%）</span>
              <div class="item-actions">
                <el-button size="mini" type="primary" @click="resumeTask(item)">恢复</el-button>
                <el-button size="mini" type="danger" @click="deleteTask(item)">删除</el-button>
              </div>
            </div>

          </el-scrollbar>
        </div>
        <div v-else class="empty">暂无上传任务</div>
      </el-tab-pane>

      <el-tab-pane label="上传完成" name="finished">
        <div v-if="finishedList.length" class="upload-section">
          <el-scrollbar height="300px">
            <div v-for="item in finishedList" :key="item.id" class="upload-item">
              <span class="filename">{{ item.name }}</span>
              <el-icon color="#67C23A">
                <CircleCheck/>
              </el-icon>
              <div class="item-actions">
                <el-button size="mini" @click="deleteTask(item)">删除</el-button>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-else class="empty">暂无已上传文件</div>
      </el-tab-pane>

      <el-tab-pane label="上传失败" name="failed">
        <div v-if="failedList.length" class="upload-section">
          <el-scrollbar height="300px">
            <div v-for="item in failedList" :key="item.id" class="upload-item">
              <span class="filename">{{ item.name }}</span>
              <span class="error-text">{{ item.msg || '上传失败' }}</span>
              <el-button size="small" type="primary" @click="retryFailed(item)">重试</el-button>
              <el-button size="small" type="danger" @click="deleteTask(item)">删除</el-button>
            </div>
          </el-scrollbar>
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
      type: Object, default: () => ({})
    },
    refreshTable: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      activeTab: 'uploading',
      uploadingList: [],   // 正在上传（xhr 控制）
      finishedList: [],
      failedList: [],
      queuedList: [],     // 等待队列
      pausedList: [],     // 暂停的任务
      currentCount: 0,     // 当前并发数
    }
  },
  computed: {
    // 在“上传中”tab 中也显示队列和暂停的
    queueVisible() {
      return this.queuedList
    },
    maxConcurrent() {
      return this.$store.getters.getWebConfig().taskUploadNumber || 3
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
        const task = this.createTask(file, isFolder)
        this.enqueueTask(task)
      })
      this.checkAndStartNext()
    },

    createTask(file, isFolder) {
      return {
        id: ++uid,
        file,
        name: isFolder ? file.webkitRelativePath : file.name,
        isFolder: !!isFolder,
        progress: 0,
        error: false,
        msg: '',
        status: 'queued', // queued, uploading, paused, success, failed
        xhr: null,
        paused: false
      }
    },

    enqueueTask(task) {
      this.queuedList.push(task)
    },

    checkAndStartNext() {
      // 启动队列直到并发数满
      while (this.currentCount < this.maxConcurrent && this.queuedList.length > 0) {
        const next = this.queuedList.shift()
        if (next.paused) {
          // 被标记为暂停的任务，放入 pausedList
          this.pausedList.push(next)
          continue
        }
        this.startUpload(next)
      }
    },

    startUpload(task) {
      // 保证状态
      task.status = 'uploading'
      task.progress = task.progress || 0
      this.uploadingList.push(task)
      this.currentCount++

      // 构造 formData
      const formData = new FormData()
      formData.append('file', task.file)
      let path = this.$route.path.replace('/home', '')
      formData.append('path', path)
      if (task.isFolder) {
        formData.append('toPath', this.getPathFromFile(task.file))
      }

      // headers (X-Oc-Mtime 等)
      const headers = Object.assign({}, this.headers)
      headers['X-Oc-Mtime'] = Math.floor(task.file.lastModified / 1000)

      // 使用 XMLHttpRequest 实现上传以获得 progress 与 abort 能力
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        task.xhr = xhr

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const newProgress = Math.round((e.loaded / e.total) * 100)
            task.progress = newProgress
            // 更新 uploadingList 中的 task 引用已是响应式
          }
        }

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            // remove from uploadingList
            this.uploadingList = this.uploadingList.filter(t => t.id !== task.id)
            task.xhr = null
            this.currentCount = Math.max(0, this.currentCount - 1)
            if (xhr.status >= 200 && xhr.status < 300) {
              // Try parse JSON like your previous implementation `res.success`
              let res = {}
              try {
                res = JSON.parse(xhr.responseText)
              } catch (e) {
                res = {success: true}
              }
              if (res && res.success !== false) {
                task.progress = 100
                task.status = 'success'
                this.finishedList.push(task)
              } else {
                task.status = 'failed'
                task.error = true
                task.msg = res && res.msg ? res.msg : '上传失败'
                this.failedList.push(task)
              }
            } else {
              // 如果是被 abort 导致的 0/ non-2xx，判断 paused 标志
              if (task.paused) {
                // 放入 pausedList (保持进度)
                task.status = 'paused'
                this.pausedList.push(task)
              } else {
                task.status = 'failed'
                task.error = true
                task.msg = '上传失败'
                this.failedList.push(task)
              }
            }

            // 当一个上传结束时，尝试启动下一个
            this.checkAndStartNext()

            // 当所有任务都处理完（队列为空且 uploadingList 为空）时刷新表格
            if (this.uploadingList.length === 0 && this.queuedList.length === 0 && this.currentCount === 0) {
              // 放在下一轮事件循环以确保列表已更新
              setTimeout(() => {
                this.refreshTable(true)
              }, 50)
            }

            resolve()
          }
        }

        xhr.open('POST', this.uploadUrl, true)

        // 设置 headers（注意：不能设置 Content-Type 为 multipart/form-data 手动值）
        Object.keys(headers || {}).forEach(k => {
          try {
            xhr.setRequestHeader(k, headers[k])
          } catch (e) { /* some headers restricted */
          }
        })

        // 发送
        try {
          xhr.send(formData)
        } catch (e) {
          // 立即失败（例如网络错误）
          this.uploadingList = this.uploadingList.filter(t => t.id !== task.id)
          this.currentCount = Math.max(0, this.currentCount - 1)
          task.status = 'failed'
          task.error = true
          task.msg = '发送失败'
          this.failedList.push(task)
          this.checkAndStartNext()
          resolve()
        }
      })
    },

    // 暂停任务：如果在上传中，abort xhr；如果在队列中，标记 paused 并移到 pausedList
    pauseTask(task) {
      // 如果任务正在上传
      if (task.status === 'uploading' && task.xhr) {
        task.paused = true
        try {
          task.xhr.abort()
        } catch (e) { /* ignore */
        }
        // uploadingList 会在 onreadystatechange 中被移除并放入 pausedList
        return
      }

      // 如果在队列中（未开始）
      const idx = this.queuedList.findIndex(t => t.id === task.id)
      if (idx !== -1) {
        const t = this.queuedList.splice(idx, 1)[0]
        t.paused = true
        t.status = 'paused'
        this.pausedList.push(t)
      }
    },

    // 恢复任务：从 pausedList 移回队列并 startNext
    resumeTask(task) {
      // 如果正在上传或已成功则忽略
      if (task.status === 'uploading') return

      // 如果在 pausedList 中，移除后放回 queuedList
      const idx = this.pausedList.findIndex(t => t.id === task.id)
      if (idx !== -1) {
        const t = this.pausedList.splice(idx, 1)[0]
        t.paused = false
        t.status = 'queued'
        this.queuedList.push(t)
        this.checkAndStartNext()
        return
      }

      // 如果是失败/其它重试的情况，直接入队
      if (task.status === 'failed') {
        this.failedList = this.failedList.filter(t => t.id !== task.id)
        task.paused = false
        task.status = 'queued'
        this.queuedList.push(task)
        this.checkAndStartNext()
      }
    },

    // 删除任务（停止上传或从所有列表中移除）
    deleteTask(task) {
      // 如果上传中，abort
      if (task.status === 'uploading' && task.xhr) {
        try {
          task.xhr.abort()
        } catch (e) {
        }
      }

      // 从 uploadingList、queuedList、pausedList、finishedList、failedList 中移除
      this.uploadingList = this.uploadingList.filter(t => t.id !== task.id)
      this.queuedList = this.queuedList.filter(t => t.id !== task.id)
      this.pausedList = this.pausedList.filter(t => t.id !== task.id)
      this.finishedList = this.finishedList.filter(t => t.id !== task.id)
      this.failedList = this.failedList.filter(t => t.id !== task.id)

      // 保证并发计数正确（如果删除正在上传的，currentCount 会在 xhr readyState 处理或这里手动调整）
      if (task.status === 'uploading') {
        this.currentCount = Math.max(0, this.currentCount - 1)
        this.checkAndStartNext()
      }
    },

    // 删除队列中的某个等待项（UI上的删除按钮）
    cancelQueuedTask(task) {
      this.queuedList = this.queuedList.filter(t => t.id !== task.id)
    },

    retryFailed(item) {
      // 从 failedList 移除并重新入队
      this.failedList = this.failedList.filter(t => t.id !== item.id)
      const task = {
        ...item,
        progress: 0,
        error: false,
        msg: '',
        status: 'queued',
        paused: false,
        xhr: null
      }
      this.queuedList.push(task)
      this.checkAndStartNext()
    },

    clearFinished() {
      this.finishedList = []
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
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.queue-item {
  opacity: 0.9;
}

.paused-item {
  opacity: 0.9;
}

.filename {
  flex: 1 1 40%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.progress {
  flex: 1 1 40%;
  min-width: 200px;
}

.item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.error-text {
  color: red;
  margin-left: 8px;
}

.queue-label {
  color: #999;
  margin-left: 8px;
}

.empty {
  color: #999;
  padding: 20px;
  text-align: center;
}
</style>
