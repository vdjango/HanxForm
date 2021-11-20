<template>
  <div>settings</div>
</template>

<script>
export default {
  name: "index",
  created() {
    this.$store.commit('setIsDefaultActiveLeftMenu', 'settings')
  }
}
</script>

<style scoped>

</style>
