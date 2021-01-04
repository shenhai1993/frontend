<template>
  <el-container class="select-model">
    <!--<el-header height="40px">模型选择区</el-header>-->
    <el-main>
      <el-tabs tab-position="left">
        <el-tab-pane label="默认模板">
          <ul>
            <li
              v-for="(value, name) in modelList"
              :key="name">
              <div class="modelListName" style="font-weight: bold;">{{name}}</div>
              <div
                v-for="(item, index) in value"
                :key="item.id"
                class="modelListItem"
                @dragend="removeThisModel(item.id)"
                @click="selectThisModel(item)">
                <img :src="item.thumbImage" />
                <div class="modelListItem-name-cover">
                  <div class="modelListItem-name">{{getIntro(item.comData)}}</div>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="自定义模板">
          <ul>
            <li
              v-for="(value, name) in createList"
              :key="name">
              <div class="modelListName" style="font-weight: bold;">{{name}}</div>
              <div
                v-for="(item, index) in value"
                :key="item.id"
                class="modelListItem"
                @click="createModel(item, value)">
                <img :src="index == 0 ? '/static/images/model_thumb/model_list_thumb_006.png' : item.thumbImage" />
                <div class="plus-remove-icon">
                  <i v-if="index > 0" class="select-icon-remove" @click.stop="removeModel(item.id)"></i>
                </div>
                <div class="modelListItem-name">{{item.intro}}</div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
<!--        <el-tab-pane label="新建">
          <ul>
            <li
              v-for="(item, index) in orgList"
              :key="index">
              <div
                class="modelListItem"
                @click="createModelTest(item)">
                <img :src="item.thumbImage" />
              </div>
            </li>
          </ul>
        </el-tab-pane>
 -->      </el-tabs>
    </el-main>

    <component
      v-if="showCreateModel"
      :is="customModelType"
      :isShow="showCreateModel"
      :currentData="currentModelData"
      :originData="originModelData"
      @refreshCustomList="refreshCustomList"
      @closeCreateModel="closeCreateModel">
    </component>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../static/js/terminaltemp.js'
import ModelList from '../static/data/listTest.json'
import OrgList from '../static/data/modelList.json'

export default {
  components: {
    AdCustomCreate: () => import ('./editcoms/adCustomCreate.vue'),
    ProductCustomCreate: () => import ('./editcoms/productCustomCreate.vue'),
    MenuCustomCreate: () => import ('./editcoms/menuCustomCreate.vue'),
    DividerCustomCreate: () => import ('./editcoms/dividerCustomCreate.vue')
  },

  data () {
    return {
      orgList: OrgList,
      customModelType: '',
      createList: {},
      modelList: {},
      currentModelData: {},
      originModelData: {},
      showCreateModel: false,
      page: 1,
      perpage: 10,
      hasMore: false
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.terminaltemp.simsResetWH,
      baseWH: state => state.terminaltemp.baseWH
    })
  },

  created () {
    this.refreshCustomList()
  },

  mounted () {
    this.getModelList(this.page)
  },

  methods: {
    ...mapMutations([
      'SET_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'setSimsViewData'
    ]),

    getItemId (id) {
      const index = id.indexOf('-') + 1
      const newId = id.substring(index)
      return parseInt(newId)
    },

    selectThisModel (data) {
      this.setSimsViewData(data)
    },

    createModel (data, value) {
      let id = data.id
      id = this.getItemId(id)
      if (id == 0) {
        this.addModel(data, value)
        return
      }
      this.setSimsViewData(data)
    },

    addModel (data, value) {
      this.originModelData = data
      this.currentModelData = data
      if (value.length > 1) {
        this.currentModelData.kid = value[1].id
      } else {
        this.currentModelData.kid = this.currentModelData.id
      }
      this.customModelType = data.special_type + '-create'
      this.showCreateModel = true
    },

    removeModel (id) {
      this.$confirm('确定要删除该模型吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const data = localStorage.getItem('custom_model_data')
        let newData = JSON.parse(data)
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].id == id) {
            newData.splice(i, 1)
            break
          }
        }
        localStorage.setItem('custom_model_data', JSON.stringify(newData))
        this.refreshCustomList()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }).catch(() => {})
    },

    refreshCustomList () {
      this.showCreateModel = false
      let newData = this.modelListObj(ModelList)
      const data = localStorage.getItem('custom_model_data')
      if (data == null) {
        this.createList = JSON.parse(JSON.stringify(newData))
        return
      }
      //localStorage.removeItem('custom_model_data')
      const listData = JSON.parse(data)
      for (let i = 0; i < listData.length; i++) {
        const d = listData[i]
        for (let o in newData) {
          if (d.special_name == o) {
            newData[o].splice(1, 0, d)
            break
          }
        }
      }
      this.createList = JSON.parse(JSON.stringify(newData))
    },

    closeCreateModel () {
      this.showCreateModel = false
    },

    getModelList (page) {
      Terminaltemp.getModelList(page, this.perpage).then(res => {
        if (res.data.success) {
          const data = res.data.message.data
          this.modelListSort(data)
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

    getMoreList () {
      if (!this.hasMore) {
        return false
      }
      this.page++
      this.getModelList(this.page)
    },

    modelListSort (v) {
      const data = v
      if (data.length >= this.perpage) {
        this.hasMore = true
      } else {
        this.hasMore = false
      }
      const obj = this.modelListObj(data)
      this.modelList = obj
    },

    modelListObj (v) {
      const data = v
      let obj = {}
      for (let i = 0; i < data.length; i++) {
        const res = data[i]
        const name = res.special_name
        if (obj[name] === undefined) {
          obj[name] = []
        }
        const length = obj[name].length
        obj[name].splice(length, 0, res)
      }
      return obj
    },

    getIntro (v) {
      const data = JSON.parse(v)
      return data.intro
    },

    removeThisModel (id) {
      return

      this.$confirm('确定要删除该模型吗？', '提示', {
        type: 'warning'
      }).then(() => {
        Terminaltemp.removeModel(id).then(res => {
          if (res.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getModelList(this.page)
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
      }).catch(() => {})
    },

    createModelTest (data) {
      let modelData = {
        id: data.id,
        special_name: data.special_name,
        special_type: data.special_type,
        thumbImage: data.thumbImage,
        comData: JSON.stringify(data)
      }
      Terminaltemp.createModel(modelData).then(res => {
        if (res.data.success) {
          this.$message({
            message: '模板创建成功！',
            type: 'success'
          })
          this.getModelList(this.page)
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
    }
  }
}
</script>

<style lang="scss">
  @import '../static/css/terminaltemp.scss';

  .select-model {
    .el-tabs__item {
      padding: 0 60px;
    }
    .el-tabs--left .el-tabs__item.is-left {
      text-align: center;
    }
    .el-tabs__item.is-active {
      color: #FFFFFF;
      background-color: #3F94EF;
    }
  }
</style>
<style lang="scss" scoped>
  .el-main {
    padding: 0;
  }
  .select-icon-plus, .select-icon-remove {
    display: inline-block;
    width: 26px;
    height: 26px;
    background-size: 100%;
  }
  .select-icon-plus {
    background-image: url(../static/images/icon-plus-outline.png);
  }
  .select-icon-remove {
    background-image: url(../static/images/icon-remove-outline.png);
  }
  .modelListItem-name-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background-color: #BEBCBC80;
  }
  .modelListItem-name {
    position: absolute;
    width: 100%;
    left: 0px;
    top: 50%;
    color: #FFFFFF;
    padding: 0 10px;
    transform: translateY(-50%);
  }
</style>
