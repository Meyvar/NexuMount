<template>
  <div class="breadcrumb">
    <div class="breadcrumb-item">
      <div class="breadcrumb-title">
        <img src="@/assets/icon/house.png" width="20">
      </div>
    </div>
    <div class="breadcrumb-item" v-for="item in breadcrumb" :key="item.path">
      <span>{{ this.separator }}</span>
      <div class="breadcrumb-title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    breadcrumb: {
      type: Array,
      default: () => []
    },
    separator: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.breadcrumb)
  }
}
</script>

<style scoped>
.breadcrumb, .breadcrumb-item {
  display: flex;
  white-space: nowrap;
}

.breadcrumb-item span {
  margin: 0 5px;
}
</style>