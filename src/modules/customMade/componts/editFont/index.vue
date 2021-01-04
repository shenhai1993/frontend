<template>
    <div class="editFontBox" @click.stop>
      <el-card shadow="always">
        <h2>请输入文字</h2>
        <div class="bedienfeld">
          <el-button type="primary" circle @click="toggleFontSize('60')">大</el-button>
          <el-button type="success" circle  @click="toggleFontSize('40')">中</el-button>
          <el-button type="info" circle  @click="toggleFontSize('24')">小</el-button>
          <el-input v-model.number="outputVal" @change="textareaVal" class="output"></el-input>
          <span style="font-size:16px">当前：{{unit}}</span>
          <el-color-picker v-model="color" @change="changeColor" show-alpha style="float: right; vertical-align: middle;"></el-color-picker>
        </div>
        <el-row :gutter="15">
          <el-col :span="18">
            <div class="grid-content bg-purple">
              <textarea
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                :style="classObject"
                v-model="theTextarea">
              </textarea>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" style="margin-bottom: 5px"><el-button type="success" @click="cancelEdit">取消</el-button></div>
            <div class="grid-content"><el-button type="success" @click="updatePanel">确认</el-button></div>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
    export default {
        props: {
          textarea:{
            type: String,
            default: ''
          },
          unit: {
            type: String,
            default: '14'
          }
        },
        name: "index",
        data() {
          return{
            formInline: {
              color: 'rgba(19, 206, 102, 0.8)'
            },
            outputVal: '',
            theTextarea: this.textarea,
            color: 'rgba(19, 206, 102, 0.8)',
            classObject: {
              fontSize: '',
              color: '',
            }
          }
        },
        watch:{
          textarea:function(val){
            this.theTextarea = val
          }
        },
        methods:{
          toggleFontSize(val){
            this.classObject.fontSize = val + 'px'
            this.unit = val + 'px'
          },
          textareaVal(val){
            this.classObject.fontSize = val + 'px'
            this.unit = val + 'px'
          },
          changeColor(val){
            this.classObject.color = val
          },
          updatePanel() {
            this.classObject.content = this.theTextarea
            this.$emit('updateValue', this.classObject)
          },
          cancelEdit() {
            this.$emit('cancelEdit')
          }
        }
    }
</script>

<style lang="scss">

</style>
