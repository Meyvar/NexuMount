<template>
  <div class="text-content">
    <pre>{{ text }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: ''
    }
  },
  mounted() {
    this.loadContent()
  },
  methods: {
    loadContent() {
      this.$common.axiosGet(this.href).then((res) => {
        if (res.success) {
          this.text = res.data
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style scoped>
.text-content{
  width: 100%;
  height: 100%;
}
</style>