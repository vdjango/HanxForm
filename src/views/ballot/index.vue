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
                  <el-tag :type="ballot.refund_tag[scope.row.refund_status]" v-if="scope.row.refund_status !== 'NONE'">
                    {{ ballot.refund_status[scope.row.refund_status] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="订单号" align="right" width="280">
                <template #default="scope">{{ scope.row.out_trade_no }}</template>
              </el-table-column>
              <el-table-column label="购票日期" align="right" width="250">
                <template #default="scope">{{ scope.row.trade_no_restful.create_date }}</template>
              </el-table-column>
              <el-table-column label="操作" align="right" width="300">
                <template #header>
                  <el-autocomplete
                      v-model.lazy="search_input"
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
                    </template>
                  </el-autocomplete>
                </template>
                <template #default="scope">
                  <el-dropdown trigger="click">
                    <el-button type="primary">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-if="scope.row.status === 0" @click="refundTicket(scope)">退票
                        </el-dropdown-item>
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
        v-model="refund_center_dialog_visible"
        :title="refund_center_dialog_title"
        width="50%"
        destroy-on-close
    >
      <el-descriptions
          class="margin-top"
          :title="refund_center_dialog_data.trade_no_restful.activity_name"
          :column="3"
          size="small"
          border
      >
        <template #extra>
          <el-tag size="small" type="info">
            {{ refund_center_dialog_data.out_trade_no }}
          </el-tag>
        </template>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ refund_center_dialog_data.user_ful_.full_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            电话
          </template>
          {{ refund_center_dialog_data.user_ful_.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-location-outline"></i>
            Place
          </template>
          Suzhou
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-office-building"></i>
            支付状态
          </template>
          <el-tag size="small" :type="ballot.tag[refund_center_dialog_data.status]">
            {{ ballot.status[refund_center_dialog_data.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-tickets"></i>
            证件
          </template>
          <el-tag size="small">
            <template v-if="refund_center_dialog_data.user_ful_.certificates === 1">身份证</template>
            <template v-else-if="refund_center_dialog_data.user_ful_.certificates === 2">护照</template>
            <template v-else>未知</template>
          </el-tag>
          - {{ refund_center_dialog_data.user_ful_.certificates_no }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
          :column="2"
          size="small"
          style="margin-top: 15px"
          border
      >
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-user"></i>
            票种
          </template>
          {{ refund_center_dialog_data.trade_no_restful.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            单价
          </template>
          {{ refund_center_dialog_data.trade_no_restful.money / 100 }}元
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            数量
          </template>
          {{ refund_center_dialog_data.number }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            核销状态
          </template>
          <!--          <template v-if="refund_center_dialog_data.off_statuc === 0">已核销</template>-->
          <!--          <template v-if="refund_center_dialog_data.off_statuc === 1">已核销部分</template>-->
          <!--          <template v-if="refund_center_dialog_data.off_statuc === 2">未核销</template>-->
          未实现
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-office-building"></i>
            有效期
          </template>
          <el-tag size="small">
            {{ refund_center_dialog_data.trade_no_restful.start_date }}
          </el-tag>
          -
          <el-tag size="small">
            {{ refund_center_dialog_data.trade_no_restful.end_date }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-alert style="margin-top: 15px" title="退款金额单位未分，不是元哦～ 换算 乘以100 即为元" type="warning"/>

      <el-form
          ref="numberValidateForm"
          :model="refund_restful"
          size="mini"
          style="margin-top: 15px"
          :inline="true"
      >
        <el-form-item label="退款金额" prop="amount_refund" :rules="refund_form_rules.amount_refund">
          <el-input
              v-model.number="refund_restful.amount_refund"
              placeholder="单位未分，不是元哦～ 换算 乘以100 即为元"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款备注" prop="context">
          <el-input
              v-model="refund_restful.context"
              placeholder="退款备注"
          ></el-input>
        </el-form-item>
      </el-form>


      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="refundTicketClick">提交</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {
  ElForm,
  ElFormItem,
  ElDescriptions,
  ElDescriptionsItem,
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
  ElOption, ElAlert,
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
      tabsValue: '所有',
      ballot: {
        refund_status: {
          'SUCCESS': '已退款',
          'CLOSE': '退款关闭',
          'ABNORMAL': '退款异常',
          'WAITING': '等待退款',
          'NONE': '未发起',
        },
        refund_tag: {
          'SUCCESS': 'success',
          'CLOSE': 'info',
          'ABNORMAL': 'danger',
          'WAITING': 'warning',
          'NONE': 'default',
        },
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

      // 手动退票
      refund_center_dialog_visible: false,
      refund_center_dialog_title: '补充退款信息',
      refund_center_dialog_data: {
        id: null,
        money: 7800,
        name: "现场票",
        number: 1,
        openid: "ovil75KpNFuNT2lMNSFfwS5g3sUY",
        out_trade_no: "3831ca86dd23307cd9e8f711931bb9",
        prepay_id: "wx21152136096737372725fdda4783bd0000",
        price: 7800,
        refund_status: "NONE",
        status: 0,
        trade_no: 40,
        user_ful: 1164,
        userid: 2192,
        trade_no_restful: {
          change_date: "2021-09-10T22:55:13.109332+08:00",
          create_date: "2021-08-26T09:03:28.808924+08:00",
          date: "2021-09-21T20:00:00+08:00",
          end_date: "2021-09-21T20:00:00+08:00",
          id: 40,
          money: 7800,
          name: "现场票",
          num: 99999,
          rwm_image: null,
          start_date: "2021-09-10T22:13:20.710734+08:00",
          static: 2,
        },
        user_ful_: {
          certificates: 1,
          certificates_no: "TS2150704",
          change_date: "2021-09-21T15:21:27.941582+08:00",
          create_date: "2021-09-21T15:21:27.941553+08:00",
          full_name: "八田尚彦",
          id: 1164,
          mobile: "13701074017",
        },
        userid_: {
          applets_avatar_url: "https://thirdwx.qlogo.cn/mmopen/vi_32/kVUxIabrEQrPanojgYjicPeRBT6dkbpeGSzXKN0QHT4tFYRs784oKlJqA3hPLsLmiaGcbp3TkVFU5Z7cGRPHT7zw/132",
          applets_language: "ja",
          applets_nick_name: "八田（Hatta)",
          applets_openid: "ovil75KpNFuNT2lMNSFfwS5g3sUY",
          date_joined: 1632891540,
          email: null,
          id: 2192,
          is_staff: false,
          username: "八田（Hatta)",
          uuid: "cdd2ec20-3fbd-4cc4-a6e1-cb50bf4b342a",
        }
      },
      refund_restful: {
        status: 2,
        message: 0,
        out_trade_no: null,
        refund_status: "WAITING",
        context: '',  // 退款原因
        number: null,
        money: null,
        price: null,
        openid: null,
        pay_user_info_key: null,
        pay_user_key: null,
        pay_key: null,

        // amount_payer_refund: null,
        // amount_payer_total: null,
        amount_refund: 0, // 退款金额
        amount_total: 0, // 原订单金额
      },
      refund_form_rules: {
        amount_refund: [{required: true, message: '请输入退款金额'}, {type: 'number', message: '只能输入数字哦～'}]
      }

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
    ElPopover,
    ElDescriptions,
    ElDescriptionsItem,
    ElForm,
    ElFormItem,
    ElAlert
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
        // count: this.restfulAllTable.count,
        // next: this.restfulAllTable.next,
        // previous: this.restfulAllTable.previous,
        // index: this.restfulAllTable.index,
        // pageSize: this.restfulAllTable.pageSize
      }
      console.log('pagination', pagination)
      return axios.paymentPayRefund(method, data, index, pagination).then((response) => {
        console.log(response)
        // this.restfulAllTable.count = response.data.count
        // this.restfulAllTable.next = response.data.next
        // this.restfulAllTable.previous = response.data.previous
        // this.restfulAllTable.results = response.data.results
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
      // this.centerDialogVisible = true
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
    },
    refundTicket(scope) {
      console.log(scope.row)
      this.refund_center_dialog_data = scope.row
      this.refund_restful.status = 2
      this.refund_restful.message = 0
      this.refund_restful.out_trade_no = scope.row.out_trade_no
      this.refund_restful.refund_status = 'WAITING'
      this.refund_restful.pay_key = scope.row.id
      this.refund_restful.number = scope.row.number
      this.refund_restful.money = scope.row.money
      this.refund_restful.price = scope.row.price
      this.refund_restful.openid = scope.row.openid
      this.refund_restful.pay_user_info_key = scope.row.user_ful
      this.refund_restful.pay_user_key = scope.row.userid

      this.refund_restful.amount_total = scope.row.money  // 原订单金额
      this.refund_restful.amount_refund = scope.row.money  // 退款金额
      // this.refund_restful.context = ''

      this.refund_center_dialog_visible = true


      console.log('this.refund_restful', this.refund_restful)
    },
    refundTicketClick() {
      this.requestPayRefund('POST', this.refund_restful).then((response) => {
        this.refund_center_dialog_visible = false
      })
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
