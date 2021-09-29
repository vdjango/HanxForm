<template>
  <div>
    <el-row :gutter="50">
      <el-col :span="24" class="crumb">
        <el-card shadow="never" :body-style="{ padding: '10px 10px 25px' }">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>售票信息</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
      </el-col>

      <el-col :span="24">

        <el-tabs v-model="tabsValue" @tab-click="tabClick">
          <el-tab-pane label="所有" name="所有">
            <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="restfulPayInfoTable.results"
                @row-dblclick="rowClickAll"
                tooltip-effect="dark"
                style="width: 100%"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="票种"></el-table-column>
              <el-table-column label="姓名" width="200">
                <template #default="scope">{{ scope.row.user_ful_.full_name }}</template>
              </el-table-column>
              <el-table-column label="价格" width="150">
                <template #default="scope">{{ scope.row.money / 100 }}元</template>
              </el-table-column>
              <el-table-column label="状态" align="right" width="120">
                <template #default="scope">
                  <el-tag :type="ballot.tag[scope.row.status]">{{ ballot.status[scope.row.status] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="购票日期" align="right" width="250">
                <template #default="scope">{{ scope.row.trade_no_restful.create_date }}</template>
              </el-table-column>
              <el-table-column label="操作" align="right">
                <template #header>
                  <el-autocomplete
                      v-model="search_input"
                      multiple
                      filterable
                      :placeholder="'输入' + search_options[search_radio].value + '查询'"
                      :fetch-suggestions="remoteMethod"
                  >
                    <template #suffix>
                      <el-popover placement="left" :width="400" trigger="click">
                        <template #reference>
                          <el-button type="text" class="el-icon-edit el-input__icon"></el-button>

                        </template>
                        <el-radio-group v-model="search_radio">
                          <el-radio label="user_ful__full_name__icontains">姓名</el-radio>
                          <el-radio label="user_ful__mobile__icontains">电话</el-radio>
                          <el-radio label="user_ful__certificates_no__icontains">身份证</el-radio>
                          <el-radio label="out_trade_no__icontains">订单号</el-radio>
                        </el-radio-group>
                      </el-popover>
<!--                      <i class="el-icon-edit el-input__icon"></i>-->
                    </template>
                  </el-autocomplete>

                  <!--                  remoteRado-->


                  <!--                  <el-button type="primary" @click="remoteRado">@cancel="cancelEvent"-->
                  <!--                    {{ search_options[search_radio].value }}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                  <!--                  </el-button>-->

                </template>
                <template #default="scope">
                  <el-dropdown trigger="click">
                    <el-button type="primary">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-if="scope.row.status === 0">退票</el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.status != 0">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="restfulPayInfoTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="restfulPayInfoTable.count"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="退票中" name="退票中">退票中</el-tab-pane>
          <el-tab-pane label="已退票" name="已退票">已退票</el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>

    <el-dialog
        v-model="centerDialogVisible"
        title="Notice"
        width="30%"
        destroy-on-close
    >
      <div>

      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
        >Confirm</el-button
        >
      </span>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import {
  ElDialog,
  ElBreadcrumb,
  ElBreadcrumbItem, ElButton,
  ElCard,
  ElCol,
  ElInput,
  ElPageHeader, ElPagination,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElLoading,
  ElTag,
  ElSelect,
  ElOption,
  ElRadio, ElRadioGroup, ElAutocomplete, ElMessageBox, ElPopover,
} from "element-plus";
import axios from "@/axios/index";

export default {
  name: "index",
  inject: [
    'loginSigout',
    'username'
  ],
  data() {
    return {
      loading: false,
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
      currentPage: 1,
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      tabsValue: '所有',
      ballot: {
        status: {
          '-4': '工作人员/后台退款', // TODO DELETE
          '-3': '已退款',
          '-2': '系统已取消订单',
          '-1': '支付失败',
          '0': '支付成功',
          '1': '未支付',
        },
        tag: {
          '-4': 'warning', // TODO DELETE
          '-3': 'warning',
          '-2': 'info',
          '-1': 'danger',
          '0': 'success',
          '1': 'info',
        }
      },
      centerDialogVisible: false,
      restful: {},
      restfulPayInfoTable: {
        count: 0,
        next: null,
        previous: null,
        index: 1,
        pageSize: 10,
        results: []
      },
      // 远程搜索
      search_input: null,
      search_restful: [],
      search_options: {
        out_trade_no__icontains: {
          value: '订单号',
          search: {out_trade_no__icontains: null}
        },
        user_ful__certificates_no__icontains: {
          value: '身份证号',
          search: {user_ful__certificates_no__icontains: null}
        },
        user_ful__mobile__icontains: {
          value: '电话号',
          search: {user_ful__mobile__icontains: null}
        },
        user_ful__full_name__icontains: {
          value: '姓名',
          search: {user_ful__full_name__icontains: null}
        },
      },
      search_radio: 'out_trade_no__icontains',

    }
  },
  created() {
    const loading = ElLoading.service({
      lock: true,
    })
    this.requestPayInfo().finally(() => {
      loading.close()
    })
  },
  components: {
    ElPageHeader,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElRow,
    ElCol,
    ElCard,
    ElTable,
    ElTableColumn,
    ElInput,
    ElButton,
    ElPagination,
    ElTabs,
    ElTabPane,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElTag,
    ElDialog,
    ElSelect,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElAutocomplete,
    ElMessageBox,
    ElPopover
  },
  methods: {
    tabClick(val, event) {
      /**
       * 切换Tags时更新数据
       **/
      const label = val.props.label
      console.log(label)
    },
    handleSizeChange(val) {
      /**
       * 分页-展示条目
       **/
      this.restfulPayInfoTable.pageSize = val
      this.requestPayInfo()
    },
    handleCurrentChange(val) {
      /**
       * 分页-第几页
       **/
      this.restfulPayInfoTable.index = val
      this.requestPayInfo()
    },
    //
    requestPayRefund(method = 'GET', data = {}, index = null,) {
      /**
       * 活动退票信息
       * 请求数据，增删查改
       **/
      const loading = ElLoading.service({
        lock: true,
      })
      const pagination = {
        count: this.restfulAllTable.count,
        next: this.restfulAllTable.next,
        previous: this.restfulAllTable.previous,
        index: this.restfulAllTable.index,
        pageSize: this.restfulAllTable.pageSize
      }
      console.log('pagination', pagination)
      axios.paymentPayRefund(method, data, index, pagination).then((response) => {
        console.log(response)
        this.restfulAllTable.count = response.data.count
        this.restfulAllTable.next = response.data.next
        this.restfulAllTable.previous = response.data.previous
        this.restfulAllTable.results = response.data.results
      }).finally(() => {
        loading.close()
      })
    },
    requestPayInfo(method = 'GET', data = {}, index = null,) {
      /**
       * 活动已购门票信息
       * 请求数据，增删查改
       **/
      this.loading = true

      const pagination = {
        count: this.restfulPayInfoTable.count,
        next: this.restfulPayInfoTable.next,
        previous: this.restfulPayInfoTable.previous,
        index: this.restfulPayInfoTable.index,
        pageSize: this.restfulPayInfoTable.pageSize
      }
      console.log('pagination', pagination)
      return axios.paymentPayInfo(method, data, index, pagination).then((response) => {
        console.log(response)
        this.restfulPayInfoTable.count = response.data.count
        this.restfulPayInfoTable.next = response.data.next
        this.restfulPayInfoTable.previous = response.data.previous
        this.restfulPayInfoTable.results = response.data.results
      }).finally(() => {
        this.loading = false
      })
    },
    rowClickAll(row, column, event) {
      /**
       * 点击表格-所有
       */
      console.log(row)
      this.restful = row
      this.centerDialogVisible = true
    },
    remoteMethod(val, cb) {
      /**
       * 远程搜索
       */
      let timeout
      let data_ = []
      console.log(val)
      this.search_options[this.search_radio].search[this.search_radio] = val
      console.log(this.search_options[this.search_radio].search)
      this.requestPayInfo('GET', this.search_options[this.search_radio].search).then((response) => {
        for (let index in this.restfulPayInfoTable.results) {
          if (this.search_radio === 'out_trade_no__icontains') {
            data_.push({value: this.restfulPayInfoTable.results[index]['out_trade_no']})
          } else if (this.search_radio === 'user_ful__certificates_no__icontains') {
            data_.push({value: this.restfulPayInfoTable.results[index]['user_ful_']['certificates_no']})
          } else if (this.search_radio === 'user_ful__mobile__icontains') {
            data_.push({value: this.restfulPayInfoTable.results[index]['user_ful_']['mobile']})
          } else if (this.search_radio === 'user_ful__full_name__icontains') {
            console.log('this.restfulPayInfoTable.results[index]', this.restfulPayInfoTable.results[index])
            data_.push({value: this.restfulPayInfoTable.results[index]['user_ful_']['full_name']})
          }
        }

        clearTimeout(timeout)
        timeout = setTimeout(() => {
          console.log('data_', data_)
          cb(data_)
        }, 200)
      })

    },
    remoteRado() {
      /**
       *
       */
      ElMessageBox.alert(
          '<el-radio-group v-model="search_radio">' +
          '<el-radio label="user_ful__full_name__icontains">姓名</el-radio>' +
          '<el-radio label="user_ful__mobile__icontains">电话</el-radio>' +
          '<el-radio label="user_ful__certificates_no__icontains">身份证</el-radio>' +
          '<el-radio label="out_trade_no__icontains">订单号</el-radio>' +
          '</el-radio-group>', 'Title', {
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true
          })
      // ElMessageBox.alert({
      //   dangerouslyUseHTMLString: true,
      //   message: '<el-radio-group v-model="search_radio">\n' +
      //       '          <el-radio label="user_ful__full_name__icontains">姓名</el-radio>\n' +
      //       '          <el-radio label="user_ful__mobile__icontains">电话</el-radio>\n' +
      //       '          <el-radio label="user_ful__certificates_no__icontains">身份证</el-radio>\n' +
      //       '          <el-radio label="out_trade_no__icontains">订单号</el-radio>\n' +
      //       '        </el-radio-group>',
      // })
    }
  }
}
</script>


<style scoped lang="less">
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

.crumb {
  ::v-deep .el-card {
    border: unset !important;
  }
}

.pagination {
  margin-top: 20px;
  float: right;
}


</style>
