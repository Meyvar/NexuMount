<template>
  <div class="folder-grid">
    <div
        v-for="item in tableList"
        :key="item.id"
        class="file-item"
        @click="goPath(item)"
        @contextmenu.prevent="contextmenu(item, item , $event)"
    >
      <img :src="getFileIcon(item)" class="file-icon"/>
      <div class="file-name" :title="item.name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FolderGrid',
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    getFileIcon: {
      type: Function,
      default: () => {},
    },
    goPath: {
      type: Function,
      default: () => {},
    },
    contextmenu: {
      type: Function,
      default: () => {},
    }
  },
}
</script>

<style scoped>
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow: visible; /* 🔥 允许放大项不被裁剪 */
}

.file-item {
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
  will-change: transform;
  transform-origin: center;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.file-item:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.file-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 14px;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 100%;
}
</style>
