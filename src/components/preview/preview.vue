<template>
  <div class="preview" :style="{ height: height + 'px' }">
    <div class="preview_content">
      <img class="content_img" v-if="type === 'image'" :src="href">
      <vue3-video-player :src="href" v-else-if="type === 'video' || type === 'audio'"></vue3-video-player>
      <preview-text :src="href" v-else-if="type === 'text'"></preview-text>
      <iframe v-else-if="type === 'iframe'" frameborder="0" width="100%" height="100%"
              :src="href">
      </iframe>
      <pdf v-else-if="type === 'pdf'" :href="href"/>
      <div class="notPreview" v-else>
        <img :src="fileIcon">
        <div class="file-info">{{ fileData.name }} ({{ getFileSize(fileData.size) }})</div>
      </div>
    </div>
    <div class="button_list">
      <el-button type="primary" @click="copy">
        <img src="@/assets/icon/link.png" width="15" style="padding-right: 5px">复制链接
      </el-button>
      <el-button type="primary" @click="download">
        <img src="@/assets/icon/download.png" width="20" style="padding-right: 5px">下载
      </el-button>
    </div>
  </div>
</template>

<script>
import PreviewText from "@/components/preview/previewText.vue";
import Pdf from "@/components/preview/pdf.vue";

export default {
  components: {Pdf, PreviewText},
  props: {
    height: {
      type: Number,
      default: 100
    },
    getFileIcon: {
      type: Function,
      default: () => {
      }
    },
    getFileSize: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      type: '',
      href: '',
      text: '',
      fileIcon: null,
      fileData: {}
    }
  },
  mounted() {
    this.getFileData();
  },
  methods: {
    getFileData() {
      let path = decodeURIComponent(this.$route.path)
      if (path == '/home') {
        path = '/'
      } else {
        path = path.replace('/home', '')
      }

      this.$common.axiosGet("/pub/dav/get.do?path=" + path, false).then((res) => {
        if (res.success) {
          let data = res.data;
          this.fileData = data
          this.href = process.env.VUE_APP_BASE_API + "/pub/dav/download.do?path=" + data.href;

          let previewMap = {}
          let previewServer = JSON.parse(this.$store.getters.getWebConfig().previewServer)


          this.$store.getters.getWebConfig().previewText.split(",").forEach((v) => {
            previewMap[v] = previewServer.text.server
          })

          this.$store.getters.getWebConfig().previewAudio.split(",").forEach((v) => {
            previewMap[v] = previewServer.audio.server
          })

          this.$store.getters.getWebConfig().previewVideo.split(",").forEach((v) => {
            previewMap[v] = previewServer.video.server
          })

          this.$store.getters.getWebConfig().previewImage.split(",").forEach((v) => {
            previewMap[v] = previewServer.image.server
          })

          previewMap.pdf = previewServer.pdf.server

          for (let i = 0; i < previewServer.diy.length; i++) {
            let extensions = previewServer.diy[i].extension.split(',')
            extensions.forEach(extension => {
              previewMap[extension] = previewServer.diy[i].server
            })
          }

          let names = data.name.split('.')
          let extension = names[names.length - 1]

          let server = previewMap[extension]

          if (server === "systemImage") {
            this.type = "image"
          } else if (server === "systemVideo") {
            this.type = "video"
          } else if (server === "systemAudio") {
            this.type = "audio"
          } else if (server === "systemText") {
            this.type = "text"
          } else if (server === "systemPdf") {
            this.type = "pdf"
          } else {
            if (server != null && server !== "") {
              let url = location.origin + "/api/pub/dav/download.do?path=" + JSON.parse(localStorage.getItem("preview")).href + "&token=" + this.$common.getCookies("Authorization-Key")
              url = encodeURIComponent(url)
              let serverUrl = server.replace("${url}", url)

              this.href = serverUrl
              this.type = "iframe"
            } else {
              this.fileIcon = this.getFileIcon(res.data);
            }
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    download() {
      let path = JSON.parse(localStorage.getItem("preview")).href
      window.open("/api/pub/dav/download.do?path=" + path, '_blank');
    },
    async copy() {
      let path = location.origin + "/api/pub/dav/download.do?path=" + JSON.parse(localStorage.getItem("preview")).href + "&token=" + this.$common.getCookies("Authorization-Key")

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
    }
  }
}
</script>

<style scoped>
.preview {
  width: 100%;
}

.preview_content {
  width: 100%;
  height: calc(100% - 45px);
}

.button_list {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}

.content_img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 关键：按比例缩放完整显示 */
  object-position: center; /* 让图片居中 */
  display: block;
}

.content_video {
  width: 100%;
  height: 100%;
}

.notPreview {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.notPreview img {
  width: 120px;
}

.file-info {
  margin: 15px;
}
</style>