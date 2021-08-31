<template>
  <el-container>
    <el-aside width="200px">
       <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
        >
          <el-sub-menu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <template #title>导航二</template>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <template #title>导航三</template>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <template #title>导航四</template>
          </el-menu-item>
        </el-menu>
    </el-aside>
    <el-container>
      <el-header>


      </el-header>
      <el-main>
        <router-view name="order"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain, ElMenu, ElSubmenu, ElMenuItemGroup, ElMenuItem
} from 'element-plus'


export default {
  name: "Order",
  components: {
    ElContainer,
    ElAside,
    ElHeader,
    ElMain,
    ElMenu,
    ElSubmenu,
    ElMenuItemGroup,
    ElMenuItem
  }
}
</script>

<style scoped>

</style>
