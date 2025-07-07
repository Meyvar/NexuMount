<template>
  <el-scrollbar>
    <div
        v-for="(line, index) in highlightedLines"
        :key="index"
        class="line"
    >
      <div class="line-number">{{ index + 1 }}</div>
      <div class="line-content" v-html="line"></div>
    </div>
  </el-scrollbar>


</template>

<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      highlightedLines: []
    }
  },
  mounted() {
    this.loadAndHighlight()
  },
  methods: {
    async loadAndHighlight() {
      try {
        const response = await fetch(this.src)
        if (!response.ok) throw new Error('加载失败')
        const text = await response.text()

        // 高亮整个文本（自动识别语言）
        const {value} = hljs.highlightAuto(text)

        // 按行拆分
        this.highlightedLines = value.split('\n')
      } catch (e) {
        this.highlightedLines = [`<span style="color:red;">${e.message}</span>`]
      }
    }
  }
}
</script>

<style scoped>
.line {
  display: flex;
  background: #eee;
}

.line-number {
  width: 40px;
  color: #999;
  text-align: right;
  padding-right: 10px;
  user-select: none;
  flex-shrink: 0;
}

.line-content {
  flex: 1;
  white-space: pre-wrap;
}
</style>
