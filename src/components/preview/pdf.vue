<template>
  <el-scrollbar>
    <pdfenbed :source="href"/>
  </el-scrollbar>
</template>

<script>
import pdfenbed from 'vue-pdf-embed'

export default {
  components: {
    pdfenbed
  },
  props: {
    href: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>