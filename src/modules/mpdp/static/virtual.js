'user strict'

import http from '../../../../static/js/utils/http.js'

class Virtual {
  // 获取拼接屏列表
  static async getScreens (groupId) {
    console.log(groupId)
    let res = await http.get('/mpdp/screens', { 'group_id': groupId })
    return res
  }
  // 创建拼接屏
  static async creatScreen (data) {
    let res = await http.post(`/mpdp/screens`, data)
    return res
  }
  // 编辑拼接屏
  static async editScreen (item, data) {
    let res = await http.put(`/mpdp/screens/${item.id}`, data)
    return res
  }
  // 删除拼接屏
  static async delScreen (id) {
    let res = await http.delete(`/mpdp/screens/${id}`)
    return res
  }
  // 获取未分组终端
  static async getUngroupedTerminals () {
    let res = await http.get('terminals?type=mpdp&gtype=ungroup&sub=1')
    res.data = res.data.message
    return res
  }
}

export default Virtual
