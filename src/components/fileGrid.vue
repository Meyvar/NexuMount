<template>
  <div class="folder-grid">
    <el-tooltip :content="item.name"
                v-for="item in tableList"
                :key="item.id"
                placement="top">
      <!-- 左上角复选框 -->
      <div
          class="file-item"
          @contextmenu.prevent="contextmenu(item, null, $event)"
          @click="goPath(item)"
      >

        <div class="file-checkbox" v-if="fileSelect">
          <el-checkbox v-model="item.select" @click.stop/>
        </div>

        <img :src="getFileIcon(item)" class="file-icon"/>
        <div class="file-name" :title="item.name">
          {{ item.name }}
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "FolderGrid",
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    getFileIcon: {
      type: Function,
      default: () => {
      },
    },
    goPath: {
      type: Function,
      default: () => {
      },
    },
    contextmenu: {
      type: Function,
      default: () => {
      },
    },
    fileSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectData: []
    }
  }
};
</script>

<style scoped>
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  padding: 20px;
}

.file-item {
  position: relative; /* 关键 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 12px;
  border-radius: 10px;
  background-color: #fafafa;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.file-item:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.file-checkbox {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 20;
}

.file-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
