<template>
  <div class="auth">

    <el-card shadow="always" class="auth-login" :body-style="{ padding: '0px' }">

      <div class="login-info"></div>
      <div class="login-form">
        <router-view name="auth"></router-view>


      </div>

    </el-card>


  </div>
</template>

<script src="./_auth.js" lang="js"></script>
<style src="./_auth.less" lang="less" scoped></style>
