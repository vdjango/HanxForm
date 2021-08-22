<template>
  <div class="xiumi-editor-needx">
    <el-container>
      <el-aside style="width: max-content !important;">
        <el-menu
            default-active="1-4-1"
            class="el-menu-max"
            ref="menuleft"
            :collapse="menu_lest.isCollapse"
            @select="selectMenuOpenClase"
        >
          <el-menu-item index="open/clase">
            <i :class="menu_lest.isCollapseIcon"></i>  <!--el-icon-arrow-left-->
            <template #title>{{ menu_lest.isCollapseTest }}</template>
          </el-menu-item>

          <el-submenu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group title="分组一">
              <template #title>分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <template #title>预览</template>
          </el-menu-item>
          <el-menu-item index="preview" disabled>
            <i class="el-icon-document"></i>
            <template #title>导航三</template>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <template #title>导航四</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="15" :md="12" :lg="6" :xl="4">

            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <el-steps :space="200" :active="0" finish-status="success" align-center simple>
                    <el-step title="信息" icon="el-icon-edit"></el-step>
                    <el-step title="票种" icon="el-icon-s-ticket"></el-step>
                    <el-step title="发布" icon="el-icon-finished"></el-step>
                  </el-steps>
                </div>
              </template>

              <el-form label-position="right" label-width="80px" v-model="forms">
                <el-form-item label="活动主题" size="mini">
                  <el-input v-model="forms.name"></el-input>
                </el-form-item>
                <el-form-item label="封面图" size="mini">
                  <image-upload-cropper @result="base64result" style="display: flex;"></image-upload-cropper>
                </el-form-item>
                <el-form-item label="活动时间" size="small">
                  <el-date-picker
                      v-model="forms.date"
                      type="datetimerange"
                      :shortcuts="shortcuts"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-divider></el-divider>

                <el-form-item label="活动票种" size="small">
                  <el-select v-model="forms.ticket" clearable multiple placeholder="请选择">
                    <el-option label="免费" :value="0"></el-option>
                    <el-option label="收费" :value="1"></el-option>
                  </el-select>
                </el-form-item>

                <el-divider></el-divider>

                <el-form-item label="活动形式" size="small">
                  <el-select v-model="forms.shape" clearable placeholder="请选择">
                    <el-option label="线下" :value="0"></el-option>
                    <el-option label="线上" :value="1" :disabled="true"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="活动地点" size="small">
                  <el-button
                      icon="el-icon-location"
                      @click="centerDialogVisible = true"
                  >{{ forms.amap.address ? addersLocations : '定位' }}
                  </el-button>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="服务电话" size="small">
                  <el-input v-model="forms.telephone"></el-input>
                </el-form-item>
              </el-form>
            </el-card>


          </el-col>
          <el-col :xs="24" :sm="15" :md="12" :lg="8" :xl="5">
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
          <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="15" style="background-color: #000">
            <div class="grid-content bg-purple">321</div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog
        title="选择地点"
        v-model="centerDialogVisible"
        width="50%"
        destroy-on-close
        center
    >
      <!--@map-click="mapClick"-->
      <amap-jsapi-load-vue
          @querySearch="querySearch"
          @map-amp-loader="mapAmpLoader"
          height="50vh"
          class="box-dow"
          v-model:value="xs"
      >
      </amap-jsapi-load-vue>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="warning" @click="LocationTuning" :disabled="!(forms.amap.lnglat.length > 1)">微调</el-button>
      <el-button type="primary" @click="AMapDialog">确 定</el-button>
    </span>
      </template>

    </el-dialog>
  </div>
</template>

<script src="./_xiumi-editor-needx.js" lang="js"></script>
<style src="./_xiumi-editor-needx.less" lang="less" scoped></style>
