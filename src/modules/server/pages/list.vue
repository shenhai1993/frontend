<template>
  <el-table
    ref="multipleTable"
    :data="filterServers"
    tooltip-effect="dark"
    height="100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="服务器名"
      prop="name">
      <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
    </el-table-column>
    <el-table-column
      prop="localip"
      label="本地IP"
      width="120">
    </el-table-column>
    <el-table-column
      prop="host"
      label="外网地址"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="port"
      label="服务端口"
      width="100">
    </el-table-column>
    <el-table-column
      prop="description"
      label="备注"
      show-overflow-tooltip>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  mounted () {
    let type = this.$route.params.type || 'all'
    this.filter(type)
  },

  data () {
    return {
      filterServers: [],
      servers: [
        { name: '中心服务器', type: 'center', localip: '192.168.1.100', host: 'cvm.zhctv.com', port: 80, description: 'cvm中心服务器' },
        { name: 'CDN流媒体', type: 'media', localip: '172.18.0.6', host: 'zhongcai302.c4hcdn.com/live', port: 1935, description: 'CDN流媒体服务器' },
        { name: '宁夏CDN推流服务器', type: 'stream', localip: '172.18.0.10', host: '172.18.0.10', port: 88821, description: '宁夏Ucloud推流服务,全部采用内网' }
      ]
    }
  },

  watch: {
    '$route' (to, from) {
      let type = to.params.type || 'all'
      this.filter(type)
    }
  },

  methods: {
    handleSelectionChange () {},

    filter (type) {
      if (type === 'all') {
        this.filterServers = this.servers
        return
      }

      this.filterServers = this.servers.filter(server => server.type === type)
    }
  }
}
</script>
