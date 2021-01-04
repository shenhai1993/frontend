<template>
  <div class="searchlist">
    <el-row class="border">
      <el-col :span="2" style="font-size: 14px;text-align: center">模板行业：</el-col>
      <el-col :span="21">
        <el-radio-group v-model.number="radio" @change="onchange" class="radioNav">
          <el-radio :label="1">餐饮</el-radio>
          <el-radio :label="2">酒店</el-radio>
          <el-radio :label="3">商场</el-radio>
          <el-radio :label="4">美容美发</el-radio>
          <el-radio :label="5">服饰服装</el-radio>
          <el-radio :label="6">医疗机构</el-radio>
          <el-radio :label="7">教育培训</el-radio>
          <el-radio :label="8">房产机构</el-radio>
          <el-radio :label="9">超市</el-radio>
          <el-radio :label="10">金融</el-radio>
          <el-radio :label="11">公司</el-radio>
          <el-radio :label="12">旅游</el-radio>
          <el-radio :label="13">通信</el-radio>
          <el-radio :label="14">节日主题</el-radio>
          <el-radio :label="15">案例展示</el-radio>
          <el-radio :label="16">其他</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        data(){
          return{
            radio: 1,
          }
        },
        methods:{
          onchange(){
            this.$emit('changeIndustry',this.radio)
          }
        }
    }
</script>

<style scoped lang="scss">
  .border{
    border: 1px solid #d0e0f2;
    line-height: 30px;
    padding: 10px 0;
    background: aliceblue;
  }
  .radioNav{
    line-height: 30px;
  }
</style>
