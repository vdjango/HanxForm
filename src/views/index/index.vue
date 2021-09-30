<template>
<div>index</div>
</template>

<script>
export default {
  name: "index",
  created() {
    this.$store.commit('setIsDefaultActiveLeftMenu', 'index')
  }
}
</script>

<style scoped>

</style>
