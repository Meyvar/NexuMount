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
                  :format-size="formatSize" v-if="!preview && tableType == 'table'"
      ></file-table>

      <el-scrollbar :height="listHeight" v-if="!preview && tableType == 'grid'">
        <file-grid :table-list="tableList" :getFileIcon="getFileIcon" :goPath="goPath"></file-grid>
      </el-scrollbar>

      <preview v-if="preview" :height="listHeight" :getFileIcon="getFileIcon" :get-file-size="formatSize"></preview>
    </div>
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

import FileTable from "@/components/fileTable.vue";
import PathBreadcrumb from "@/components/pathBreadcrumb.vue";
import Preview from "@/components/preview/preview.vue";
import FileGrid from "@/components/fileGrid.vue";

export default {
  components: {FileGrid, Preview, PathBreadcrumb, FileTable},
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
        audio: audioIcon,
        pdf: pdfIcon,
      },
      preview: false
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
    getTableList() {
      let path = decodeURIComponent(this.$route.path)
      if (path == '/home') {
        path = '/'
      } else {
        path = path.replace('/home', '')
      }

      let list = this.$store.getters.getFileListMap(path)
      if (list == null) {
        this.$common.axiosJson("/pub/dav/list.do", {path: path}, true).then(res => {
          if (res.success) {
            list = res.data
            this.tableList = list
            this.$store.commit('setFileList', {path: path, list: list})
          } else {
            this.$message.error(res.msg);
          }
        })
      } else {
        this.tableList = list
      }

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
</style>