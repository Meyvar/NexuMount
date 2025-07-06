<template>
  <div class="preview" :style="{ height: height + 'px' }">
    <div class="preview_content">
      <img class="content_img" v-if="type == 'image'" :src="href">
      <vue3-video-player :src="href" v-if="type == 'video' || type == 'audio'"></vue3-video-player>
    </div>
    <div class="button_list">
      <el-button type="primary"><img src="@/assets/icon/link.png" width="15" style="padding-right: 5px">复制链接</el-button>
      <el-button type="primary" @click="download"><img src="@/assets/icon/download.png" width="20" style="padding-right: 5px">下载</el-button>
    </div>
  </div>
</template>

<script>
import PreviewText from "@/components/preview/previewText.vue";

export default {
  components: {PreviewText},
  props: {
    height: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      type: '',
      href: '',
      text: ''
    }
  },
  mounted() {
    this.getFileData();
  },
  methods: {
    getFileData() {
      let file = JSON.parse(localStorage.getItem("preview"));
      this.$common.axiosGet("/pub/dav/get.do?path=" + file.href, false).then((res) => {
        if (res.success) {
          let data = res.data;
          this.href = data.href;
          if (data.contentType.indexOf('image') > -1) {
            this.type = "image"
          } else if (data.contentType.indexOf('video') > -1) {
            this.type = "video"
          } else if (data.contentType.indexOf('audio') > -1) {
            this.type = "audio"
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    download() {
      // window.open(this.href, '_blank');

      const link = document.createElement('a');
      link.href = this.href;
      link.download = JSON.parse(localStorage.getItem("preview")).name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
  height: calc(100% - 40px);
}

.button_list {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>