<template>
  <el-row class="row-bg" justify="center">
    <el-col :span="12">

      <el-descriptions
          title="系统信息"
          :column="3"
          border
      >
        <template #extra>
        </template>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-user"></i>
            OS
          </template>
          {{ system_info.system }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            Release
          </template>
          {{ system_info.release }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-location-outline"></i>
            Machine
          </template>
          {{ system_info.machine }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <el-icon>
              <cpu/>
            </el-icon>
            CPU
          </template>
          {{ system_info.cpu.count }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <el-icon>
              <coin/>
            </el-icon>
            Environment
          </template>
          python v{{ system_info.python.version }}
          <el-tag>{{ system_info.python.implementation }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <el-icon>
              <timer/>
            </el-icon>
            Time
          </template>
          {{ system_info.datetime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-office-building"></i>
            GCC
          </template>
          {{ system_info.python.gcc_compiler_version }}
        </el-descriptions-item>

      </el-descriptions>

      <el-card class="box-card" style="margin-top: 25px" shadow="never">
        <template #header>
          <div class="card-header">
            <span>使用状态</span>
          </div>
        </template>

        <el-row class="row-bg" justify="center">
          <el-col :span="24" style="display: grid;">
            <el-progress type="dashboard" :percentage="system_info.memory.total_used" style="margin: auto;">
              <template #default>
                <span class="percentage-value">{{ system_info.memory.total_used }}%</span>
                <span class="percentage-label">内存</span>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="8" style="display: grid;" v-for="(item, index) in system_info.disk.disk_partitions">
            <el-progress type="dashboard" :percentage="item.disk_usage.total_used" style="margin: auto;">
              <template #default>
                <span class="percentage-value">{{ item.disk_usage.total_used }}%</span>
                <span class="percentage-label">硬盘 {{ item.device }}</span>
              </template>
            </el-progress>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card" style="margin-top: 25px" shadow="never">
        <template #header>
          <div class="card-header">
            <span>登陆用户</span>
          </div>
        </template>
        <el-table :data="system_info.users" style="width: 100%">
          <el-table-column prop="name" label="用户" width="180"/>
          <el-table-column prop="terminal" label="终端" width="180"/>
          <el-table-column prop="host" label="地址"/>
        </el-table>
      </el-card>

    </el-col>
  </el-row>
</template>

<script>

import axios from "../../axios/index";
import {
  ElRow,
  ElCol,
  ElCard,
  ElTabs,
  ElTag,
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElIcon
} from 'element-plus'

import {
  Cpu,
  Timer,
  Coin
} from '@element-plus/icons'

export default {
  name: "index",
  data() {
    return {
      system_info: {
        "system": "Linux",
        "node": "hanfu",
        "release": "3.10.0-693.2.2.el7.x86_64",
        "version": "#1 SMP Tue Sep 12 22:26:13 UTC 2017",
        "machine": "x86_64",
        "processor": "x86_64",
        "datetime": "2021-10-03 13:13:19",
        "python": {
          "version": "3.6.8",
          "gcc_compiler_version": "GCC 4.8.5 20150623 (Red Hat 4.8.5-44)",
          "implementation": "CPython"
        },
        "cpu": {
          "count": 2,
          "count_logical": 1
        },
        "memory": {
          "total": 3824705536,
          "used": 672567296,
          "free": 888881152,
          'total_used': 0
        },
        "swap": {
          "total": 0,
          "used": 0,
          "free": 0
        },
        "disk": {
          "disk_io_counters": {
            "read_count": 158774,
            "write_count": 3664123,
            "read_bytes": 3672758272,
            "write_bytes": 42738171904,
            "read_time": 494573,
            "write_time": 2736229,
            "read_merged_count": 5964,
            "write_merged_count": 2522201,
            "busy_time": 163519
          },
          "disk_partitions": [
            {
              "device": "/dev/vda1",
              "mountpoint": "/",
              "fstype": "ext4",
              "opts": "rw,relatime,data=ordered",
              "maxfile": 255,
              "maxpath": 4096,
              "disk_usage": {
                "total": 1902616576,
                "used": 0,
                "free": 1902616576,
                "percent": 0.0,
                total_used: 0
              }
            },
            {
              "device": "/dev/vdb1",
              "mountpoint": "/home",
              "fstype": "ext4",
              "opts": "rw,relatime,data=ordered",
              "maxfile": 255,
              "maxpath": 4096,
              "disk_usage": {
                "total": 1902616576,
                "used": 0,
                "free": 1902616576,
                "percent": 0.0,
                total_used: 0
              }
            }
          ]
        },
        "net": {
          "bytes_sent": 117799799074,
          "bytes_recv": 69956491069,
          "packets_sent": 162334899,
          "packets_recv": 272188284,
          "errin": 0,
          "dropin": 0,
          "dropout": 0
        },
        "users": [
          {
            "name": "root",
            "terminal": "pts/0",
            "host": "123.120.208.42",
            "started": 1633238912.0,
            "pid": 25818
          }
        ]
      }
    }
  },
  created() {
    this.$store.commit('setIsDefaultActiveLeftMenu', 'index')
  },
  mounted() {
    axios.authIndex('GET').then((response) => {
      this.system_info = response.data.system_info
      console.log(this.system_info)
    })
  },
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElTabs,
    ElTag,
    ElButton,
    ElDescriptions,
    ElDescriptionsItem,
    ElProgress,
    ElTable,
    ElTableColumn,
    ElIcon,
    Cpu,
    Timer,
    Coin
  }
}
</script>

<style scoped lang="less">
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>
