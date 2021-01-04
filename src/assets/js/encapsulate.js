import http from '../../../static/js/utils/http'
import { Notification, MessageBox } from 'element-ui'

/**
 * 删除的再次封装
 * @param {String} message 提示信息文本
 * @param {String} url API路径
 * @param {String} type 请求类型
 * @param {Object} data 请求参数
 * @param {Function} successCb 请求成功后回调
 * @param {Function} errorCb 请求失败后回调
 */
const tip = (params) => {
  if (!params.message || params.message === '') {
    params.message = '确定要删除该信息？'
  }
  if (typeof params.message !== 'string') return
  MessageBox(params.message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let request
    switch (params.type) {
      case 'delete':
        // 发送删除请求
        request = http.delete(params.url, params.data, params.successCb, params.errorCb)
        break
      // case 'restart':
      //   request = http.re(url, data, successCb, errorCb)
    }
    request.then(() => {
      Notification({
        type: 'success',
        message: '操作成功!'
      })
      params.successCb()
    })
      .catch(() => {
        Notification({
          type: 'error',
          message: '操作失败'
        })
        if (params.errorCb) params.errorCb()
      })
  }).catch(() => {
  })
}

/**
 * 删除的再次封装
 * @param {String} message 提示信息文本
 * @param {Function} successCb 请求成功后回调
 * @param {Function} errorCb 请求失败后回调
 * @param {Function} request 请求函数
 */
const newTip = (params, request) => {
  if (!params.message || params.message === '') {
    params.message = '确定要删除该信息？'
  }
  if (typeof params.message !== 'string') {
    return
  }
  MessageBox.confirm(params.message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(res => {
    request().then(res => {
      if (res) {
        Notification({
          type: 'success',
          message: '操作成功!'
        })
        if (params.successCb) {
          params.successCb()
        }
      }
    }).catch((e) => {
      Notification({
        type: 'error',
        message: '操作失败'
      })
      if (params.errorCb) {
        params.errorCb()
      }
    })
  }).catch(() => {
  })
}

export {
  tip,
  newTip
}
