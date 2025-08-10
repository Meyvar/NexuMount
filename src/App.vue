<template>
  <router-view/>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.getWebConfig()
  },
  methods: {
    async getWebConfig() {
      let res = await this.$common.axiosGet("/public/getWebConfig.do", true)
      if (res.success) {
        this.$store.commit("setWebConfig", res.data)
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
}
</style>