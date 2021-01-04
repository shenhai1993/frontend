<template>
  <div class="H100 groupTerminal">
    <div class="m-b-15">
      状态：
      <el-select @change="isAdvanceSearch = false" v-model="searchStatus" placeholder="状态" class="statusSelect w100">
        <el-option v-for="item in statusList"
                   :key="item.label"
                   :label="item.label"
                   :value="item.label">
        </el-option>
      </el-select>
      <span v-if="showGroupSelect">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分组：</span>
      <el-select v-if="showGroupSelect" @change="groupSearch" v-model="groupStatus" placeholder="分组" class="statusSelect">
        <el-option v-for="item in groupSelectData"
                   :key="item.label"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <span v-if="showTypeSelect">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型：</span>
      <el-select v-if="showTypeSelect" @change="typeSearch" v-model="typeStatus" placeholder="类型" class="statusSelect w100">
        <el-option v-for="item in typeSelectData"
                   :key="item.label"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>

      <el-tooltip v-if="!showGroupSelect" effect="dark" content="激活新终端" placement="bottom">
        <el-button class="m-l-10" @click="_showDialog('activetionTerminalvisible')">
          <i class="fa fa-plus"></i>
        </el-button>
      </el-tooltip>

      <el-button v-if="!showGroupSelect" @click="showIMWindow = true" :disabled="disabledIMBtn" type="primary">
        <i class="el-icon-chat-dot-square">IM消息</i>
      </el-button>

      <!-- 激活新终端 -->
      <el-dialog class="activetion" title="激活新终端" :visible.sync="activetionTerminalvisible"
                 width='500px' @close='click_cancel'>
        <el-form :model="formData" :rules="rules" ref="formData" inline-message>
          <el-form-item label="确认码"  prop="code">
            <el-input autofocus v-focus v-model="formData.code" placeholder="请输入6位数字确认码"
                      auto-complete="off"
                      :minlength="6" :maxlength="6"></el-input>
          </el-form-item>
          <el-alert title="确认码在终端联网注册后显示在终端屏幕上"
                    type="warning"
                    :closable="false"
                    show-icon
                    class="text-center">
          </el-alert>
        </el-form>
        <div class="trees-wrapper">
          <group-tree ref="activeGroupTree"></group-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activetionTerminalvisible = false">取 消</el-button>
          <el-button type="primary" @click="click_activetion('formData')">激 活</el-button>
        </div>
      </el-dialog>

      <refresh-button v-on:refresh="refresh"></refresh-button>
      <!-- <el-tooltip content="包含子分支" effect="dark">
        <el-button :class="{'button-active': containSub}" @click="handleContainSub">
          <i class="fa fa-sort-amount-desc"></i>
        </el-button>
      </el-tooltip> -->
      <el-autocomplete
        clearable
        v-model="searchText"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="handleSelect"
        @keypress.native="isAdvanceSearch = false"
        style="width: 200px;height: 36px"
        placeholder="输入终端名称">
        <template slot-scope="{ item }">
          <div class="name">{{ item.name }}</div>
        </template>
      </el-autocomplete>
      <el-tooltip content="高级查询">
        <el-button @click="handleShowAdvanceSearch">
          <i class="fa fa-search-plus"></i>
        </el-button>
      </el-tooltip>
      <!-- 高级查询 -->
      <el-dialog width="500px" :visible.sync="showAdvanceSearch" title="高级查询">
        <el-form :model="searchForm" label-width="80px">
          <el-form-item label="终端名称">
            <el-input v-focus autofocus v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="终端编号">
            <el-input v-model="searchForm.number"></el-input>
          </el-form-item>
          <el-form-item label="终端型号">
            <el-input v-model="searchForm.type"></el-input>
          </el-form-item>
          <el-form-item label="安装地址">
            <el-input v-model="searchForm.description"></el-input>
          </el-form-item>
          <el-form-item label="管理员">
            <el-input v-model="searchForm.linkman"></el-input>
          </el-form-item>
          <!--
                    <el-form-item label="投放城市">
                      <el-select v-model="searchForm.city_id" placeholder="请选择城市">
                        <el-option v-for="(item, index) in cities" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="投放类型">
                      <el-select v-model="searchForm.place_type" placeholder="请选择投放类型">
                        <el-option label="医院" value="1"></el-option>
                        <el-option label="小区" value="2"></el-option>
                        <el-option label="学校" value="3"></el-option>
                        <el-option label="公交站" value="4"></el-option>
                      </el-select>
                    </el-form-item>
           -->
          <el-form-item label="播放状态">
            <el-radio-group v-model="searchForm.play_status">
              <el-radio :label="-1">全部</el-radio>
              <el-radio :label="0">未播放</el-radio>
              <el-radio :label="1">播放中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="屏幕方向">
            <el-radio-group v-model="searchForm.direction">
              <el-radio :label="-1">全部</el-radio>
              <el-radio :label="0">横屏</el-radio>
              <el-radio :label="2">横屏（反）</el-radio><br/>
              <el-radio :label="1">竖屏</el-radio>
              <el-radio :label="3">竖屏（反）</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelSearch">取消</el-button>
          <el-button @click="search">搜索</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 标签列表 -->
    <tags v-if="!(params && params.type === 'mpdp')" :tags='suggestTags' :resetFlag="tagResetFlag"
          v-on:selectedTags="selectedTags"></tags>
    <!-- 终端列表 -->
    <el-table class="terminals" v-loading="loading" ref="multipleTable"
              :row-key="searchLists.id"
              :data="searchLists"
              tooltip-effect="dark"
              height="calc(100% - 140px)"
              stripe
              @selection-change="handleSelectionChange"
              empty-text="暂无终端">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="online_status" label="在线" width="80" align='center'>
        <template slot-scope="scope">
          <!-- 1: 0: 离线, 在线, 2: 待机 -->
          <el-tooltip content="在线" placement="bottom">
            <i v-if="scope.row.online_status === 1" class="online fa fa-circle"></i>
          </el-tooltip>
          <el-tooltip content="离线" placement="bottom">
            <i v-if="scope.row.online_status === 0" class="offline fa fa-circle"></i>
          </el-tooltip>
          <el-tooltip content="待机" placement="bottom">
            <i v-if="scope.row.online_status === 2" class="fa fa-minus"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="终端名称">
      </el-table-column>
      <el-table-column prop="number" label="终端编号" show-overflow-tooltip>
        <!--  width="160"  width="160"-->
      </el-table-column>
      <!-- <el-table-column prop="mac" label="MAC地址">
        <template slot-scope="scope">
          {{ scope.row.mac | macstyle }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="type" label="终端型号"></el-table-column>
      <el-table-column align="center" v-if="params && params.type === 'mpdp'" prop="normalnum" label="终端序号"></el-table-column>
      <el-table-column prop="download_status" label="下载状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tooltip content="无下载" placement="bottom">
            <i v-if='scope.row.download_status === 0' class="fa fa-minus"></i>
          </el-tooltip>
          <el-tooltip content="下载完成" placement="bottom">
            <i v-if='scope.row.download_status === 2' class="fa fa-check"></i>
          </el-tooltip>
          <el-tooltip content="正在下载" placement="bottom">
            <i v-if='scope.row.download_status === 1' class="fa fa-download"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="play_status" label="播放状态" width="100" align='center' v-if="false">
        <template slot-scope="scope">
          <el-tooltip content="未播放" placement="bottom">
            <i v-if="scope.row.play_status === 0" class="fa fa-stop"></i>
          </el-tooltip>
          <el-tooltip content="正在播放" placement="bottom">
            <i v-if="scope.row.play_status === 1" class="fa fa-play"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--<el-table-column prop="sale_status" label="售货状态" width="100" align='center'>
        <template slot-scope="scope">
          <span v-if="String(scope.row.onsale) === '1'" class="green">在售</span>
          <span v-else-if="String(scope.row.onsale) === '0'" class="red">停售</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="direction" label="屏幕方向" width="100"
                       align='center'>
        <template slot-scope="scope">
          <span v-if="String(scope.row.direction) === '0'" class="blue">横屏</span>
          <span v-else-if="String(scope.row.direction) === '2'" class="green">横屏（反）</span>
          <span v-else-if="String(scope.row.direction) === '1'" class="red">竖屏</span>
          <span v-else-if="String(scope.row.direction) === '3'" class="yellow">竖屏（反）</span>
        </template>
      </el-table-column>
      <el-table-column prop="tree.name" label="所属分组"></el-table-column>
      <el-table-column prop="disk_size" label="磁盘空间" width="100">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="18"
                       :percentage="Number(scope.row.disk_size)"
                       :color="Number(scope.row.disk_size) > 80 ? '#ff4949' : '#20a0ff'">
          </el-progress>
        </template>
      </el-table-column>
      <!--
            <el-table-column prop="city.name" label="投放城市"></el-table-column>
            <el-table-column prop="place_type" label="投放类型" width="100"
                             align='center'>
              <template slot-scope="scope">
                <span v-if="String(scope.row.place_type) === '1'">医院</span>
                <span v-else-if="String(scope.row.place_type) === '2'">小区</span>
                <span v-else-if="String(scope.row.place_type) === '3'">学校</span>
                <span v-else-if="String(scope.row.place_type) === '4'">公交站</span>
              </template>
            </el-table-column>
       -->
      <el-table-column prop="linkman" label="管理员"></el-table-column>
      <!--<el-table-column prop="env_desc" label="温湿度"></el-table-column>-->
      <el-table-column prop="lastOnline" label="最近在线时间"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align='center'>
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="bottom">
            <i class="fa fa-pencil greenHover" @click="terminal_edit(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip v-if="!showGroupSelect" effect="dark" content="更改分组" placement="bottom">
            <i class="fa fa-bars greenHover" @click="terminal_changeGroup(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="属性" placement="bottom">
            <i class="fa fa-cog greenHover" @click="terminal_set_props(scope.row, scope.$index)"></i>
          </el-tooltip>
          <!--<el-tooltip effect="dark" content="商品上架" placement="bottom">
            <i class="fa fa-upload greenHover" @click="terminal_setWays(scope.row.id,scope.row.set_ways,scope.row.way_tpl)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改货道" placement="bottom">
            <i @click="terminal_setLadder(scope.row.id,scope.row.way_tpl)"><svg-icon class="ladderIcon" icon-class="ladder"></svg-icon></i>
          </el-tooltip>-->
          <el-tooltip effect="dark" content="重启终端" placement="bottom">
            <i class="fa fa-power-off blueHover" @click="terminal_restart(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="清空磁盘" placement="bottom">
            <i class="fa fa-battery-empty blueHover" @click="terminal_clean(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="远程控制" placement="bottom">
            <i class="fa fa-window-restore blueHover" @click="terminal_diagnose(scope.row, scope.$index)"></i>
          </el-tooltip>
          <!-- <el-tooltip effect="dark" content="开售" placement="bottom" v-if="scope.row.onsale === 0">
            <i class="fa fa-play blueHover" @click="terminal_setSale(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="停售" placement="bottom" v-if="scope.row.onsale === 1">
            <i class="fa fa-stop blueHover" @click="terminal_setSale(scope.row, scope.$index)"></i>
          </el-tooltip> -->
          <el-tooltip effect="dark" content="删除" placement="bottom">
            <i class="fa fa-trash redHover" @click.stop="terminal_delete(scope.row, scope.$index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看更多" placement="bottom">
            <i class="fa fa-ellipsis-v greenHover" @click="terminal_more(scope.row, scope.$index)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="searchLists.length > 0" style="position: absolute;bottom: 0px;left: 50%;transform: translateX(-50%)">
      <el-pagination background
                     @size-change="getSearchPageList"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-size="pageSize"
                     :page-sizes="[20, 50, 100, 200]"
                     layout="total, prev, pager, next, sizes"
                     prev-text="上一页"
                     next-text="下一页"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 编辑终端的对话框模块 -->
    <editor :ismpdp="(params && params.type === 'mpdp')"
            :isterminalEditVisible.sync='isterminalEditVisible'
            :radioStu.sync="radioStu"
            :terminalData.sync='currentTerminalData'
            :allTags="allTags"
            :cities="cities"
            @refresh='refresh'></editor>
    <!-- 修改货道 -->
    <ladder :isterminalLadderVisible.sync ="isterminalLadderVisible" :t_id="t_id" @refresh='refresh' ref="formLadder"></ladder>
    <!-- 商品上架-->
    <way :isWayVisible.sync ="isWayVisible" :t_id="t_id" @refresh='refresh' ref="formWay"></way>
    <!-- 修改分组 -->
    <el-dialog v-if="isterminalGroupVisible" title="更改终端所属"  width="500" @close="cancelGroup"
               :visible='isterminalGroupVisible'
    >
      <div  v-if="!isManage" class="tree-wrapper">
        <group filter gtype="trees" :groupId="selectedGroupId" @updateTreeNode="updateTreeNode" @onclick="selectedTree"></group>
      </div>

      <group-tree v-else @updateTreeId="updateChangeTreeId" ref="changeGroupTree"></group-tree>
      <div class="footer" slot="footer">
        <dialog-button @clickCancel="cancelGroup" @clickConfirm="confirmGroup"></dialog-button>
      </div>
    </el-dialog>
    <!-- 终端属性设置的对话框模块 -->
    <terminal-porps :isterminalPropsVisible.sync='isterminalPropsVisible' @refresh='refresh' :dataForm='currentTerminalData' :id='currentTerminalId' type="terminal"></terminal-porps>
    <!-- 查看更多details -->
    <transition name="el-fade-in">
      <div class="terminalInfoMask" v-if="showDetails" @click="details_close">
        <terminal-details id='terminalInfo'
                          v-on:showDetails="onShowDetails"
                          @click.native.stop
                          :activeterminal='activeterminal'
                          :clearIntervalFromParent.sync='clearIntervalFromParent'>
        </terminal-details>
      </div>
    </transition>

    <el-dialog class="dialog" @close="previewClose" title="预览" width="800px" :visible.sync="previewShow">
      <preview ref="preview" :playlist="playlist"></preview>
    </el-dialog>

    <el-dialog width="500px" title="发送IM消息" :visible="showIMWindow" @close="click_cancel_IM">
      <el-form :model="formDataIM" :rules="rulesIM" ref="formDataIM" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发送内容：" prop="content">
          <el-input v-model="formDataIM.content" type="textarea" maxlength="100" placeholder="最多输入100个字符" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <dialog-button @clickCancel="click_cancel_IM" @clickConfirm="submitIMForm('formDataIM')"></dialog-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import tags from '../../components/tags.vue'
  import api from '../../static/js/api'
  import groupApi from '@/modules/group/static/api'
  import editor from './editor.vue'
  import ladder from './ladder.vue'
  import way from './way.vue'
  import terminalPorps from './props.vue'
  import { tip } from '@/assets/js/encapsulate.js'
  import TerminalDetails from './details'
  import RefreshButton from '@/components/RefreshButton'
  import Group from '@/modules/group/components/group'
  import GroupTree from '@/modules/group/lib/grouptree'
  import DialogButton from '@/components/DialogButton'
  import Terminal from '@/modules/terminal/static/js/TerminalGroup'
  import preview from '@/modules/playlistMutipleTPL/lib/preview'
  import http from '@static/js/utils/http'
  import { Loading } from 'element-ui';

  import { mapState } from 'vuex'

  export default {
    props: ['params'],
    components: {
      tags, editor,ladder, way, terminalPorps, TerminalDetails, RefreshButton, Group, GroupTree, DialogButton, preview
    },
    created() {
      if (/ungrouped/.test(window.location.href)) {
        this.showGroupSelect = true
        this.typeStatus = 'mpdp'
      }
      if (/manage/.test(window.location.href)) {
        this.showTypeSelect = true
      }
      this.getCitys()
    },
    mounted () {
      this.getTerminals(this.request)
      // if (this.groupId) setTimeout(() =>this.getTerminals(request), 500)
    },

    data () {
      var activation = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认码'))
        } else if (String(value).length !== 6) {
          callback(new Error('确认码必须为六位'))
        } else if (isNaN(value)) {
          callback(new Error('确认码必须为数字'))
        } else {
          callback()
        }
      }

      return {
        // treeId: 0,
        page: 1,
        pageSize: 20,
        total: 0,
        selectedGroupId: 0,
        previewShow: false,
        // containSub: false,
        searchText: '',
        searchForm: {play_status: -1, direction: -1},
        isAdvanceSearch: false,
        playlist: {},
        loading: false,
        selectedTreeId: 0,
        // tags: [],
        // suggestTags: [],
        cities: [],
        tagResetFlag: 0,
        terminalLists: [],
        checkedTags: [],
        isterminalEditVisible: false,
        radioStu: false,
        isterminalGroupVisible: false,
        isterminalPropsVisible: false,
        isterminalLadderVisible: false, // 修改货道弹窗控制
        isWayVisible: false, // 商品上架设置
        t_id: 0, // 终端ID
        currentTerminalData: null,
        currentTerminalId: null,
        activeterminal: null,
        showDetails: false,
        showAdvanceSearch: false,
        clearIntervalFromParent: false,
        searchStatus: '全部',
        searchStatusNum: 2,
        statusList: [
          { label: '全部' },
          { label: '在线' },
          { label: '离线' }
        ],
        activetionTerminalvisible: false,
        formData: {code: ''},
        rules: {
          code: [
            { validator: activation, trigger: 'blur' }
          ]
        },
        showIMWindow: false,
        disabledIMBtn: true,
        formDataIM: {
          numbers: [],
          content: '',
        },
        rulesIM: {
          content: [
            { required: true, message: '请输入IM内容', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
          ]
        },
        showGroupSelect: false,
        groupStatus: 'all',
        groupSelectData: [
          { label: '全部', value: 'all' },
          { label: '未分配', value: 'ungroup' },
          { label: '已分配', value: 'grouped' }
        ],
        showTypeSelect: false,
        typeStatus: '',
        typeSelectData: [
          { label: '普通屏', value: '' },
          { label: '拼接屏', value: 'mpdp' }
        ]
      }
    },

    computed: {
      ...mapState({
        treeId: state => state.route.params.id,
        playlists: state => state.playlistMutipleTPL.playlists,
        tags: state => state.tag.tagsArr
      }),
      suggestTags:function () {
        let files = []
        files = this.tags.filter(item => {
          return item.suggest
        })
        return files
      },
      request () {
        let params = Object.assign({}, this.params)
        if (this.treeId) {
          params.tree_id = this.treeId
        }
        if (this.containSub) {
          params.sub = 1
        }
        params.gtype = this.groupStatus
        params.type = this.typeStatus
        params.per_page = this.pageSize
        params.page = this.page
        return params
      },

      searchLists () {
        let data = this.terminalLists
        if (!data) return

        if (this.isAdvanceSearch) {
          data = _handleAdvanceSearch(data, this)
          return data
        }
        if (this.searchStatusNum !== 2) {
          data = data.filter(item => {
            return item.online_status === this.searchStatusNum
          })
        }
        if (this.searchText !== '') {
          data = data.filter(item => {
            return item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
          })
        }

        if (this.checkedTags.length) {
          data = data.filter(ele => {
            return Boolean(ele.tagged.filter(el => {
              return this.checkedTags.some(tag => {
                return el.tag_name === tag
              })
            }).length)
          })
        }
        return data

        function _handleAdvanceSearch (data, that) {
          let query = that.searchForm
          if (query.play_status === -1) {
            delete query.play_status
          }
          if (query.direction === -1) {
            delete query.direction
          }
          let keys = Object.keys(query)
          let ret = data.filter(item => {
            return keys.every(key => {
              if(key == 'city_id' || key == 'place_type' || key == 'direction' || key == 'play_status') {
                return item[key] != null && item[key] == query[key]
              }
              return item[key] != null && item[key].toLowerCase().indexOf(query[key].toLowerCase()) !== -1
            })
          })
          return ret
        }
      },

      allTags () {
        let _tags = []
        this.tags.forEach(tag => {
          _tags.push(tag.name)
        })
        return _tags
      },

      isManage () {
        if (this.$route.path.indexOf('manage') > 0) {
          return true
        }
        return false
      },

      containSub () {
        return this.$store.state.terminals.containSub
      }
    },

    methods: {
      refresh () {
        this.getTerminals(this.request)
        this.resetQuery()
      },
      getCitys(){
        // api.getTags()
        //   .then(res => {
        //     this.tags = res.data.message
        //     this.suggestTags = this.tags.filter(item => {
        //       return item.suggest
        //     })
        //   })
        //   .catch(e => console.log(e))
        api.getCities()
          .then(res => {
            this.cities = res.data.message
          })
          .catch(e => console.log(e))
      },
      resetQuery () {
        this.searchForm = {play_status: -1, direction: -1}
        this.searchText = ''
        this.searchStatus = '全部'
        this.checkedTags = []
        this.isAdvanceSearch = false
        this.tagResetFlag++
      },

      handleShowAdvanceSearch () {
        this._showDialog('showAdvanceSearch')
        this.resetQuery()
      },

      querySearch(queryString, cb) {
        let results = queryString ? this.searchLists.filter(
          item => {
            return item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
          }
        ) : this.searchLists
        cb(results)
      },
      handleSelect(item) {
        this.searchText = item.name
      },

      cancelSearch () {
        this._hideDialog('showAdvanceSearch')
        this.searchForm = {play_status: -1, direction: -1}

      },

      search () {
        this.isAdvanceSearch = true
        this._hideDialog('showAdvanceSearch')
      },

      // handleContainSub () {
      //   this.containSub = !this.containSub
      // },

      click_cancel () {
        this.$refs.formData.resetFields()
        this._hideDialog('activetionTerminalvisible')
      },

      click_activetion (formName) {
        let treeId = this.treeId
        let id = this.$refs.activeGroupTree.selectedTreeId
        if (id !== 0) {
          treeId = id
        }
        this.formData.tree_id = treeId
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.addTerminal(this.formData)
              .then(res => {
                this.refresh()
                this.click_cancel()
                this.$notify.success({
                  title: '操作成功！'
                })
              }).catch(e => {
              console.log(e)
            })
          } else {
            console.log('error')
            return false
          }
        })
      },

      getTerminals (request) {
        if (this.showGroupSelect) {
          request = Object.assign({}, request, { sub: 1 })
        }
        this.loading = true
        api.getTerminals(request)
          .then(res => {
            this.terminalLists = res.data.message.data
            this.total = res.data.message.total
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
          .catch(e => console.log(e))
      },

      selectedTags (tags) {
        this.checkedTags = tags
      },

      terminal_edit (data, index) {
        this.getCitys()
        // this.currentTerminalData = data
        // this.isterminalEditVisible = true
        this.loadTerminal(data.id, () => { // 避免脏读
          this.isterminalEditVisible = true
          this.radioStu = true
        })
      },

      terminal_changeGroup (data, index) {
        this.activeterminal = data
        this.isterminalGroupVisible = true
      },

      cancelGroup () {
        this.isterminalGroupVisible = false
      },

      confirmGroup () {
        let data = {}
        data.tree_id = this.selectedTreeId
        data.name = this.activeterminal.name
        api.editTerminal(this.activeterminal.id, data).then(res => {
          this.$notify.success({
            title: '操作成功！'
          })
          this.refresh()
        })
        this.selectedGroupId = 0
        this.selectedTreeId = 0
        this.cancelGroup()
      },

      selectedGroup (data) {
        this.selectedGroupId = data.id
      },

      updateTreeNode (node) {
        this.selectedTreeId = node.id
      },

      updateChangeTreeId (id) {
        this.selectedTreeId = id
      },

      selectedTree (data) {
        this.selectedTreeId = data.id
      },

      terminal_set_props (data, index) {
        if (data.online_status !==0){
          this.loadTerminal(data.id, () => {
            this.isterminalPropsVisible = true
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '终端不在线'
          })
        }
        // 属性后台队列刷新, 存在延迟脏读, 这里重新Load一下单个终端
        // this.currentTerminalData = data
        // this.currentTerminalId = data.id
        // this.isterminalPropsVisible = true
      },

      loadTerminal(id, callback) {
        this.loading = true
        api.getTerminal(id)
          .then(res => {
            let t = res.data.message
            let i;
            for(i = 0; i < this.terminalLists.length; i++) {
              if (t.id === this.terminalLists[i].id) {
                this.terminalLists[i] = t;
                break;
              }
            }
            this.currentTerminalData = t
            this.currentTerminalId = t.id
            setTimeout(() => {
              this.loading = false
              callback()
            }, 200)
          })
          .catch(e => console.log(e))
      },

      terminal_restart (terminal) {
        if (terminal.online_status !==0){
          this.$confirm('是否重启该终端?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Terminal.restart(terminal.number).then(res => {
              this.$notify.success({
                title: '成功',
                message: '终端已重启'
              })
            }).catch(e => {
              this.$notify.error({
                title: '失败',
                message: '未能重启该终端'
              })
            })
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '终端不在线'
          })
        }
      },

      // 清空磁盘
      terminal_clean (terminal) {
        if (terminal.online_status !==0){
          this.$confirm('是否清空该终端磁盘空间?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Terminal.clean(terminal.number).then(res => {
              this.$notify.success({
                title: '成功',
                message: '终端磁盘已清空'
              })
            }).catch(e => {
              this.$notify.error({
                title: '失败',
                message: '未能清空该终端磁盘'
              })
            })
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '终端不在线'
          })
        }
      },

      // 远程控制
      terminal_diagnose (terminal) {
        let loading = Loading.service({text: '调试码获取中, 请稍后...'})
        Terminal.diagnose(terminal.number).then(res => {
          loading.close()
          this.$notify.success({
            title: '成功',
            message: '获取成功'
          })
          // 弹窗显示调试码
          this.$alert(res.data.message, '远程调试码', {
            confirmButtonText: '确定',
            callback: action => {}
          });
        }).catch(e => {
          loading.close()
          this.$notify.error({
            title: '失败',
            message: '获取失败'
          })
        })
      },

      terminal_setSale (terminal) {
        let tip = terminal.onsale === 1 ? '停售' : '开售'
        let setsale = terminal.onsale ? '0' : '1'
        this.$confirm(`是否${tip}该终端`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Terminal.onsale(terminal.number, setsale).then(res => {
            this.$notify.success({
              title: '成功',
              message: `终端已${tip}`
            })
            this.refresh()
          }).catch(e => {
            this.$notify.error({
              title: '失败',
              message: `未能${tip}该终端`
            })
          })
        })
      },

      terminal_delete (data, index) {
        this.$confirm('是否删除此终端？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Terminal.remove(data.id).then(res => {
            this.$notify.success({
              title: '成功',
              message: '终端已删除'
            })
            this.searchLists.splice(index, 1)
          }).catch(e => {
            this.$notify.error({
              title: '失败',
              message: '终端未删除'
            })
          })
        })
      },

      terminal_more (data, index) {
        this.activeterminal = data
        this.showDetails = true
        this.clearIntervalFromParent = false
      },
      /**
       * **修改货道
       * **/
      terminal_setLadder(id, way_tpl) {
        this.t_id = id
        this.$refs.formLadder.setFormDataTpl(way_tpl)
        this.isterminalLadderVisible = true
      },

      // 商品上架
      terminal_setWays(id, set_ways, way_tpl) {
        this.t_id = id
        if(set_ways) {
          this.$refs.formWay.setWays(set_ways)
        }
        else {
          this.$refs.formWay.parseWayTpl(way_tpl)
        }
        this.isWayVisible = true
      },

      onShowDetails (showDetails) {
        this.showDetails = showDetails
      },

      details_close () {
        this.clearIntervalFromParent = true
      },

      _preview (playlists) {
        this.playlist = playlists[0]
        this.previewShow = true
      },

      previewClose () {
        this.playlist = {}
      },

      _transformStatus (searchStatus) {
        switch (searchStatus) {
          case '在线':
            return 1
          case '离线':
            return 0
          case '全部':
            return 2
        }
      },
      submitIMForm() {
        this.$refs.formDataIM.validate((valid) => {
          if (valid) {
            let me = this
            http.post('terminals/send-im', this.formDataIM)
              .then(res => {
                if (res.data.success === true){
                  this.$notify({
                    title: '成功',
                    type: 'success',
                    message: 'IM消息发送成功!'
                  })
                }
                setTimeout(() => {
                  me.click_cancel_IM()
                }, 200);
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            console.log('error')
            return false
          }
        })
      },
      click_cancel_IM() {
        this.$refs.multipleTable.clearSelection()
        this.$refs.formDataIM.resetFields()
        this.showIMWindow = false
      },
      handleSelectionChange(val){
        this.formDataIM.numbers = []
        for (let i = 0; i < val.length; i++) {
          if (this.formDataIM.numbers.indexOf(val[i].number) === -1) {
            this.formDataIM.numbers.push(val[i].number)
          }
        }
        this.disabledIMBtn = val.length == 0
      },
      getSearchPageList (val) {
        this.page = 1
        this.pageSize = val
      },
      handleCurrentChange (val) {
        this.page = val
      },
      groupSearch () {
        this.getTerminals(this.request)
      },
      typeSearch () {
        this.getTerminals(this.request)
      }
    },

    watch: {
      request: {
        handler (n, o) {
          if (n)
            this.resetQuery()
          this.getTerminals(n)
        },
        deep: true
      },

      playlists: {
        handler (n, o) {
          this._preview(n)
        }
      },

      searchStatus: {
        handler (n, o) {
          setTimeout(() => {
            this.searchStatusNum = this._transformStatus(n)
          }, 14)
        }
      }
    }
  }
</script>

<style lang="scss">
  .groupTerminal {
    position: relative;
    .el-select {
      width: 110px;
      .el-input{
        width: 110px;
      }
    }
    .table-wrapper {
      height: calc(100% - 36px);
    }
    .terminals {
      float: left;
      .fa {
        display: inline-block;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    .terminalInfoMask {
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 100;
      background-color: transparent;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      #terminalInfo {
        overflow: auto;
        width: 450px;
        height: 100%;
        float: right;
        background-color: #fff;
        padding: 15px 30px;
        box-shadow: 0 2px 5px rgba(0,0,0,.16), 0 2px 10px rgba(0, 0, 0, .12);
      }
    }
    .activetion {
      .trees-wrapper {
        height: calc(100% - 105px);
        overflow: auto;
      }
    }
    .el-dialog {
      max-height: calc(100% - 15vh - 50px);
      .el-dialog__body {
        height: calc(100% - 115px);
        overflow: hidden;
      }
    }
    .button-active {
      background-color: #409eff;
      color: #fff;
    }
  }
  .green {
    color: #67C23A;
  }
  .yellow {
    color: #E6A23C;
  }
  .el-radio {
    margin-bottom: 10px;
  }
</style>
<style lang="scss">
  .w100{ width: 100px}
  .svg-icon{
    color: #000;}
  .svg-icon:hover{
    color: #67C23A;
  }
</style>
