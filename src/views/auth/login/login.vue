<template>
  <div class="login">
    <div class="login-hello">欢迎登陆</div>
    <el-form :model="loginForm" :rules="loginRules"
             status-icon
             ref="loginForm"
             label-position="top"
             label-width="0px"
    >
      <el-form-item prop="username" label="用户名">
        <el-input type="text"
                  v-model="loginForm.username"
                  @keyup.enter="onLogin"
                  auto-complete="off"
                  placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password"
                  v-model="loginForm.password"
                  @keyup.enter="onLogin"
                  auto-complete="off"
                  placeholder="密码"
        ></el-input>
      </el-form-item>

      <div class="login-check">
        <el-checkbox v-model="checked" class="left">记住密码</el-checkbox>
        <el-link class="right" type="primary">注册账户</el-link>
      </div>


      <el-form-item style="width:100%;">
        <el-button type="primary" round style="width:100%;" @click="onLogin" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script src="./_login.js" lang="js"></script>
<style src="./_login.less" lang="less" scoped></style>
