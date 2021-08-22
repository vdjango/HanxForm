<template>
  <div class="amap-jsapi-load-vue">
    <div id="container" :style="{height: height, width: width}">
      <div class="info">
        <div class="input-item">
<!--          v-model.lazy.trim="value"-->
          <input id="tipinput" type="text"
                 v-model="value"
                 @input="$emit('update:value', $event.target.value)"
                 placeholder="设置地点"
          >
        </div>
        <p><span id="input-info"></span></p>
        <div id="panel"></div>
      </div>

    </div>
  </div>
</template>

<script src="./_amap-jsapi-load-vue.js" lang="js"></script>
<style src="./_amap-jsapi-load-vue.less" lang="less" scoped></style>
