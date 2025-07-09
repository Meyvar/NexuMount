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
    <UploadBox ref="uploadBox" upload-url="/api/pub/dav/upload.do"/>
  </el-dialog>
</template>

<script>
import UploadBox from "@/components/floatingAction/uploadFile.vue";

let vm;
export default {
  components: {UploadBox},
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth)
  },
  data() {
    return {
      expanded: false,
      showUploadFile: false,
      actions: [
        {
          label: '刷新列表',
          handler(){
            vm.$emit("refreshTable")
          }
        },
        {
          label: '上传文件',
          handler() {
            vm.showUploadFile = true;
          }
        },
        {
          label: '新建文件夹',
          handler: () => this.$emit('create-folder')
        }
      ],
      uploadWidth: 800
    }
  },
  mounted() {
    vm = this;
    window.addEventListener('resize', this.updateWidth)
    this.updateWidth()
  },
  methods: {
    updateWidth() {
      let innerWidth = window.innerWidth
      if (innerWidth >= 940) {
        this.uploadWidth = 800
      }else{
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
