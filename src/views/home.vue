<template>
  <div class="file-layout">
    <div class="file-layout__header">
      <div class="files-path">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{path: '/home'}">
            <img src="@/assets/icon/house.png" width="20">
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: item.path}" v-for="item in breadcrumb" :key="item.title">
            <div class="" style="width: 100%">{{ item.title }}</div>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="files-view-type" @click="showType" v-if="!preview">
        <el-icon>
          <Grid/>
        </el-icon>
      </div>
    </div>
    <div class="file-layout__table">

      <file-table :list-height="listHeight" :table-list="tableList" :getFileIcon="getFileIcon" :goPath="goPath"
                  :format-size="formatSize" v-if="!preview && tableType == 'table'" :showContextMenu="showContextMenu"
      ></file-table>

      <el-scrollbar :height="listHeight" v-if="!preview && tableType == 'grid'">
        <file-grid :table-list="tableList" :getFileIcon="getFileIcon" :goPath="goPath"
                   :contextmenu="showContextMenu"></file-grid>
      </el-scrollbar>

      <preview v-if="preview" :height="listHeight" :getFileIcon="getFileIcon" :get-file-size="formatSize"></preview>
    </div>
  </div>

  <el-dialog
      v-model="rename.show"
      class="responsive-upload-dialog"
      :width="dialogWidth"
      title="重命名"
      :destroy-on-close="true"
      :before-close="closeMove"
  >
    <el-form :model="rename" label-width="auto">
      <el-form-item label="">
        <el-input v-model="rename.newName" placeholder="请输入名称"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeRename">取消</el-button>
        <el-button type="primary" @click="submitRename">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>


  <floating-action :refreshTable="refreshTable" class="floating_action"></floating-action>

  <el-dialog
      v-model="move.show"
      title="选择文件夹"
      :width="dialogWidth"
      class="responsive-upload-dialog">
    <el-tree
        lazy
        :load="rootPathLoad"
        check-strictly
        node-key="href"
        :props=move.treeProps
        :expand-on-click-node=false
        ref="pathTree"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitMove">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>


  <!-- 自定义右键菜单 -->
  <div
      v-if="contextMenuVisible"
      class="context-menu"
      :style="{ top: contextMenuStyle.top, left: contextMenuStyle.left }"
      ref="contextMenu"
  >
    <div class="menu-item" @click="onMenuClick('rename')">重命名</div>
    <div class="menu-item" @click="onMenuClick('move')">移动</div>
    <div class="menu-item" @click="onMenuClick('copy')">复制</div>
    <div class="menu-item" @click="onMenuClick('copyUrl')">复制链接</div>
    <div class="menu-item" @click="onMenuClick('delete')">删除</div>
    <div class="menu-item" @click="onMenuClick('download')">下载</div>
  </div>
</template>

<script>
import folderIcon from '@/assets/icon/folder.png'
import imageIcon from '@/assets/icon/image.png'
import videoIcon from '@/assets/icon/video.png'
import txtIcon from '@/assets/icon/txt.png'
import fileIcon from '@/assets/icon/file.png'
import audioIcon from '@/assets/icon/audio.png'
import pdfIcon from '@/assets/icon/pdf.png'
import excel from '@/assets/icon/excel.png'
import ppt from '@/assets/icon/powerpoint.png'
import word from '@/assets/icon/word.png'

import FileTable from "@/components/fileTable.vue";
import PathBreadcrumb from "@/components/pathBreadcrumb.vue";
import Preview from "@/components/preview/preview.vue";
import FileGrid from "@/components/fileGrid.vue";
import FloatingAction from "@/components/floatingAction/floatingAction.vue";

export default {
  components: {FloatingAction, FileGrid, Preview, PathBreadcrumb, FileTable},
  watch: {
    '$route.fullPath'() {
      this.initBreadcrumb();
    }
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.updateMoveWidth)
  },
  data() {
    return {
      breadcrumb: [],
      tableType: 'table',
      tableList: [],
      listHeight: 0,
      fileIcon: {
        folder: folderIcon,
        image: imageIcon,
        video: videoIcon,
        text: txtIcon,
        file: fileIcon,
        audio: audioIcon,
        pdf: pdfIcon,
        excel: excel,
        ppt: ppt,
        word: word,
      },
      preview: false,
      contextMenuVisible: false,
      contextMenuStyle: {
        top: '0px',
        left: '0px'
      },
      dialogWidth: 800,
      move: {
        show: false,
        newName: '',
        name: '',
        treeProps: {
          label: 'name'
        },
        type: ''
      },
      rename: {
        show: false,
        newName: '',
        name: '',
      },
      contextRow: {},
    }
  },
  mounted() {
    this.listHeight = window.innerHeight - 190;
    this.initBreadcrumb();
    let showType = localStorage.getItem("tableType")
    if (!showType) {
      showType = "table"
    }
    this.tableType = showType
    window.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('resize', this.updateMoveWidth)
  },
  methods: {
    initBreadcrumb() {
      this.breadcrumb = []
      let path = decodeURIComponent(this.$route.path)
      path = path.split('/').slice(2)
      for (let i = 0; i < path.length; i++) {
        this.breadcrumb.push({
          title: path[i],
          path: '/home/' + path.slice(0, i + 1).join('/')
        })
      }

      let previewFile = JSON.parse(localStorage.getItem('preview'))
      if (previewFile != null && path[path.length - 1] === previewFile.name) {
        this.preview = true
      } else {
        localStorage.removeItem('preview')
        this.preview = false
        this.getTableList()
      }
    },
    getTableList(refresh = false) {
      let path = decodeURIComponent(this.$route.path)
      if (path == '/home') {
        path = '/'
      } else {
        path = path.replace('/home', '')
      }
      this.$common.axiosJson("/pub/dav/list.do", {path: path, refresh}, false).then(res => {
        if (res.success) {
          this.tableList = res.data
        } else {
          this.$message.error(res.msg);
        }
      })

    },
    getFileIcon(row) {
      if (row.type == 'folder') {
        return this.fileIcon.folder
      } else {
        if (row.contentType == null) {
          return this.fileIcon.file
        }
        if (row.contentType.indexOf('image') > -1) {
          return this.fileIcon.image
        }
        if (row.contentType.indexOf('video') > -1) {
          return this.fileIcon.video
        }
        if (row.contentType.indexOf('text') > -1) {
          return this.fileIcon.text
        }
        if (row.contentType.indexOf('audio') > -1) {
          return this.fileIcon.audio
        }
        if (row.contentType.indexOf('pdf') > -1) {
          return this.fileIcon.pdf
        }
        if (row.contentType.indexOf('sheet') > -1) {
          return this.fileIcon.excel
        }
        if (row.contentType.indexOf('wordprocessingml') > -1) {
          return this.fileIcon.word
        }
        if (row.contentType.indexOf('presentation') > -1) {
          return this.fileIcon.ppt
        }
        return this.fileIcon.file
      }
    },
    goPath(row) {
      if (row.type == 'file') {
        localStorage.preview = JSON.stringify(row)
      }
      this.$router.push({
        path: '/home' + row.href,
      })
    },
    formatSize(bytes) {
      if (bytes < 1024) return bytes + 'B'
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB'
      else if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + 'MB'
      else return (bytes / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    },
    showType() {
      let showType = localStorage.getItem("tableType")
      this.tableType = showType
      if (this.tableType == 'grid') {
        this.tableType = 'table'
        localStorage.tableType = 'table'
      } else {
        this.tableType = 'grid'
        localStorage.tableType = 'grid'
      }
    },
    showContextMenu(row, column, event) {
      event.preventDefault()
      this.contextRow = row
      this.contextMenuStyle.top = `${event.clientY}px`
      this.contextMenuStyle.left = `${event.clientX}px`
      this.contextMenuVisible = true
    },
    handleOutsideClick(e) {
      const menu = this.$refs.contextMenu
      if (menu && menu.contains(e.target)) return

      this.contextMenuVisible = false
    },
    closeRename() {
      this.rename = {
        width: 800,
        show: false,
        newName: '',
        name: ''
      }
    },
    closeMove() {
      this.move = {
        width: 800,
        show: false,
        newName: '',
        name: ''
      }
    },
    rootPathLoad(node, resolve, reject) {
      let path = node.data.href
      if (path == null || path === '') {
        let data = {
          name: '/',
          href: '/'
        }
        resolve([data])
      } else {
        this.$common.axiosJson("/pub/dav/list.do", {path}, false).then((res) => {
          if (res.success) {
            let data = res.data.filter(item => item.type === 'folder')
            resolve(data)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    submitRename() {
      let Destination = this.rename.href
      let path = Destination.replace(this.rename.name, this.rename.newName)
      this.$common.axiosForm("/pub/dav/move.do", {path: Destination}, true, {Destination: path}).then(res => {
        if (res.success) {
          this.closeRename()
          this.refreshTable()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    submitMove() {
      this.move.newName = this.$refs.pathTree.getCurrentKey()
      if (!this.move.newName.endsWith("/")) {
        this.move.newName += "/"
      }
      this.move.newName += this.move.name
      this.$common.axiosForm("/pub/dav/" + this.move.type + ".do", {path: this.move.href}, true, {Destination: encodeURIComponent(this.move.newName)}).then(res => {
        if (res.success) {
          this.closeMove()
          this.refreshTable()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    refreshTable() {
      this.getTableList(true)
    },
    updateMoveWidth() {
      let innerWidth = window.innerWidth
      if (innerWidth >= 940) {
        this.dialogWidth = 800
      } else {
        this.dialogWidth = '85%'
      }
    },
    onMenuClick(type) {
      this.contextMenuVisible = false
      if (type === 'rename') {
        this.rename.show = true
        this.rename.name = this.contextRow.name
        this.rename.newName = this.contextRow.name
        this.rename.href = this.contextRow.href
      } else if (type === 'delete') {
        this.$messageBox.confirm(
            '确定要删除吗?',
            '提示：',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
          this.$common.axiosForm("/pub/dav/delete.do", {path: this.contextRow.href}, false).then(res => {
            if (res.success) {
              this.refreshTable()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
            .catch(() => {
            })
      } else if (type === 'copyUrl') {
        let path = location.origin + "/api/pub/dav/download.do?path=" + this.contextRow.href + "&token=" + this.$common.getCookies("Authorization-Key")

        const textarea = document.createElement('textarea')
        textarea.value = path
        textarea.style.position = 'fixed' // 避免页面跳动
        textarea.style.opacity = 0
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()

        try {
          const success = document.execCommand('copy')
          success
              ? this.$message?.success?.('复制成功') || alert('复制成功')
              : this.$message?.error?.('复制失败') || alert('复制失败')
        } catch (err) {
          console.error('复制异常:', err)
        }

        document.body.removeChild(textarea)
      } else if (type === 'download') {
        let path = this.contextRow.href
        window.open("/api/pub/dav/download.do?path=" + path, '_blank');
      } else if (type === 'move' || type === 'copy') {
        this.move.show = true
        this.move.name = this.contextRow.name
        this.move.newName = this.contextRow.name
        this.move.href = this.contextRow.href
        this.move.type = type
      }

    }
  }
}

</script>

<style scoped>
.file-layout, .file-layout__header {
  width: 100%;
}

.file-layout__table {
  width: calc(100% - 40px);
  background: white;
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 5px;
  border-radius: 15px;
  height: calc(100% - 40px);
  padding: 10px;
}

.file-layout, .files-path, .files-view-type {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.files-view-type {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

.files-view-type:hover {
  background: rgb(232.8, 233.4, 234.6);
}

.files-path {
  width: calc(100% - 45px);
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.file-layout__header {
  height: 40px;
  display: flex;
}

.el-breadcrumb {
  display: flex;
  font-size: 16px;
}

.el-breadcrumb__item {
  white-space: nowrap;
}

.floating_action {
  //position: absolute;
}

.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding: 5px 0;
  width: 120px;
  border-radius: 4px;
}

.context-menu .menu-item {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.context-menu .menu-item:hover {
  background-color: #f5f7fa;
}
</style>