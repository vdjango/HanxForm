<template>
  <div class="create-activity">
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
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
            <el-card id="loaders" class="box-card" :body-style="{height: '88vh'}">
              <template #header>
                <div class="card-header">
                  <el-steps :space="200" :active="active.nextNum" finish-status="success" align-center simple>
                    <el-step title="信息" icon="el-icon-edit"></el-step>
                    <el-step title="票种" icon="el-icon-s-ticket"></el-step>
                    <el-step title="发布" icon="el-icon-finished"></el-step>
                  </el-steps>
                </div>
              </template>

              <div class="active-main">
                <div v-show="active.nextNum === 0">
                  <el-form ref="forms" label-width="80px" :model="forms" :rules="rules"
                           status-icon
                  >
                    <el-form-item label="活动主题" prop="name" size="mini">
                      <el-input v-model="forms.name"></el-input>
                    </el-form-item>
                    <el-form-item label="封面图" prop="base64result" size="mini">
                      <image-upload-cropper @result="base64result" style="display: flex;" :src="forms.base64result"
                      ></image-upload-cropper>
                    </el-form-item>
                    <el-form-item label="活动时间" prop="date" size="small">
                      <el-date-picker
                          style="display: flex;"
                          v-model="forms.date"
                          type="datetimerange"
                          :shortcuts="shortcuts"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @blur="blur"
                      >
                      </el-date-picker>
                    </el-form-item>

                    <el-divider></el-divider>

                    <el-form-item label="活动形式" prop="shape" size="small">
                      <el-select v-model="forms.shape" clearable placeholder="请选择" style="display: block;">
                        <el-option label="线下" :value="0"></el-option>
                        <el-option label="线上" :value="1" :disabled="true"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="活动地点" prop="amap" size="small">
                      <el-button
                          icon="el-icon-location"
                          @click="centerDialogVisible = true"
                      >{{ forms.amap.address ? addersLocations : '定位' }}
                      </el-button>
                    </el-form-item>
                    <el-divider></el-divider>
                    <el-form-item label="服务电话" prop="telephone" size="small">
                      <el-input v-model="forms.telephone"></el-input>
                    </el-form-item>

                  </el-form>
                </div>
                <div v-show="active.nextNum === 1">
                  活动票种设置
                </div>
                <div v-show="active.nextNum === 3">
                  活动图文排版
                </div>

                <div class="bottom">
                  <el-button v-if="active.nextNum !== 0" class="left" @click="LastNext">{{
                      active.buttonLast[active.nextNum]
                    }}
                  </el-button>
                  <el-button type="primary" class="right" @click="next">{{
                      active.buttonNext[active.nextNum]
                    }}
                  </el-button>
                </div>
              </div>

            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="9" :lg="16" :xl="18">
            <el-image :src="'https://api.hanfuc.com/media/activity-image/1627438206/2021-07-28_101006.jpeg'"></el-image>
            <router-view name="activity"></router-view>
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

<script src="./_create-activity.js" lang="js"></script>
<style src="./_create-activity.less" lang="less" scoped></style>
