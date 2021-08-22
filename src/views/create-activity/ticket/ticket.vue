<template>
  <div class="ticket">

    <el-card class="box-card" :style="{height: '100vh !important'}" :body-style="{display: 'flex', 'flex-wrap': 'wrap'}">
      <template #header>
        <div class="card-header">
          <span>票种信息</span>
          <el-button class="button" type="text" @click="centerDialogVisible = true">添加票种</el-button>
        </div>
      </template>
      <div v-for="(item, index) in requestTicket.results" :key="index" style="width: 45.4em;">
        <ticket-card
            :title="item.name"
            :num="item.num"
            :money="item.money"
            :date="item.date"
            :rwm_image="item.rwm_image"
        ></ticket-card>
      </div>

    </el-card>

    <el-dialog
        title="添加票种"
        v-model="centerDialogVisible"
        width="20%"

        center
    >
      <el-form
          ref="ticketDialogForms"
          label-width="80px"
          :model="ticketForms"
          :rules="ticketRules"
          status-icon
      >
        <el-form-item label="票种名称" prop="name" size="mini">
          <el-input v-model="ticketForms.name"></el-input>
        </el-form-item>
        <el-form-item label="票种金额" prop="money" size="mini">
          <el-input v-model.number="ticketForms.money"></el-input>
        </el-form-item>
        <el-form-item label="票种数量" prop="num" size="mini">
          <el-input v-model.number="ticketForms.num"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="date" size="small">
          <el-date-picker style="display: flex;"
                          v-model="ticketForms.date"
                          type="datetime"
                          :shortcuts="shortcuts"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="DialogTicket">{{ ticketName }}</el-button>
        </span>
      </template>

    </el-dialog>
  </div>
</template>

<script src="./_ticket.js" lang="js"></script>
<style src="./_ticket.less" lang="less" scoped></style>
