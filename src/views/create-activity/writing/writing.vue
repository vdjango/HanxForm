<template>
  <div class="writing">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="9">
        <div ref="ued_box">
          <!--v-model 有警告信息，需要重构-->
          <vue-ueditor-wrap
              v-model="forms.context"
              :config="editorConfig"
              :editor-dependencies="editorDependencies"
              @ready="ready"
              editor-id="editor-demo-01"
          ></vue-ueditor-wrap>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./_writing.js" lang="js"></script>
<style src="./_writing.less" lang="less" scoped></style>
