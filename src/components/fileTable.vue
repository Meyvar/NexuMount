<template>
  <el-table :data="tableList"
            style="width: 100%;"
            :height="listHeight"
            class="file_item"
            @row-click="goPath"
            show-overflow-tooltip
            @row-contextmenu="showContextMenu"
  >
    <el-table-column prop="name" label="名称" style="padding-left: 10px">
      <template #default="scope">
        <div class="table-row-content" style="display: flex">
          <img :src="getFileIcon(scope.row)" width="23" height="23" style="margin-right: 10px">
          {{ scope.row.name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小" width="120" v-if="showFileSize">
      <template #default="scope">
        <div class="table-row-content">
          {{ scope.row.type == 'folder' ? '-' : formatSize(scope.row.size) }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="修改日期" width="160">
      <template #default="scope">
        <div class="table-row-content">
          {{ scope.row.date }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    listHeight: {
      type: Number,
      default: 0
    },
    tableList: {
      type: Array,
      default: () => []
    },
    getFileIcon: {
      type: Function,
      default: () => {
      }
    },
    goPath: {
      type: Function,
      default: () => {
      }
    },
    formatSize: {
      type: Function,
      default: () => {
      }
    },
    showContextMenu:{
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showFileSize: true
    }
  },
  mounted() {
    this.handleResize()
  },
  methods: {
    handleResize() {
      let windowWidth = window.innerWidth
      this.showFileSize = windowWidth >= 620;
    }
  }
}
</script>

<style scoped>
.el-table {
  --el-table-border-color: n
}
</style>


<style>

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