<template>
  <div class="parentConent" id="virtual">

      <!-- content header -->
      <div>
        <el-tooltip class="item"
                    effect="dark"
                    content="添加拼接屏"
                    placement="bottom">
          <el-button @click="click_add">
            <i class="fa fa-plus"></i>
          </el-button>
        </el-tooltip>
        <!--
        <el-dropdown @command="click_add">
          <el-button>
            <i class="fa fa-plus"></i>&nbsp;添加拼接屏<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1"><i class="fa fa-plus"></i>&nbsp;标准拼接屏</el-dropdown-item>
            <el-dropdown-item command="2"><i class="fa fa-plus"></i>&nbsp;异型拼接屏</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        -->
        <!-- 添加拼接屏对话框 -->
        <el-dialog
          width="500px"
          :title="currentIndex !=='' ? '编辑拼接屏' : '添加拼接屏'"
          :visible.sync="virtualDialog"
          @close="click_cancelCreat">
          <!-- form表单 -->
          <el-form
            :model="virtualForm"
            ref="virtualForm"
            :label-width="labelWidth"
            :rules="virtualRules">
          <el-row>
            <el-col :span="22">
              <el-form-item label="拼接屏名称" prop="name">
                  <el-input v-focus autofocus v-model="virtualForm.name" maxlength="12" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="拼接方向">
                  <el-radio v-model="virtualForm.direction"
                            :label="0"
                            :disabled="currentIndex !== ''">横屏</el-radio>
                  <el-radio v-model="virtualForm.direction"
                            :label="1"
                            :disabled="currentIndex !== ''">竖屏</el-radio>
                </el-form-item>

                <el-form-item label="拼接屏规格">
                  行<el-input-number
                      v-model="virtualForm.row"
                      controls-position="right"
                      :min="1"
                      :max="10"
                      class="m-r-20 m-b-10 m-l-10"
                      :disabled="currentIndex !== ''"></el-input-number><br/>
                  列<el-input-number
                      v-model="virtualForm.col"
                      controls-position="right"
                      :min="1"
                      :max="10"
                      class="m-l-10"
                      :disabled="currentIndex !== ''"></el-input-number>
                </el-form-item>

               <el-form-item label="选择终端">
                  <el-button @click="click_choiceButton">选择终端</el-button>
                </el-form-item>

              </el-col>
            </el-row>
          </el-form>
          <!-- form结束 -->

          <div>已选择终端：{{selectedTerminalsName}}</div>

          <!-- 内对话框 -->
          <el-dialog width="700px" title="选择组成此拼接屏的终端"
                     :visible.sync="innerVisible"
                     append-to-body class="dialogTransfer">

            <el-alert title="如果未选中的终端的编号与选中的终端编号相同，则 未选中的终端 将为禁止选中状态！"
                      type="warning"
                      show-icon
                      center>
            </el-alert>

            <!-- 穿梭框 -->
            <el-transfer
              v-model="virtualForm.numbers"
              :data="filteredTerminals"
              :props='props'
              @change="transferChange"
              @left-check-change='leftChange'
              class="m-t-10 m-r-68">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
              <el-button @click="click_cancelChoice">取 消</el-button>
              <el-button type="primary" @click="click_choiceTerminal">确定</el-button>
            </div>
          </el-dialog>

            <!-- 外对话框 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="click_cancelCreat">取 消</el-button>
            <el-button type="primary" @click="click_creat('virtualForm')">确定</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- 拼接屏table列表 -->
      <el-table :data="screens"
                @expand-change="tableChange"
                :row-class-name="rowClassName"
                style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="virtualShow"
               :class="{verticalSceen: String(scope.row.direction) === '1'}">
            <!-- 拼接屏预览 -->
            <div :style="{width: (Number(scope.row.col) === 1 && String(scope.row.direction) === '0' ? 292 : 585) + 'px'}">
              <!-- 横拼 -->
              <div v-if="String(scope.row.direction) === '0'"
                   class="screenRow"
                   v-for="(vnum, vindex) in scope.row.row"
                   :key="vnum"

                   >
                <!--  class="active" 选中的样式已写 -->
                <div @click="click_screen(scope, scope.row.col, vindex, tnum)"
                     v-for="tnum in scope.row.col"
                     :class="{active: activeIndex === scope.$index && activeTnum === (Number(scope.row.col) * vindex + tnum)}"
                     :key="tnum"
:style="{height: 218 * 0.56 + 'px', width: '218px', color: getNormalnum(scope).includes(Number(scope.row.col) * vindex + tnum) ? '#606266' : '#F56C6C'}">
                  {{ Number(scope.row.col) * vindex + tnum }}
                </div>
              </div>
              <!-- 竖拼 -->
              <div v-if="String(scope.row.direction) === '1'"
                   class="screenRow"
                   v-for="(vnum, vindex) in scope.row.row"
                   :key="vnum">
                <!--   选中的样式已写 -->
                <div @click="click_screen(scope, scope.row.col, vindex, tnum)"
                     v-for="tnum in scope.row.col"
                     :key="tnum"
                     :class="{active: activeIndex === scope.$index && activeTnum === (Number(scope.row.col) * vindex + tnum)}"
                     :style="{width: 218 * 0.56 + 'px', height: 218 + 'px', color: getNormalnum(scope).includes(Number(scope.row.col) * vindex + tnum) ? '#606266' : '#F56C6C'}">
                  {{ Number(scope.row.col) * vindex + tnum }}
                </div>
              </div>
            </div>
            <!-- 终端简介列表 -->
            <div>
              <div v-if="!activeTerminal"
                   class="sticky">点击终端查看信息</div>
              <div v-else-if="JSON.stringify(activeTerminal) === '{}'"
                   class="sticky">
                暂无绑定终端
              </div>
              <div v-else class="terminalInfo">
                <el-form label-width="80px">
                  <el-form-item :label="attr.label" v-for="(attr, index) in attrs"
                                :key="index">
                    <span v-if="attr.attr !== 'play_status' &&
                                attr.attr !== 'disk_size' &&
                                attr.attr !== 'download_status' &&
                                attr.attr !== 'online_status'">
                      {{ activeTerminal[attr.attr] }}
                    </span>
                    <!-- 播放状态 -->
                    <div v-if="attr.attr === 'play_status'">
                      <el-tooltip content="未播放" placement="bottom">
                        <i v-if="activeTerminal.play_status === 0" class="fa fa-stop"></i>
                      </el-tooltip>
                      <el-tooltip content="正在播放" placement="bottom">
                        <i v-if="activeTerminal.play_status === 1" class="fa fa-play"></i>
                      </el-tooltip>
                    </div>
                    <!-- 下载状态 -->
                    <div v-if="attr.attr === 'download_status'">
                      <el-tooltip content="无下载" placement="bottom">
                        <i v-if='String(activeTerminal.download_status) === "0"' class="fa fa-minus"></i>
                      </el-tooltip>
                      <el-tooltip content="下载完成" placement="bottom">
                        <i v-if='String(activeTerminal.download_status) === "2"' class="fa fa-check"></i>
                      </el-tooltip>
                      <el-tooltip content="正在下载" placement="bottom">
                        <i v-if='String(activeTerminal.download_status) === "1"' class="fa fa-download"></i>
                      </el-tooltip>
                    </div>
                    <!-- 磁盘空间 -->
                    <el-progress v-if="attr.attr === 'disk_size'" :text-inside="true" :stroke-width="18"
                                :percentage="Number(activeTerminal.disk_size)"
                                :status="Number(activeTerminal.disk_size) > 80 ? 'exception' : ''">
                    </el-progress>
                    <!-- 在线状态 -->
                    <div v-if="attr.attr === 'online_status'">
                      <el-tooltip content="离线" placement="bottom">
                        <i v-if='String(activeTerminal.online_status) === "0"' class="notonline fa fa-circle"></i>
                      </el-tooltip>
                      <el-tooltip content="在线" placement="bottom">
                        <i v-if='String(activeTerminal.online_status) === "1"' class="online fa fa-circle"></i>
                      </el-tooltip>
                      <el-tooltip content="待机" placement="bottom">
                        <i v-if='String(activeTerminal.online_status) === "2"' class="fa fa-minus"></i>
                      </el-tooltip>
                    </div>

                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="名称"
                      prop="name">
      </el-table-column>
      <el-table-column label="规格">
        <template slot-scope="scope">
          {{ scope.row.row }} * {{ scope.row.col }}
        </template>
      </el-table-column>
      <el-table-column label="方向">
        <template slot-scope="scope">
          <span v-if="String(scope.row.direction) === '0'" class="horizontal">横屏</span>
          <span v-else class="vertical">竖屏</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="user.name"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.created_at" placement="bottom">
            <span>{{ scope.row.created_at | fromnow }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
        <el-table-column label="操作" width="80" align='center'>
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="bottom">
              <el-button type="text" size="mini" @click="click_redact(scope.row, scope.$index)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click.stop="click_delete(scope.row, scope.$index)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TerminalGroup from '../../terminal/static/js/TerminalGroup.js'
import headerbar from '@/components/HeaderBar'
import Virtual from '../static/virtual'
import { copy } from '../../../../static/js/utils/utils'
import irregular from './irregular/index'

export default {
  components: {
    headerbar,
    irregular
  },

  mounted () {
    let objAuth = this.$cookies.get('authUser')
    let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    this.groupId = authUser.group_id
    this.reload()
  },
  data () {
    return {
      labelWidth: '120px',
      terminalsFlag: false,
      groupId: 0,
      screens: [],
      virtualDialog: false,
      innerVisible: false,
      terminals: [],
      props: {
        key: 'number',
        label: 'number'
      },
      virtualForm: {
        name: '',
        row: 1,
        col: 1,
        direction: 0,
        numbers: []
      },
      virtualRules: {
        name: [{ required: true, message: '请输入拼接屏名称', trigger: 'change' }]
      },
      currentIndex: '',
      oldCopy: null,
      activeTnum: 0,
      activeIndex: 0,
      activeTerminal: null,
      attrs: [
        {attr: 'name', label: '终端名称'},
        {attr: 'number', label: '终端编号'},
        {attr: 'ip', label: 'IP地址'},
        {attr: 'online_status', label: '在线状态'},
        {attr: 'play_status', label: '播放状态'},
        {attr: 'download_status', label: '下载状态'},
        {attr: 'disk_size', label: '磁盘空间'},
        {attr: 'created_at', label: '创建时间'}
      ],
      choicedSences: [],
      rightTerminal: [],
      choiced: [],
      editTerminals: [],
      selectedTerminalsName: ''
    }
  },

  computed: {
    filteredTerminals () {
      let terminals = this.terminals
      terminals = terminals.filter(terminal => {
        let direction = 0
        if (terminal.direction == 1 || terminal.direction == 3) {
          direction = 1
        }
        return direction === this.virtualForm.direction && terminal.normalnum <= this.terminalNum
      })
      terminals.map(terminal => {
        if(terminal.number.indexOf(':') === -1) {
          terminal.number += ':' + terminal.normalnum
        }
      })
      terminals.sort((x, y) => {
        return x.normalnum - y.normalnum
      })
      return terminals
    },
    // 拼接屏终端数量
    terminalNum () {
      return this.virtualForm.row * this.virtualForm.col
    }
  },

  methods: {
    reload () {
      Virtual.getScreens(this.groupId)
        .then(res => {
          this.screens = res.data.message
        })
    },
    // 选择后将相同normalnum禁用
    transferChange (value, direction, movedKeys) {
      if (direction === 'left') {
        this.filteredTerminals.filter((terminal) => {
          movedKeys.forEach(ele => {
            let tmp = ele.split(':')
            if (ele !== terminal.number && terminal.normalnum === Number(tmp[tmp.length - 1])) { // 取消选中
              terminal.disabled = false
            }
          })
        })
      }
      this.selectedTerminalsName = ''
      for (let i = 0; i < value.length; i++) {
        this.selectedTerminalsName += value[i] + ' / '
      }
    },

    // 终端互斥，同一个normalnum只能选一个
    leftChange (selected, changed) {
      let set = new Set(selected)
      let item = changed[0] // 3501:1
      let check = set.has(item) // true: check, false: uncheck
      let tmp = item.split(':')
      let index = Number(tmp[tmp.length - 1])

      this.filteredTerminals.filter((terminal) => {
        if (check && item !== terminal.number && terminal.normalnum === index) { // 选中
          terminal.disabled = true
        }
        if (!check && item !== terminal.number && terminal.normalnum === index) { // 取消选中
          terminal.disabled = false
        }
      })
    },
    // 获取可用终端
    _getTerminals () {
      if (this.terminalsFlag) {
        return
      }
      this.terminalsFlag = true
      Virtual.getUngroupedTerminals()
        .then(res => {
          // 下面之所以要concat是因为穿梭框想要在编辑时显示已经存在的终端，则必须存在一个大的数组里面，
          // 这个数组必须包含穿梭框左右两边的数据
          if (this.editTerminals) {
            let arr = JSON.parse(JSON.stringify(this.editTerminals))
            for (let i = 0; i < res.data.length; i++) {
              let h = true
              for (let j = 0; j < this.editTerminals.length; j++) {
                if (this.editTerminals[j].id === res.data[i].id) {
                  h = false
                  break
                }
              }
              if (h) {
                arr.push(res.data[i])
              }
            }
            this.terminals = arr
          } else {
            this.terminals = res.data
          }
          // 筛选出左边与右边normalnum相冲突的terminals，并将其置为disabled
          this.editTerminals.filter(ele => {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].normalnum === ele.normalnum) {
                res.data[i].disabled = true
              }
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择终端的按钮
    click_choiceButton () {
      this._getTerminals()
      this.innerVisible = true
    },
    // 选择终端
    click_choiceTerminal () {
        this.innerVisible = false
    },

    click_cancelChoice () {
      this.innerVisible = false
    },
    // 创建拼接屏
    click_creat (formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let vir
          this.virtualForm.numbers = this.virtualForm.numbers.map((ele) => {
            let tmp = ele.split(':')
            tmp.pop()
            tmp = tmp.join(':')
            return tmp
          })
          this.virtualForm.group_id = this.groupId
          if (String(this.currentIndex)) {
            vir = Virtual.editScreen(this.oldCopy, this.virtualForm)
          } else {
            vir = Virtual.creatScreen(this.virtualForm)
          }

          vir.then(res => {
            if (!res || !res.data.success) {
              return
            }
            this.$notify.success({
              title: `操作成功！`
            })
            if (String(this.currentIndex)) {
              copy(this.screens[this.currentIndex], res.data.message)
            } else {
              this.screens.push(res.data.message)
            }
            this.reload()
            this.click_cancelCreat()
            this.currentIndex = ''
          })
            .catch(err => {
              // this.currentIndex = ''
              this.virtualForm.numbers = []
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    click_cancelCreat () {
      this._hideDialog('virtualDialog')
      this._resetFormData()
    },

    _resetFormData () {
      this.virtualForm = {
        name: '',
        row: 1,
        col: 1,
        direction: 0,
        numbers: []
      }
      this.$refs['virtualForm'].clearValidate()
    },

    click_redact (item, index) {
      this.terminalsFlag = false
      this._showDialog('virtualDialog')
      this.oldCopy = copy({}, item)
      this.editTerminals = this.oldCopy.terminals
      this.virtualForm.col = this.oldCopy.col
      this.virtualForm.row = this.oldCopy.row
      this.virtualForm.name = this.oldCopy.name
      this.virtualForm.direction = this.oldCopy.direction

      this.virtualForm.numbers = []
      this.selectedTerminalsName = ''
      this.oldCopy.terminals.forEach(terminal => {
        this.virtualForm.numbers.push(terminal.number + ':' + terminal.normalnum)
        this.selectedTerminalsName += terminal.number + ' / '
      })
      this.currentIndex = index
    },

    click_delete (item, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Virtual.delScreen(item.id)
          .then(res => {
            this.screens.splice(index, 1)
            this.$notify.success({
              title: '操作成功！'
            })
          })
      })
        .catch(err => {
          console.log(err)
        })
    },

    click_add (v) {
      //if (v == 1) {
        this.editTerminals = []
        this.terminalsFlag = false
        this._showDialog('virtualDialog')
        this.currentIndex = ''
        this.selectedTerminalsName = ''
      //} else if (v == 2) {
      //  this.$router.push({path: '/mpdp/irregular/index'})
      //}
    },

   rowClassName ({row, rowIndex}) {
     if (row.terminals.length !== row.row * row.col) {
       return 'warning-row'
     }
   },

    getNormalnum (scope) {
      let arr = []
      scope.row.terminals.forEach(terminal => {
        arr.push(terminal.normalnum)
      })
      return arr
    },

    click_screen (item, col, vindex, tnum) {
      this.activeTnum = Number(col) * vindex + tnum
      this.activeIndex = item.$index
      this.activeTerminal = item.row.terminals.filter(terminal => {
        return terminal.normalnum === this.activeTnum
      })[0]
      if (!this.activeTerminal) {
        this.activeTerminal = {}
        return false
      }
      // let disk = this.activeTerminal.disk_size.split('/')
      // if (disk[1] !== '0') {
      //   this.activeTerminal.diskPercentage = Number(disk[0]) / Number(disk[1])
      // } else {
      //   this.activeTerminal.diskPercentage = 0
      // }
    },

    tableChange () {
      this.activeTnum = 0
      this.activeIndex = 0
      this.activeTerminal = null
    }
  }
}
</script>

<style lang="scss">
.sticky {
  position: sticky;
  top: 10px;
  font-size: 14px;
}

.dialogTransfer {
  .el-transfer {
    margin-right: 68px;
    position: relative;
    left: calc(50% - 248px);
  }
}
#virtual {
  // .iami {
  //   display: inline-block;
  //   margin-right: 5px;
  // }
  .m-r-68 {
    margin-right: 68px;
  }
  .terminalBrief {
    margin-top: 5px;
    margin-bottom: 5px;
    div {
      float: left;
      width: 25%;
    }
  }
  .virtualShow {
    // width: 825px;
    // margin-left: calc(50% - 412px);
    overflow-y: auto;
    display: table;
    &.verticalSceen {
      width: 525px;
      // margin-left: calc(50% - 262px);
      > div {
        &:nth-child(1) {
          width: 285px;
        }
      }
    }
    > div {
      // float: left;
      display: table-cell;
      vertical-align: top;
      &:nth-child(1) {
        // width: calc(100% - 240px);
        width: 585px;
        .screenRow {
          // display: table;
          // table-layout: fixed;
          width: 100%;
          > div {
            cursor: pointer;
            &.active {
              background-color: #909399;
              color: white;
            }
            font-size: 20px;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            border: 1px solid #DCDFE6;
          }
        }
      }
      &:nth-child(2) {
        width: 240px;
        padding-left: 30px;
        // border-left: 1px solid #DCDFE6;
        .terminalInfo {
          position: sticky;
          top: 0;
          .el-form-item {
            margin-bottom: 0;
            .el-form-item__label {
              line-height: 30px;
            }
            .el-form-item__content {
              line-height: 30px;
              .el-progress {
                line-height: 30px;
              }
            }
          }
        }
      }
    }
  }
  .el-table {
    height: calc(100% - 40px);
    .el-table__body-wrapper {
      height: calc(100% - 50px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .warning-row {
      background-color: oldlace;
    }
  }
  .el-input-number {
    width: 100px;
    .el-input {
      width: 100px;
    }
  }
  .fa-check,
  .fa-download {
    color: #409EFF;
  }
}

  .fa-play,
  .online {
    color: #67C23A;
  }
  .notonline {
    color: #FA5555;
  }
  .el-transfer-panel .el-transfer-panel__header .el-checkbox__input {
    display: none;
  }
</style>
