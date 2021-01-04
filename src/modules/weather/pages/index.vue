<template>
  <div class="oneColumnLayout" style="background-color: #ffffff;padding: 20px 30px">
    <div class="drug-warpper">
      <div class="new-btn">
        <el-row>
          <el-col :span="12">
            <el-button @click="createItem"  plain icon="el-icon-plus">新增城市</el-button>
            <el-button @click="delectItem"  plain icon="el-icon-remove">批量删除</el-button>
            <el-input v-model="searchText" placeholder="请输入城市名称" style="width: 300px"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="files"
                @selection-change="onSelectionChange" highlight-current-row height="calc(100% - 120px)">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="id" label="城市ID"></el-table-column>
        <el-table-column  label="城市名称" >
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="区域" prop="area"></el-table-column>
        <el-table-column align="center" label="天气" prop="weather"></el-table-column>
        <el-table-column align="center" label="风向" prop="wind"></el-table-column>
        <el-table-column align="center" label="最低温(℃)" prop="temp_min"></el-table-column>
        <el-table-column align="center" label="最高温(℃)" prop="temp_max"></el-table-column>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="deleteWeather(scope.row.id,scope.$index)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加城市" class="videoDialog" :visible.sync="dialogPlay" width="450px" @close="closeDialog">
        <!--<el-select v-model="cityAllVal" filterable @change="changeCityId" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in cityAll"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>-->
        <el-autocomplete
          v-model="cityAllVal"
          :fetch-suggestions="querySearchGroup"
          placeholder="请选择"
          :clearable="true"
          class="filter-item"
          style="width: 100%"
          @select="changeCityId"
          @input="clearableVal"
        ></el-autocomplete>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="save">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import http from '@static/js/utils/http'
  import {mapActions, mapMutations, mapState} from "vuex";
  import {SPLICE_WEATHER_LIST} from "../store/mutation-types";
  export default {

    data () {
      return {
        loading: false,
        dialogPlay: false,
        weatherData: [],
        groupArr: [],
        files: [],
        searchText: '', // 搜索文件名
        groupList: [],
        groupid: 0,
        cityAllVal: '',
        cityAll: []
      }
    },
    computed:{
      ...mapState({
        selectWeatherList: state => state.weather.selectWeatherList,
        getWeatherPageList: state => state.weather.getWeatherPageList,
      }),
    },
    mounted () {
      // this.getWeatherPageList()
      this.getWeatherList()
      this.getAllCity()
    },
    watch:{
      searchText (val) {
        if (this.searchText === '') {
          this.files = this.getWeatherPageList
          return
        }
        this.files = this.getWeatherPageList.filter(file => {
          return file.name.indexOf(val) !== -1
        })
        // this.$refs.multipleTable.data = this.files.filter(file => {
        //   return file.name.indexOf(val) !== -1
        // })
      },
      getWeatherPageList: function (n, o) {
        this.files = this.getWeatherPageList
      },
      cityAllVal: {
        deep: true,
        handler: function(newVal, oldVal) {
          this.groupArr = []// 这是定义好的用于存放下拉提醒框中数据的数组
          var len = this.groupList.length// groupList
          var arr = []
          for (var i = 0; i < len; i++) { // 根据输入框中的值进行模糊匹配
            if (this.groupList[i].name.indexOf(this.cityAllVal) >= 0) {
              arr.push({
                value: this.groupList[i].name,
                id: this.groupList[i].id
              })
            }
          }
          this.groupArr = arr
        }
      }
    },
    methods: {
      ...mapMutations([
        'SET_SELECT_WEATHER_LIST', 'REMOVE_WEATHER_LIST', 'SPLICE_WEATHER_LIST'
      ]),
      ...mapActions([
         'deletWeatherList', 'getWeatherList', 'deletWeatherLists'
      ]),
      /**
       * 关闭城市添加弹窗
       * */
      closeDialog() {
        this.dialogPlay = false
        this.cityAllVal = ''
        this.groupid = 0
      },
      clearableVal(val){
        if (val===''){
          this.groupid = 0
        }
      },
      delectItem() {
        if (this.selectWeatherList.length === 0) {
          return this.$message({
            message: '请先选择需要删除的城市'
          })
        } else {
          this.$confirm('删除后不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let i = 0; i < this.selectWeatherList.length; i++) {
              this.deletWeatherLists(this.selectWeatherList[i])
            }
          }).catch(e => {})
        }
      },
      /**
       * 创建城市
       * */
      createItem() {
        this.dialogPlay = true
      },
      save() {
        http.put(`city/${this.groupid}`) // ?group_id=${this.groupId}
          .then((res) => {
            this.closeDialog()
            this.$notify({
              type: 'success',
              message: '添加成功!'
            })
            this.getWeatherList()
          })
          .catch(e => console.log(e))
      },
      onSelectionChange (val) {
        let files = (val.length !== 0) ? val : []
        this.SET_SELECT_WEATHER_LIST(files)
      },
      getAllCity () {
        http.get(`city/all`) // ?group_id=${this.groupId}
          .then((res) => {
            this.cityAll = res.data.message
            this.groupList = []
            this.groupArr = []
            this.groupList = res.data.message
            for (const item of this.groupList) {
              this.groupArr.push({
                value: item.name, //这里一定是value: '值'
                id: item.id
              })
            }
          })
          .catch(e => console.log(e))
      },
      querySearchGroup(queryString, cb) {
        let groupArr = this.groupArr
        cb(groupArr)
      },
      changeCityId(val) {
       this.groupid = val.id
      },
      deleteWeather(val,index) {
        this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletWeatherList(val)
            .then((res) => {
              this.REMOVE_WEATHER_LIST(index)
              this.$notify({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch((error) => {
              console.log(error)
            })
        }).catch(e => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .drug-warpper{
    height: 100%;
    .new-btn{
      margin-bottom: 20px
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      padding-left: 50px;
      .item{
        flex-basis: 180px
      }
    }
  }
  .el-icon-question{
    font-size: 18px;
    vertical-align: text-bottom
  }
  .pages-block {
    margin-top: 20px;
    text-align: right;
    .customize-box {
      text-align: right;
      font-size: 13px;
      font-weight: 400;
      color: #606266;
      .customize-pages {
        width: 130px;
        display: inline-block;
        margin: 5px 10px;
      }
    }
  }
</style>
<style lang="scss">
  .videoDialog{
    .el-dialog__body{
      padding: 10px 20px 30px;
    }
  }
</style>
