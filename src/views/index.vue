<template>
  <el-container>
    <el-aside style="width: max-content !important;">
      <el-menu :default-active="IsDefaultActiveLeftMenu"
               :collapse="isCollapse" @select="selectMenuOpenClase"
               style="height: 100vh"
      >
        <el-menu-item index="open/clase">
          <i :class="OpenCloeMenu.isCollapseIcon"></i>
          <template #title>{{ OpenCloeMenu.isCollapseTest }}</template>
        </el-menu-item>
        <el-menu-item
            v-for="(item, index) in leftMenu" :key="index"
            :index="item.toRouter.name"
            :route="item.toRouter"
        >
          <i :class="item.icon"></i>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view name="index" v-if="isRouterAlive"></router-view>
    </el-main>
  </el-container>
</template>


<script>

import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain, ElMenu, ElMenuItemGroup, ElMenuItem, ElSubmenu, ElIcon,
} from 'element-plus'

import {
  ChatRound
} from '@element-plus/icons'

export default {
  name: 'Index',
  provide() {
    return {
      reload: this.reload,
      routerIndex: this.routerIndex,
      routerLogin: this.routerLogin,
      username: this.username,
      loginSigout: this.loginSigout
    }
  },
  data() {
    return {
      msg: 'vue-amap向你问好！',
      isRouterAlive: true,
      isCollapse: true,
      /**
       * topName: 头部导航栏 logo信息，网站名称
       * topActive: 头部导航栏菜单默认项 激活的菜单
       * topHeader: 头部导航栏菜单 菜单列表
       * topAuthUser: 头部导航栏菜单 用户信息菜单
       * isCollapsed: 控制侧边栏 [收起/展开] 状态
       * mode: 控制侧边栏 皮肤
       * user: 用户相关信息
       * user.headimage: 用户头像地址
       */
      topName: '微题',
      topActive: '用户管理',
      topHeader: [],
      leftMenu: [],
      OpenCloeMenu: {
        isCollapse: true,
        isCollapseTest: '展开',
        isCollapseIcon: 'el-icon-arrow-right',
        width: 65
      },
      IsDefaultActiveLeftMenu: 'index',
      topAuthUser: {
        /**
         * auth: 用户信息
         * menu: 菜单列表
         * */
        auth: {
          /**
           * username: 用户名
           * headimage: 头像地址
           * */
          username: null,
          headimage: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
        },
        menu: [
          /**
           * name: 分组名称
           * childrem: 分组列表
           * */
          {
            name: '使用',
            childrem: [
              /**
               * name: 菜单名称
               * icon: 菜单ico图标
               * run: 菜单运行的方法，可预定义
               * toRouter: 路由信息
               * */
              {
                toRouter: {
                  name: 'index'
                },
                name: '首页',
                icon: 'ios-contact',
                run: null
              }
            ]
          },
          {
            name: '账户',
            childrem: [
              {
                toRouter: {
                  name: 'index'
                },
                name: '修改密码',
                icon: 'ios-key',
                run: null
              },
              {
                toRouter: {
                  name: 'index'
                },
                name: '退出登录',
                icon: 'ios-exit',
                run: this.loginSigout
              }
            ]
          }
        ]
      },
    }
  },
  created: function () {
    if (!this.topActive) {
      /**
       *  设置头部导航栏菜单 菜单默认项
       */
      // if (this.topHeader.length > 0) this.topActive = this.topHeader[0].name
    }
    this.topPath = this.$store.getters['getTopPath']
    this.topHeader = this.$store.getters['getTopHeader']
    this.leftMenu = this.$store.getters['getLeftMenu']
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    /* 登录成功后路由跳转 */
    routerIndex() {
      this.$nextTick(() => {
        this.$router.push({name: 'activity'})
      })
    },
    /* 未登录路由跳转 */
    routerLogin() {
      this.$nextTick(() => {
        this.$router.push({name: 'login'})
      })
    },
    username() {
      return this.$store.getters['auth/getUser']
    },
    loginSigout() {
      /**
       * 退出登录
       */
      this.$nextTick(() => {
        this.$store.commit('auth/clearAutherization')
      })
    },
    selectMenuOpenClase(index) {
      /**
       * 侧边菜单
       */
      if (index === 'open/clase') {
        // 展开收起菜单
        if (this.isCollapse) {
          this.OpenCloeMenu.isCollapseTest = '收起'
          this.OpenCloeMenu.isCollapseIcon = 'el-icon-arrow-left'
          this.OpenCloeMenu.width = 65
        } else {
          this.OpenCloeMenu.width = 200
          this.OpenCloeMenu.isCollapseTest = '展开'
          this.OpenCloeMenu.isCollapseIcon = 'el-icon-arrow-right'
        }
        this.isCollapse = !this.isCollapse
      } else {
        this.$router.push({
          name: index
        })
      }
      console.log(index)
    },
  },
  components: {
    ElContainer,
    ElAside,
    ElHeader,
    ElMain,
    ElMenu,
    ElMenuItemGroup,
    ElMenuItem,
    'el-sub-menu': ElSubmenu,
    ElIcon,
    ChatRound
  },
  computed: {
    getLeftMenus() {
      return this.$store.getters['getLeftMenu']
    },
    getTopPath() {
      return this.$store.getters['getTopPath']
    },
    getTopActives() {
      return this.$store.getters['getTopActive']
    },
    getIsDefaultActiveLeftMenu() {
      return this.$store.getters['getIsDefaultActiveLeftMenu']
    }
  },
  watch: {
    getLeftMenus(vale,) {
      this.leftMenu = vale
    },
    getTopPath(vale,) {
      this.topPath = vale
    },
    getTopActives(vale,) {
      console.log(vale)
      this.topActive = vale
    },
    getIsDefaultActiveLeftMenu(vale,) {
      this.IsDefaultActiveLeftMenu = vale
    }
  },
}

</script>


<style scoped lang="less">
html, body {
  margin: 0;
  padding: 0;
  border: 0;
  /*overflow: hidden;*/

  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}


.el-header {
  padding: 0 !important;

  .el-menu {
    ::v-deep .el-submenu {
      float: right;
    }

    ::v-deep .el-menu-item {
      float: right;
    }
  }
}

</style>
