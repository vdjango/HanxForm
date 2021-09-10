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
        <el-card>
          <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="日期" width="120">
              <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="right">
              <template #header>
                <el-input size="mini" placeholder="输入关键字搜索"/>
              </template>
              <template #default="scope">
                <el-button size="mini">编辑</el-button>
                <!--  @click="handleDelete(scope.$index, scope.row)" -->
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--            @size-change="handleSizeChange"-->
          <!--            @current-change="handleCurrentChange"-->
          <!--           :current-page="currentPage4"-->
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
          >
          </el-pagination>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  ElRow,
  ElCol,
  ElCard,
  ElPageHeader,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElPagination
} from 'element-plus'

export default {
  name: "Order",
  inject: [
    'loginSigout',
    'username'
  ],
  data() {
    return {
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
      ]
    }
  },
  created: function () {
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
    ElPagination
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
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


</style>
