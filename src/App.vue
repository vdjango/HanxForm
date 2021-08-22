<template>
  <router-view v-if="isRouterAlive"/>
</template>


<script>

export default {
  name: 'app',
  provide() {
    return {
      reload: this.reload,
      routerIndex: this.routerIndex,
      routerLogin: this.routerLogin
    }
  },
  data() {
    return {
      msg: 'vue-amap向你问好！',
      isRouterAlive: true
    }
  },
  created() {
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    /* 登录成功后路由跳转 */
    routerIndex: function () {
      this.$nextTick(() => {
        this.$router.push({name: 'activity'})
      })
    },
    /* 未登录路由跳转 */
    routerLogin: function () {
      this.$nextTick(() => {
        this.$router.push({name: 'login'})
      })
    }
  }
}

</script>


<style>
html, body {
  margin: 0;
  padding: 0;
  border: 0;
  /*overflow: hidden;*/

  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}


</style>
