<template>
  <div class="ticket-card">
    <el-card class="box-list" shadow="hover" :body-style="{padding: '1px', }">
      <div class="ticket-box">
        <div class="title-main-top">
          <div class="title">{{ title }}</div>
          <div class="title-mini">剩余 {{ num }}张</div>
        </div>
        <div class="money">¥{{ money }}</div>
        <div class="ticket-box-bottom">
          <div class="texture">
            有效期 {{ date }} 之前有效
          </div>
          <div class="texture-image">
            <div class="erwm-image">
              <el-image :src="rwm_image">
                <template #error>
                  <div class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="text">入场出示凭证核销</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script src="./_ticket-card.js" lang="js"></script>
<style src="./ticket-card.less" lang="less" scoped></style>
