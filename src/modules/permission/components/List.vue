<template>
  <div class="permisson-warpper">
    <div class="new-btn">
      <el-button @click="addList" plain>
        <i class="fa fa-plus"></i>
      </el-button>
    </div>
    <el-table v-loading="loading" :data="permissionsList" highlight-current-row height="calc(100% - 60px)">
      <el-table-column  width="60px"></el-table-column>
      <el-table-column prop="name" label="权限名称"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="created_at"></el-table-column>
      <el-table-column align="center" label="修改时间" prop="updated_at"></el-table-column>
      <el-table-column width="240px" label="操作" align="center">
        <template slot-scope="scope">
          <!--<el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
            <el-button type="text" size="mini" @click="editPermissions(scope.row, scope.$index)">
              <i class="fa fa-pencil"></i>
            </el-button>
          </el-tooltip>-->
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="text" size="mini" @click="deletePermisson(scope.row.id)">
              <i class="fa fa-trash"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="500px" :title="title" class="permisson" :visible="showEditWindow" @close="click_cancel">
      <el-form :model="newPermisson" ref="newRole" :rules="rules" label-width="90px">
        <el-form-item prop="name" label="权限名称:">
          <el-input v-focus autofocus v-model="newPermisson.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('newPermisson')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data () {
      return {
        permissionList: [],
        loading: false,
        title: '',
        set_type: 0,
        index: 0,
        newPermisson: {
          name: '',
          id: 0
        },
        rules: {
          name: [  { required: true, message: '请输入权限名称', trigger: 'blur' },
                   {  max: 45, message: '不能大于45 个字符', trigger: 'blur' }],
        }
      }
    },
    computed : {
      ...mapState({
        permissionsList: state => state.permission.permissionsList,
        showEditWindow: state => state.permission.showEditWindow
      }),
    },

    methods: {
      ...mapMutations([
        'SET_PERMISSIONSLIST',
        'SET_EDITWINDOW'
      ]),

      ...mapActions([
        'getPermissionsList', 'editorPermissionsList', 'addPermissionsList', 'removePermissions'
      ]),
      /**
       * 添加权限
       * */
      addList() {
        this.set_type = 0
        this.SET_EDITWINDOW(true)
      },
      editPermissions(val, index) {
        this.set_type = 1
        this.newPermisson.name = val.name
        this.newPermisson.id = val.id
        this.index = index
        this.SET_EDITWINDOW(true)
      },
      /**
       * 关闭权限弹出窗
       * */
      click_cancel(){
        this.SET_EDITWINDOW(false)
        this.newPermisson.name = ''
        this.newPermisson.id = 0
      },
      /**
       * 保存或编辑权限
       * */
      submitForm(){
        if (this.set_type=== 0){
          this.addPermissionsList(this.newPermisson.name)
        } else {
          this.editorPermissionsList({id: this.newPermisson.id, name: this.newPermisson.name, index:this.index})
        }
      },
      /**
       * 删除权限
       * */
      deletePermisson(id){
        this.$confirm('此操作将永久删除该播出单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removePermissions(id)
        })
      }
    },

    created () {
      this.getPermissionsList()
    }
  }
</script>

<style lang="scss" scoped>
  .permisson-warpper{
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
</style>
<style lang="scss">
  .permisson{
    .el-dialog__body{padding: 30px 20px 10px}
  }
</style>
