<template>
  <el-dialog class="props-content" v-if="isterminalPropsVisible" width="700px" title="设置终端属性" :visible="isterminalPropsVisible" @close="click_cancelCreat">
    <el-tabs v-model="activeTab">
      <!-- 图像设置 -->
      <el-tab-pane name="picture">
        <span slot="label">图像设置<div class="target-status" v-if="pictureEdit === true"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.picture" class="form-all" label-width="100px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.picture.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="图像模式">
            <el-select @change="changePictureMode" v-model="form.picture.picture_mode">
              <el-option label="明亮" :value="0"></el-option>
              <el-option label="标准" :value="1"></el-option>
              <el-option label="柔和" :value="2"></el-option>
              <el-option label="自设" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="背光">
            <div class="block-slider">
              <el-slider :disabled="isPictureCol_temp" v-model="form.picture.back_light" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="亮度">
            <div class="block-slider">
              <el-slider :disabled="isPictureCol_temp" v-model="form.picture.brightness" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="对比度">
            <div class="block-slider">
              <el-slider :disabled="isPictureCol_temp" v-model="form.picture.contrast" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="色度">
            <div class="block-slider">
              <el-slider :disabled="isPictureCol_temp" v-model="form.picture.chroma" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="清晰度">
            <div class="block-slider">
              <el-slider :disabled="isPictureCol_temp" v-model="form.picture.sharpness" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="色温">
            <el-select :disabled="isPictureCol_temp" v-model="form.picture.col_temp">
              <el-option label="冷色" :value="0"></el-option>
              <el-option label="标准" :value="2"></el-option>
              <el-option label="暖色" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自然色">
            <el-radio-group :disabled="isPictureCol_temp" v-model="form.picture.nature_light">
              <el-radio :label="0">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="动态对比度">
            <el-radio-group :disabled="isPictureCol_temp" v-model="form.picture.dcc">
              <el-radio :label="0">关</el-radio>
              <el-radio :label="1">开</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('picture')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="pictureLasttime" @click="settingLasttime('picture')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <!-- 声音设置 -->
      <el-tab-pane name="sound">
        <span slot="label">声音设置<div class="target-status" v-if="soundEdit"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.sound" :rules="soundRules" ref="soundForm" class="form-all" label-width="100px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.sound.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="声音模式">
            <el-select v-model="form.sound.sound_mode">
              <el-option label="标准" :value="0"></el-option>
              <el-option label="音乐厅" :value="1"></el-option>
              <el-option label="影院" :value="2"></el-option>
              <el-option label="新闻" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="音量调节">
            <div class="block-slider">
              <el-slider v-model="form.sound.volume" show-input></el-slider>
            </div>
          </el-form-item>
          <el-form-item label="分时音量">
            <el-radio-group v-model="form.sound.volume_time.value">
              <el-radio label="1">开</el-radio>
              <el-radio label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间段">
            <el-col :span="7">
              <div class="timesBox">
                <el-form-item prop="startTime">
                  <el-time-select :disabled="isSoundOpenVolume" placeholder="开始时间" v-model="form.sound.startTime"></el-time-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="7">
              <div class="timesBox">
                <el-form-item prop="endTime">
                  <el-time-select :disabled="isSoundOpenVolume" placeholder="结束时间" v-model="form.sound.endTime" :picker-options="{minTime: form.sound.startTime}"></el-time-select>
                </el-form-item>
              </div>
            </el-col>
            <el-button type="primary" @click.stop="saveSoundTimes('soundForm')" :disabled="isSoundOpenVolume">添加时间段</el-button>
          </el-form-item>
          <el-form-item v-show="!isSoundOpenVolume">
             <el-table :data="form.sound.volume_time.items" style="width: 350px;">
              <el-table-column prop="volume_period" label="编号" width="50"></el-table-column>
              <el-table-column prop="starttime" label="开始时间" width="80"></el-table-column>
              <el-table-column prop="endtime" label="结束时间"></el-table-column>
              <el-table-column prop="volume" label="音量" width="60"></el-table-column>
              <el-table-column label="操作" width="50" align='center'>
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="删除" placement="bottom">
                    <i class="fa fa-trash" @click.stop="soundTime_delete(scope.row, scope.$index)"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('sound')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="soundLasttime" @click="settingLasttime('sound')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>

      <!-- 开关机设置 -->
      <el-tab-pane name="time">
        <span slot="label">开关机设置<div class="target-status" v-if="timeEdit"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.time" :rules="soundRules" ref="timeForm" class="form-all" label-width="100px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.time.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="开机模式">
            <el-select @change="changeTimePower" v-model="form.time.power_style">
              <el-option label="每天" :value="0"></el-option>
              <el-option label="每周" :value="1"></el-option>
              <el-option label="关" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星期" v-show="isTimePowerOpen">
            <el-select v-model="powerPeriod" @change="changTimePowerPeriod">
              <el-option label="一" :value="1"></el-option>
              <el-option label="二" :value="2"></el-option>
              <el-option label="三" :value="3"></el-option>
              <el-option label="四" :value="4"></el-option>
              <el-option label="五" :value="5"></el-option>
              <el-option label="六" :value="6"></el-option>
              <el-option label="日" :value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间段">
            <el-col :span="7">
              <div class="timesBox">
                <el-form-item prop="startTime">
                  <el-time-select :disabled="isTimeOptions" :picker-options="{ start: '00:00',step: '00:30', end: '23:59'}" placeholder="开始时间" v-model="form.time.startTime"></el-time-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col class="line" :span="1">--</el-col>
            <el-col :span="7">
              <div class="timesBox">
                <el-form-item prop="endTime">
                  <el-time-select :disabled="isTimeOptions" placeholder="结束时间"  v-model="form.time.endTime" :picker-options="{minTime: form.time.startTime,start: '00:00',step: '00:30',end: '23:59'}"></el-time-select>
                </el-form-item>
              </div>
            </el-col>
            <el-button type="primary" @click.stop="saveTimesForm('timeForm')" :disabled="isTimeOptions">添加时间段</el-button>
          </el-form-item>

          <el-form-item v-show="!isTimeOptions">
            <el-table :data="tableTimes" style="width: 350px">
              <el-table-column prop="starttime" label="开机时间" width="100"></el-table-column>
              <el-table-column prop="endtime" label="关机时间"></el-table-column>
              <el-table-column label="操作" width="60" align='center'>
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="删除" placement="bottom">
                    <i class="fa fa-trash" @click.stop="Times_delete(scope.row, scope.$index)"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('time')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="timeLasttime" @click="settingLasttime('time')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>

      <!-- 其他设置 -->
      <el-tab-pane name="sys_setting">
        <span slot="label">其他设置<div class="target-status" v-if="sys_settingEdit"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.sys_setting" class="form-all" label-width="100px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.sys_setting.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="遥控器">
            <el-select v-model="form.sys_setting.enableremote">
              <el-option label="不启用" :value="0"></el-option>
              <el-option label="启用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="语言">
            <el-select v-model="form.sys_setting.language">
              <el-option label="简体中文" :value="0"></el-option>
              <el-option label="ENGLISH" :value="1"></el-option>
              <el-option label="繁体中文" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="断电记录">
            <el-select v-model="form.sys_setting.poweroff_record">
              <el-option label="关" :value="0"></el-option>
              <el-option label="开" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="悬挂方式">
            <el-select v-model="form.sys_setting.rotator">
              <el-option label="水平（横屏）" :value="0"></el-option>
              <el-option label="90度（竖屏）" :value="1"></el-option>
              <el-option label="180度（反向横屏）" :value="2"></el-option>
              <el-option label="270度（反向竖屏）" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日志记录">
            <el-select v-model="form.sys_setting.logging">
              <el-option label="关" :value="0"></el-option>
              <el-option label="保存7天" :value="1"></el-option>
              <el-option label="保存15天" :value="2"></el-option>
              <el-option label="保存30天" :value="3"></el-option>
              <el-option label="保存60天" :value="4"></el-option>
              <el-option label="永久" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('sys_setting')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="sys_settingLasttime" @click="settingLasttime('sys_setting')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>

      <!-- 台标设置 -->
      <el-tab-pane name="logo_setting">
        <span slot="label">台标设置<div class="target-status" v-if="logo_settingEdit"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.logo" class="form-all" label-width="120px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.logo.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="显示高度（px）">
            <el-input-number v-model="form.logo.height"></el-input-number>
          </el-form-item>
          <el-form-item label="显示宽度（px）">
            <el-input-number v-model="form.logo.width"></el-input-number>
          </el-form-item>
          <el-form-item label="台标文件">
            <div class="fileBox">
              <input type="file" ref="logoFiles" @change="uploadLogoChange" class="inputFile" />
              <el-input :readonly="true" v-model="form.logo.name" style="width:220px;" size="medium"></el-input>
              <el-button size="small" type="primary" style="display: inline-block;margin-left: 10px;">选择</el-button>
              <el-button size="small" type="primary" style="display: inline-block;margin-left: 10px;" @click="deleteLogo">删除台标文件</el-button>
            </div>
          </el-form-item>
          <el-form-item label="台标位置">
            <el-select v-model="form.logo.location">
              <el-option label="左上角" :value="0"></el-option>
              <el-option label="右上角" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Logo预览" v-show="isLogosettingFile">
            <div>
              <img :src="logoPath" style="max-width: 300px;" />
            </div>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('logo')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="logoLasttime" @click="settingLasttime('logo')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>

      <el-tab-pane label="开机画面设置" name="up_animation">
        <span slot="label">开机画面设置<div class="target-status" v-if="startupEdit"><i class="el-icon-edit-outline"></i></div></span>
        <el-form :model="form.startup" class="form-all" label-width="100px" size="small">
          <el-form-item label="启用设置">
            <el-checkbox v-model="form.startup.enable"></el-checkbox>
          </el-form-item>
          <el-form-item label="开机画面">
            <el-select v-model="form.startup.value">
              <el-option label="不更新" :value="0"></el-option>
              <el-option label="更新" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开机文件">
            <div class="fileBox">
              <input type="file" ref="starupFiles" :disabled="isStartupFile" @change="uploadChange" class="inputFile" />
              <el-input :readonly="true" v-model="form.startup.path" :disabled="isStartupFile" style="width:220px;" size="medium"></el-input>
              <el-button size="small" :disabled="isStartupFile" type="primary" style="display: inline-block;margin-left: 10px;">选择</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div style="padding-left: 150px;">
          <el-tooltip effect="dark" content="恢复默认设置" placement="bottom">
            <el-button class="m-l-10" @click="settingDefault('startup')">
              <i class="el-icon-d-arrow-left"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="撤销设置" placement="bottom">
            <el-button class="m-l-10" :disabled="startupLasttime" @click="settingLasttime('startup')">
              <i class="el-icon-back"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="click_cancelCreat">取 消</el-button>
      <el-button type="primary" @click="click_saveAll">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import $ from 'jquery'
import http from '../../../../../static/js/utils/http'

export default {
  props: {
    isterminalPropsVisible: Boolean,
    id: Number,
    type: {
      type: String,
      default: 'terminal'
    },
    dataForm: {
      default: function () {
        return null
      }
    }
  },

  data () {
    return {
      isInit: true,
      //isPictureCol_temp: true, // 图像设置 色温是否禁用
      isTimePowerOpen: false, // 开关机设置 开关机模式
      tableTimes: [], // 开关机设置 添加的所有时间段
      powerPeriod: null,
      activeTab: 'picture',
      pictureLasttime: true, // 是否禁用撤销按钮
      soundLasttime: true,
      timeLasttime: true,
      sys_settingLasttime: true,
      logoLasttime: true,
      startupLasttime: true,
      pictureEdit: false, //编辑状态  是否修改了
      soundEdit: false,
      timeEdit: false,
      logo_settingEdit: false,
      sys_settingEdit: false,
      startupEdit: false,
      form: {
        picture: {
          picture_mode: 1
        },
        sound: {
          volume_time: {
            value: "0"
          }
        },
        time: {},
        sys_setting: {
          startup_setting: {}
        },
        logo: {},
        startup: {
          value: 1
        }
      },
      allData: {
        picture: {
          enable: false,
          picture_mode: 1, //标准模式 参数固定
          back_light: 80, //背光
          brightness: 50, //亮度
          contrast: 50, //对比度
          chroma: 50, //色温
          sharpness: 50, //清晰度
          col_temp: 1, //色温 0冷色 2暖色 1标准
          nature_light: 1, //自然色 1开 0关
          dcc: 0 //动态对比度 1开 0关
        },
        sound: {
          enable: false,
          startTime: '', // 声音设置 时间段开始时间
          endTime: '', // 声音设置 时间段结束时间
          sound_mode: 0, //0-标准
          volume: 50, //音量值
          volume_time: {
            // value: 0, //是否开启分时音量 0关 1开
            value: "0",
            items: []
          }
        },
        time: {
          enable: false,
          startTime: '', // 声音设置 时间段开始时间
          endTime: '', // 声音设置 时间段结束时间
          power_style: 2 //0-每天
        },
        sys_setting: {
          enable: false,
          enableremote: 1,
          language: 0,
          poweroff_record: 0,
          rotator: 0,
          logging: 2
        },
        logo: {
          enable: false,
          height: 0,
          width: 0,
          location: 0,
          name: '',
          path: ''
        },
        startup: {
          enable: false,
          value: 0,
          path: ''
        }
      },
      pictureMode: [
        {
          picture_mode: 0, //明亮模式 参数固定
          back_light: 100, //背光
          brightness: 50, //亮度
          contrast: 75, //对比度
          chroma: 60, //色温
          sharpness: 65, //清晰度
          col_temp: 0, //色温 0冷色 2暖色 1标准
          nature_light: 0, //自然色 1开 0关
          dcc: 0, //动态对比度 1开 0关
          enable: true
        },
        {
          picture_mode: 1, //标准模式 参数固定
          back_light: 80, //背光
          brightness: 50, //亮度
          contrast: 50, //对比度
          chroma: 50, //色温
          sharpness: 50, //清晰度
          col_temp: 1, //色温 0冷色 2暖色 1标准
          nature_light: 1, //自然色 1开 0关
          dcc: 0, //动态对比度 1开 0关
          enable: true
        },
        {
          picture_mode: 2, //柔和模式 参数固定
          back_light: 50, //背光
          brightness: 50, //亮度
          contrast: 40, //对比度
          chroma: 50, //色温
          sharpness: 40, //清晰度
          col_temp: 2, //色温 0冷色 2暖色 1标准
          nature_light: 0, //自然色 1开 0关
          dcc: 0, //动态对比度 1开 0关
          enable: true
        },
        {
          picture_mode: 3, //自设模式 参数固定
          back_light: 50, //背光
          brightness: 50, //亮度
          contrast: 50, //对比度
          chroma: 50, //色温
          sharpness: 50, //清晰度
          col_temp: 1, //色温 0冷色 2暖色 1标准
          nature_light: 0, //自然色 1开 0关
          dcc: 0, //动态对比度 1开 0关
          enable: true
        }
      ],
      soundRules: {
        startTime: [
          { required: true, message: '请选择开始时间'}
        ],
        endTime: [
          { required: true, message: '请选择结束时间'}
        ]
      },
      firstData: null // 撤销设置数据
    }
  },

  computed: {
    // 声音设置 分时音量关闭时 时间段禁用
    isSoundOpenVolume : function () {
      // return this.form.sound.volume_time.value === 1 && this.form.sound.enable ? false : true
      return !(this.form.sound.volume_time.value == "1")
    },
    // 开关机设置 开机模式关闭时 周几不可选
    isTimeOptions: function () {
      return this.form.time.power_style === 2 ? true : false
    },
    // 其它设置 是否显示上传
    isStartupFile: function () {
      return !(this.form.startup.value === 1)
    },
    // 台标设置 logo预览是否显示
    isLogosettingFile: function () {
      return this.form.logo.path ? true : false
    },
    logoPath: function () {
      return this.form.logo.path.indexOf("base64") != -1 ? this.form.logo.path : process.env.STORAGE_BASE + this.form.logo.path
    },
    // 图像设置 色温是否禁用
    isPictureCol_temp: function () {
      return !(this.form.picture.picture_mode === 3)
    },
  },

  watch: {
    isterminalPropsVisible: {
      handler (n) {
        if (n === true) {
          let obj = {}
          if (this.dataForm && this.dataForm.hasOwnProperty('property') && this.dataForm.property != null && JSON.stringify(this.dataForm.property) !== '{}') {
            obj.picture = this.initDataReplace(this.dataForm.property.picture, 'picture')
            obj.sound = this.initDataReplace(this.dataForm.property.sound, 'sound')
            obj.time = this.initDataReplace(this.dataForm.property.time, 'time')
            obj.sys_setting = this.initDataReplace(this.dataForm.property.sys_setting, 'sys_setting')
            obj.logo = this.initDataReplace(this.dataForm.property.logo, 'logo')
            obj.startup = this.initDataReplace(this.dataForm.property.startup, 'startup')
            if (obj.hasOwnProperty('time') && obj.time) {
              if (obj.time.power_style === 1) {
                this.tableTimes = obj.time.days.concat()
                this.isTimePowerOpen = true
                this.powerPeriod = obj.time.days[0].power_period
              } else if (obj.time.power_style === 0) {
                //this.tableTimes = $.extend(true, {}, obj.time.days)
                this.tableTimes = obj.time.days.items
              }
            }
          } else {
            obj = $.extend(true, {}, this.allData)
          }
          if (this.isterminalPropsVisible === false) {
            this.form.picture.enable = false
            this.form.sound.enable = false
            this.form.time.enable = false
            this.form.sys_setting.enable = false
            this.form.logo.enable = false
            this.activeTab = 'picture'
          }
          this.form = $.extend(true, {}, obj)
          this.firstData = $.extend(true, {}, obj)
          this.changTimePowerPeriod(this.powerPeriod)
          this.pictureEdit = false
          this.timeEdit = false
          this.logo_settingEdit = false
          this.sys_settingEdit = false
          this.soundEdit = false
          this.startupEdit = false
          setTimeout(() => {
            this.isInit = false
          }, 0);
        } else {
          return false
        }
      }
    },
    'form.picture': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.pictureEdit = true
          this.pictureLasttime = false
        }
      },
      deep: true
    },
    'form.sound': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.soundEdit = true
          this.soundLasttime = false
        }
      },
      deep: true
    },
    'form.time': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.timeEdit = true
          this.timeLasttime = false
        }
      },
      deep: true
    },
    'form.sys_setting': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.sys_settingEdit = true
          this.sys_settingLasttime = false
        }
      },
      deep: true
    },
    'form.logo': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.logo_settingEdit = true
          this.logoLasttime = false
        }
      },
      deep: true
    },
    'form.startup': {
      handler (val, oldval) {
        if(this.isInit === false) {
          this.startupEdit = true
          this.startupLasttime = false
        }
      },
      deep: true
    }
  },

  methods: {
    initDataReplace (enableData, type) {
      if (enableData && JSON.stringify(enableData) !== '{}' && enableData !== null) {
        return enableData
      } else {
        let obj = $.extend(true, {}, this.allData[type])
        return obj
      }
    },

    // 图像设置 图像模式change事件
    changePictureMode (val) {
      this.pictureMode.forEach(item => {
        if (val === item.picture_mode) {
          let picture = $.extend(true, {}, item)
          this.$set(this.form, 'picture', picture)
        }
      })
    },

    // 声音设置 点击添加时间段按钮
    saveSoundTimes (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.sound.volume_time.items.length < 5) {
            let param = {
              starttime: this.form.sound.startTime,
              endtime: this.form.sound.endTime,
              volume: this.form.sound.volume
            }
            this.form.sound.volume_time.items.push(param)
            this.form.sound.volume_time.items.forEach((opt, inx) => {
              opt.volume_period = ++inx
            })
            this.form.sound.volume_time.num = this.form.sound.volume_time.items.length
          } else {
            this.$notify.error({
              title: '失败',
              message: '最多可添加5个时间段'
            })
          }
          this.$refs[formName].resetFields()
        }
      })
    },

    // 声音设置 点击删除某个时间段
    soundTime_delete (data, index) {
      this.$confirm('是否删除此时间段？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.sound.volume_time.items.splice(index, 1)
        this.$notify.success({
          title: '成功',
          message: '时间段已删除'
        })
        this.form.sound.volume_time.items.forEach((opt, inx) => {
          opt.volume_period = ++inx
        })
      })
    },

    // 开关机设置 开关机模式change事件
    changeTimePower (val) {
      this.tableTimes = []
      if (val === 1) {
        this.isTimePowerOpen = true
        this.form.time.days = []
      } else {
        this.isTimePowerOpen = false
        if (val === 0) {
          this.form.time.days = {
            name: 'everyday',
            power_period: 0,
            items: []
          }
        } else if (val === 2) {
          this.form.time.days = []
        }
      }
    },

    // 开关机设置 点击添加时间段按钮
    saveTimesForm (formName) {
      let me = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            starttime: me.form.time.startTime,
            endtime: me.form.time.endTime
          }
          if (me.form.time.power_style === 0) {
            if (me.form.time.days.items.length < 5) {
              me.form.time.days.items.push(param)
              me.tableTimes = me.form.time.days.items
              me.form.time.days.num = me.form.time.days.items.length
            } else {
              me.$notify.error({
                title: '失败',
                message: '最多可添加5个时间段'
              })
            }
            me.$refs[formName].resetFields()
          } else if (me.form.time.power_style === 1) {
            me.form.time.days.forEach(opt => {
              //if (opt.power_period === me.form.time.power_period) {
              if (opt.power_period === me.powerPeriod) {
                if (opt.items.length < 5) {
                  opt.items.push(param)
                  opt.num = opt.items.length
                  me.tableTimes = opt.items
                } else {
                  me.$notify.error({
                    title: '失败',
                    message: '最多可添加5个时间段'
                  })
                }
              }
            })
            me.$refs[formName].resetFields()
          }
        }
      })
    },

    // 开关机设置 选择每周几
    changTimePowerPeriod (val) {
      if (this.form.time.power_style === 1) {
        let arr = []
        this.form.time.days.forEach((opt, inx) => {
          arr.push(opt.power_period)
        })
        if (arr.indexOf(val) === -1) {
          let params = {
            name: 'day',
            power_period: val,
            items: []
          }
          this.form.time.days.push(params)
          this.tableTimes = []
        } else {
          this.tableTimes = this.form.time.days[arr.indexOf(val)].items
        }
      }
    },

    // 开关机设置 点击删除某个时间段
    Times_delete (data, index) {
      this.$confirm('是否删除此时间段？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.form.time.power_style === 0) {
          this.form.time.days.items.splice(index, 1)
          this.$notify.success({
            title: '成功',
            message: '每天该时间段已删除'
          })
        } else if (this.form.time.power_style === 1) {
          this.form.time.days.forEach((opt, inx) => {
            if (this.form.time.power_period === opt.power_period) {
              opt.items.splice(index, 1)
            }
          })
          let text = ''
          switch (this.form.time.power_period) {
            case 1:
              text = '一'
              break
            case 2:
              text = '二'
              break
            case 3:
              text = '三'
              break
            case 4:
              text = '四'
              break
            case 5:
              text = '五'
              break
            case 6:
              text = '六'
              break
            case 7:
              text = '日'
              break
          }
          this.$notify.success({
            title: '成功',
            message: '每周' + text + '该时间段已删除'
          })
        }
      })
    },

    // dialog取消按钮
    click_cancelCreat () {
      this.$emit('update:isterminalPropsVisible', false)
      this.isInit = true
      this.activeTab = 'picture'
      this.pictureLasttime = true
      this.soundLasttime = true
      this.timeLasttime = true
      this.startupLasttime = true
      this.logoLasttime = true
      this.sys_settingLasttime = true
    },

    // dialog保存按钮
    click_saveAll () {
      let me = this
      if (this.type === 'terminal') {
        this.form.terminal_id = this.id
      } else {
        this.form.tree_id = this.id
      }
      if (this.pictureEdit || this.soundEdit || this.timeEdit || this.sys_settingEdit || this.logo_settingEdit || this.startupEdit) {
        let postData = new FormData()
        postData.append('data', JSON.stringify(this.form))
        postData.append(this.type === 'terminal' ? 'terminal_id' : 'tree_id', this.id)
        if (this.$refs.logoFiles.files[0]) {
          postData.append('logoFile', this.$refs.logoFiles.files[0])
        }
        if (this.$refs.starupFiles.files[0]) {
          postData.append('starupFile', this.$refs.starupFiles.files[0])
        }
        http.post('/terminals/property', postData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '终端属性保存成功!'
            })
          }
          me.click_cancelCreat()
          // 后台队列任务处理,这里即时刷新可能还是旧数据,延迟加载或者直接刷新页面对象
          setTimeout(() => {
            me.$emit('refresh')
          }, 2000);
        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    uploadChange () {
      this.form.startup.path = this.$refs.starupFiles.files[0].name
    },

    uploadLogoChange () {
      // this.form.logo.path = this.$refs.logoFiles.files[0].name
      // 实现本地预览, 不能是图片名称
      let me = this
      me.form.logo.name = this.$refs.logoFiles.files[0].name
      if(window.FileReader) {
          var fr = new FileReader();
          fr.onloadend = function(e) {
              me.form.logo.path = e.target.result
          };
          fr.readAsDataURL(me.$refs.logoFiles.files[0])
      }
    },

    // 删除logo图片
    deleteLogo () {
      this.form.logo.path = this.form.logo.name = ''
      this.$refs.logoFiles.value = ''
    },

    settingDefault (type) {
      this.form[type] = $.extend(true, {}, this.allData[type])
      this.$notify({
        title: '成功',
        type: 'success',
        message: this.transOptions(type) + '设置已恢复默认设置!'
      })
    },

    settingLasttime (type) {
      if (this.firstData) {
        this.form[type] = $.extend(true, {}, this.firstData[type])
      } else {
        this.form[type] = $.extend(true, {}, this.allData[type])
      }
      this.$notify({
        title: '成功',
        type: 'success',
        message: this.transOptions(type) + '设置已撤销设置!'
      })
    },

    transOptions (name) {
      let text = ''
      switch (name) {
        case 'picture':
          text = '图像'
          break
        case 'sound':
          text = '声音'
          break
        case 'time':
          text = '开关机'
          break
        case 'sys_setting':
          text = '其他'
          break
        case 'logo':
          text = '台标'
          break
        case 'startup':
          text = '开机画面'
          break
      }
      return text
    }
  },
  mounted () {
    console.log('mounted数据' , this.form)
  }
}
</script>

<style lang="scss" scoped>
.form-all {
  margin-left: 60px;
}
.props-content {
  .el-radio-group {
    vertical-align: 0;
  }
  .block-slider {
    width: 290px;
    margin-left: 2px;
  }
  .el-table .cell {
    i.fa-trash {
      cursor: pointer;
    }
  }
  .el-tabs__content {
    max-height: 400px;
    overflow: auto;
  }
  .timesBox {
    .el-date-editor--time-select {
      width: 130px;
    }
  }
  .el-tabs__item > span {
    position: relative;
    .target-status {
      position: absolute;
      top: -3px;
      right: 5px;
      transform: translateY(-50%) translateX(100%);
      background-color: #f56c6c;
      border-radius: 10px;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #fff;
      z-index: 999;
    }
  }
  .fileBox {
    position: relative;
    .inputFile {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      width: 290px;
      height: 36px;
    }
  }
}
</style>
