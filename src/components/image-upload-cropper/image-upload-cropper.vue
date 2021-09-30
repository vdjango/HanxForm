<template>
  <div class="image-upload-cropper">
    <!-- 选择图片 -->
    <el-upload
        v-if="(!result && !src)"
        class="upload-demo"
        drag
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="selectFile"
        :auto-upload="false"
        multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <!-- 选择图片 -->

    <!-- 结果预览区 -->
    <section v-else class="image-upload-cropper">
      <div class="el-upload-dragger" ref="preview">
        <img :id="elemid" v-if="src" :src="src" style="width: 100%; margin-top: 2%; border-radius: inherit;">
        <img :id="elemid" v-else :src="result" style="width: 100%; margin-top: 2%; border-radius: inherit;">
      </div>
    </section>
    <!-- 结果预览区 -->

    <!-- 用于裁切的弹窗 -->
    <el-dialog
        title="裁切"
        v-model="isShowDialog"
        width="40%"
        center
    >
      <!-- 图片裁切插件 -->
      <vue-picture-cropper
          :boxStyle="boxStyle"
          :img="pic"
          :options="options"
      />
      <!-- 图片裁切插件 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="getResult">裁切</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 用于裁切的弹窗 -->
  </div>
</template>

<script src="./_image-upload-cropper.js" lang="js"></script>
<style src="./_image-upload-cropper.less" lang="less" scoped></style>
