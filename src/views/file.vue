<template>
  <div class="file-layout">
    <div class="file-layout__header">
      <div class="files-path">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{path: '/home'}">
            <img src="@/assets/icon/house.png" width="20">
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: item.path}" v-for="item in breadcrumb" :key="item.title">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="file-layout__table">


    </div>
  </div>
</template>

<script>
import folderIcon from '@/assets/icon/folder.png'
import imageIcon from '@/assets/icon/image.png'
import videoIcon from '@/assets/icon/video.png'
import txtIcon from '@/assets/icon/txt.png'
import fileIcon from '@/assets/icon/file.png'

export default {
  watch: {
    '$route.fullPath'() {
      this.initBreadcrumb();
    }
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
      }
    }
  },
  mounted() {
    this.listHeight = window.innerHeight - 190;
    this.initBreadcrumb()
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
      this.getTableList()
    },
    getTableList() {
      let path = decodeURIComponent(this.$route.path)
      if (path == '/home') {
        path = '/'
      } else {
        path = path.replace('/home', '')
      }
      this.$common.axiosJson("/pub/dav/list.do", {path: path}, true).then(res => {
        if (res.success) {
          this.tableList = []
          this.tableList = res.data
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    getFileIcon(row) {
      console.log(row.type)
      if (row.type == 'folder') {
        return this.fileIcon.folder
      } else {
        if (row.contentType == null){
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
        return this.fileIcon.file
      }
    },
    goPath(row) {
      this.$router.push({
        path: '/home' + row.href
      })
    },
    formatSize(bytes) {
      if (bytes < 1024) return bytes + 'B'
      else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB'
      else if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + 'MB'
      else return (bytes / 1024 / 1024 / 1024).toFixed(2) + 'GB'
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

.file-table-header {
  width: 100%;
  height: 20px;
  padding: 5px;
  display: flex;
}

.file-item {
  width: 100%;
  height: 50px;
}

.el-table {
  --el-table-border-color: n
}
</style>

<style>


/* ⚠️ 关键：固定表头表格的 body-wrapper 需要强制允许溢出 */
.file_item .el-table__body-wrapper {
  z-index: 0;
}

/* 行默认样式 */
.file_item .el-table__row {
  cursor: pointer;
}

/* 行默认样式 */
.file_item .el-table__row .table-row-content {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform-origin: center;
  cursor: pointer;
}

/* Hover 放大效果 */
.file_item .el-table__row:hover .table-row-content {
  transform: scale(1.02);
  z-index: 1;
}

</style>