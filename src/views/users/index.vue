<template>
<div>user</div>
</template>

<script>
export default {
  name: "index",
  created() {
    this.$store.commit('setIsDefaultActiveLeftMenu', 'users')
  }
}
</script>

<style scoped>

</style>
