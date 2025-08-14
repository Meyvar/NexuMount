<template>
  <el-table :data="tableList"
            style="width: 100%;"
            :height="listHeight"
            class="file_item"
            @cell-click="loadPath"
            show-overflow-tooltip
            @row-contextmenu="showContextMenu"
            @selection-change="selectionChange"
            ref="fileTable"
  >
    <el-table-column type="selection" width="40" v-if="fileSelect"/>
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
    showContextMenu: {
      type: Function,
      default: () => {
      }
    },
    fileSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFileSize: true
    }
  },
  mounted() {
    this.handleResize()
    this.setCurrentRow()
  },
  methods: {
    handleResize() {
      let windowWidth = window.innerWidth
      this.showFileSize = windowWidth >= 620;
    },
    loadPath(row, column) {
      if (column.type !== "selection") {
        this.goPath(row)
      }
    },
    selectionChange(selectArr) {
      let selectMap = {}
      selectArr.forEach((item) => {
        selectMap[item.name] = item
      })
      this.tableList.forEach(item => {
        if (selectMap[item.name] != null) {
          item.select = true
        } else {
          item.select = false
        }
      })
    },
    setCurrentRow() {
      let selectArr = []
      this.tableList.forEach(item => {
        if (item.select === true) {
          selectArr.push(item)
        }
      })
      selectArr.forEach((item) => {
        this.$refs.fileTable.toggleRowSelection(item, true)
      })
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