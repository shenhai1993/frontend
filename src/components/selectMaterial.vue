<template>
  <div class="select-material">
    <el-dialog
      title="选择素材"
      :visible.sync="showDialog"
      @close="close"
      width="60%"
      top="5vh">
      <div>
        <el-container>
          <el-aside width="270px">
            <div class="select-material-directory">
              <div class="select-material-header">目录</div>
              <div class="select-material-main">
                <el-tree
                  :data="materialData"
                  :props="materialProps"
                  highlight-current
                  accordion
                  @node-click="handleNodeClick">
                  <span slot-scope="{ node, data }"><i class="el-icon-folder" style="margin-right: 3px;"></i>{{node.label}}</span>
                </el-tree>
              </div>
            </div>
            <div class="select-material-preview">
              <div class="select-material-header">预览</div>
              <div class="select-material-main">
                <img v-show="previewImg != ''" class="select-material-preview-img" :src="previewImg" />
              </div>
            </div>
          </el-aside>
          <el-main>
            <div class="select-material-list">
              <div class="select-material-header">选择</div>
              <div class="select-material-main">
                <el-table
                  :data="materialList"
                  style="width: 100%"
                  height="505"
                  border
                  @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="name" label="名称">
                    <template slot-scope="scope">
                      <div @click="showPreview(scope.row)" style="height: 100%; color: #1989fa; cursor: pointer;">{{scope.row.name}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="size" label="分辨率" width="120"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-main>
        </el-container>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">完 成</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Terminaltemp } from '@/modules/terminaltemp/static/js/terminaltemp.js'

export default {
  props: {
    show: {
      type: Boolean
    }
  },

  data () {
    return {
      showDialog: this.show,
      currData: [],
      previewImg: '',
      materialDefault: [
        {
          name: '图1',
          url: 'http://10.104.6.204/storage/images/2020/06/04/o15m9wb12f_1591259302.jpg',
          size: '101 x 101'
        },
        {
          name: '图2',
          url: 'http://10.104.6.204/storage/images/2020/06/03/1159ri4m11_1591155075.jpg',
          size: '102 x 102'
        },
        {
          name: '图3',
          url: 'http://10.104.6.204/storage/images/2020/06/29/dn1o5w9at3_1593435064.jpg',
          size: '103 x 103'
        },
        {
          name: '图4',
          url: 'http://10.104.6.204/storage/images/2020/05/19/8158xs6f9n_1589868321.jpg',
          size: '104 x 104'
        },
        {
          name: '图5',
          url: 'http://10.104.6.204/storage/images/2020/06/29/x16593zw43_1593435112.jpg',
          size: '105 x 105'
        },
        {
          name: '图6',
          url: 'http://10.104.6.204/storage/images/2020/06/29/g159aygj3k_1593435206.jpeg',
          size: '106 x 106'
        },
        {
          name: '图7',
          url: 'http://10.104.6.204/storage/images/2020/06/29/15z9n4c3y4_1593435216.jpg',
          size: '107 x 107'
        },
        {
          name: '图8',
          url: 'http://10.104.6.204/storage/images/2020/05/09/if1580898y_1588989266.jpg',
          size: '108 x 108'
        },
        {
          name: '图9',
          url: 'http://10.104.6.204/storage/images/2020/06/04/o15m9wb12f_1591259302.jpg',
          size: '109 x 109'
        }
      ],
      materialList: [],
      materialProps: {
        label: 'name',
        children: 'children'
      },
      materialData: [
        // {
        //   name: '素材目录',
        //   children: []
        // }
      ],
      nodeId: -1
    }
  },

  created () {

  },

  mounted () {
    this.getDirectory()
  },

  methods: {
    getDirectory () {
      Terminaltemp.getMaterialDirectories().then(res => {
        if (res.data.success) {
          this.materialData.splice(0, 0, res.data.message)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    submit () {
      if (this.currData.length == 0) {
        this.$alert('请 “勾选” 需要添加的素材！', '提示', {
          confirmButtonText: '知道了'
        })
        return
      }
      this.showDialog = false
      this.$emit('submitSelectMaterial', this.currData)
    },

    close () {
      this.showDialog = false
      this.$emit('closeSelectMaterial')
    },

    handleNodeClick (data, node, el) {
      this.getNodeData(node)
    },

    getNodeData (node) {
      const isLeaf = node.isLeaf
      if (!isLeaf) {
        return
      }
      if (this.nodeId == node.data.id) {
        return
      }
      this.nodeId = node.data.id
      this.materialList = []
      this.currData = []
      this.previewImg = ''
      const length = this.nodeId
      for (let i = 0; i < length; i++) {
        const d = this.materialDefault[i]
        this.materialList.splice(i, 0, d)
      }
    },

    handleSelectionChange (val) {
      if (val.length > 0) {
        this.currData = val
        this.previewImg = this.currData[val.length - 1].url
      } else {
        this.currData = []
        this.previewImg = ''
      }
    },

    showPreview (val) {
      const data = val
      this.previewImg = data.url
    }
  }
}
</script>

<style lang="scss">
  .select-material {
    .select-material-list {
      th:first-child, td:first-child {
        text-align: center;
      }
      .el-table-column--selection .cell {
        padding-right: 10px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .select-material {
    .el-main {
      padding: 0 0 0 10px;
    }
    .select-material-directory, .select-material-preview, .select-material-list {
      width: 100%;
      height: 270px;
    }
    .select-material-list {
      height: 100%;
    }
    .select-material-directory, .select-material-preview, .select-material-list {
      .select-material-header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #1989fa;
        font-size: 16px;
        padding: 0 20px;
        background-color: #F5F7FA;
      }
      .select-material-main {
        width: 100%;
        height: calc(100% - 40px);
        border: 1px solid #EBEEF5;
        overflow: auto;
        .select-material-preview-img {
          width: 100%;
        }
      }
      .select-material-main::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      .select-material-main::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #EAE9EA;
      }
      .select-material-main::-webkit-scrollbar-track {
        border-radius: 2px;
        background: transparent;
      }
    }
    .select-material-directory {
      margin-bottom: 5px;
    }
  }
</style>
