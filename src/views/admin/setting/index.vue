<template>
  <div class="form-head">
    <el-button type="primary" @click="save">保存</el-button>
  </div>
  <div class="setting-from" ref="fromBox">
    <el-scrollbar :height="fromHeight">
      <el-form :model="form" label-width="auto"
               label-suffix="："
               style="padding: 20px">

        <el-divider content-position="right">站点</el-divider>
        <el-form-item label="网站标题">
          <el-input v-model="form.webTitle"/>
        </el-form-item>
        <el-form-item label="页面自定义脚本">
          <el-input v-model="form.webScript" type="textarea" rows="5"/>
        </el-form-item>
        <el-form-item label="页面自定义样式">
          <el-input v-model="form.webStyle" type="textarea" rows="5"/>
        </el-form-item>

        <el-divider content-position="right">预览</el-divider>
        <el-form-item label="预览服务">
          <el-input v-model="form.previewServer" type="textarea" rows="3"/>
        </el-form-item>
        <el-form-item label="文本类型">
          <el-input v-model="form.previewText" type="textarea" rows="3"/>
        </el-form-item>
        <el-form-item label="音频类型">
          <el-input v-model="form.previewAudio" type="textarea" rows="3"/>
        </el-form-item>
        <el-form-item label="视频类型">
          <el-input v-model="form.previewVideo" type="textarea" rows="3"/>
        </el-form-item>
        <el-form-item label="图片类型">
          <el-input v-model="form.previewImage" type="textarea" rows="3"/>
        </el-form-item>


        <el-divider content-position="right">任务</el-divider>
        <el-form-item label="上传任务线程">
          <el-input-number :min="1" :max="10" v-model="form.taskUploadNumber"/>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="移动/复制线程数">
              <el-input-number :min="1" :max="10" v-model="form.taskCopyNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件任务缓存大小（MB）">
              <el-input-number :min="1" :max="10" v-model="form.taskBufferSize"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      fromHeight: 0,
    }
  },
  mounted() {
    this.fromHeight = this.$refs.fromBox.offsetHeight
    this.get()
  },
  methods: {
    get() {
      this.$common.axiosGet("/public/getWebConfig.do", true).then(res => {
        if (res.success) {
          this.form = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    save() {
      this.$common.axiosForm("/sysSetting/save.do", this.form, true).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.$store.commit("setWebConfig", this.form)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.form-head {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.setting-from {
  background: #fff;
  height: calc(100% - 40px);
}

.el-input-number{
  width: 100%;
}
</style>