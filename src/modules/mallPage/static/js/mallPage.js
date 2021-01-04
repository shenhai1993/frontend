'use strict'

import http from '@static/js/utils/http.js'

const mallPage = {
  that: null,

  _MALLPAGE_SHOW_COMPLETETIPS (val) {
    this.that.showCompleteTips(val)
  },

  setWidthXHeight (val, wh) {
    const setWH = val.split('x')
    const setWidth = parseFloat(setWH[0])
    const setHeight = parseFloat(setWH[1])
    const offsetWH = JSON.parse(JSON.stringify(wh))
    const offsetWidth = offsetWH[0]
    const offsetHeight = offsetWH[1]
    let newWH = offsetWH
    if (setWidth >= setHeight) {
      const w = Math.floor(setWidth / setHeight * offsetHeight)
      if (w > offsetWidth) {
        newWH[1] = Math.floor(setHeight / setWidth * offsetWidth)
        newWH[0] = offsetWidth
      } else {
        newWH[0] = w
      }
    } else {
      const h = Math.floor(setHeight / setWidth * offsetWidth)
      if (h > offsetHeight) {
        newWH[0] = Math.floor(setWidth / setHeight * offsetHeight)
        newWH[1] = offsetHeight
      } else {
        newWH[1] = h
      }
    }
    newWH[0] += 'px'
    newWH[1] += 'px'
    return newWH
  },

  getOffsetWH (name) {
    const w = document.getElementsByClassName(name)[0].offsetWidth
    const h = document.getElementsByClassName(name)[0].offsetHeight
    const WH = [w, h]
    return WH
  },

  getNewW (w, oWH, nWH) {
    const nw = parseFloat((nWH[0] / oWH[0]) * w)
    return nw
  },

  getNewH (h, oWH, nWH) {
    const nh = parseFloat((nWH[1] / oWH[1]) * h)
    return nh
  },

  getSimsViewModelTop (arr) {
    let val = {
      index: 0,
      top: 0
    }
    let data = JSON.parse(JSON.stringify(arr))
    for (let i = 0; i < data.length; i++) {
      const item = JSON.parse(data[i].comData)
      const nodes = document.getElementsByName(item.special_type + '_' + i)
      const top = nodes[0].offsetTop
      const height = nodes[0].offsetHeight
      const maxTop = top + height
      if (val.top < maxTop) {
        val.index = i
        val.top = maxTop
      }
    }
    return val
  },

  async updateStockData (row) {
    let itemData = row
    if (itemData.length > 0) {
      let productIdString = this.that.productIdString
      let newStockData = {}
      let productString = productIdString.productId
      let packetString = productIdString.packetId
      if (productString === '' && packetString === '') {
        for (let i = 0; i < itemData.length; i++) {
          let specialType = itemData[i].special_type
          if (specialType === 'menu-product-one' || specialType === 'menu-product-two' || specialType === 'product-custom') {
            let comData = itemData[i].comData
            comData = JSON.parse(comData)
            let product = comData.comData
            for (let p = 0; p < product.length; p++) {
              if (product[p].packet_id && product[p].packet_id > 0) {
                packetString += (packetString === '' ? '' : ',') + product[p].id
              } else {
                productString += (productString === '' ? '' : ',') + product[p].id
              }
            }
          } else if (specialType === 'menu-custom') {
            let comData = itemData[i].comData
            comData = JSON.parse(comData)
            let productData = comData.comData.product.data
            for (let pd = 0; pd < productData.length; pd++) {
              let product = productData[pd].data
              for (let p = 0; p < product.length; p++) {
                if (product[p].packet_id && product[p].packet_id > 0) {
                  packetString += (packetString === '' ? '' : ',') + product[p].id
                } else {
                  productString += (productString === '' ? '' : ',') + product[p].id
                }
              }
            }
          }
        }
        this.that.setProductId({
          productId: productString,
          packetId: packetString
        })
      }
      if (productString !== '') {
        let res = await this.batchStockHttp(productString)
        if (res.data.success) {
          let productRes = res.data.message
          newStockData = Object.assign({}, newStockData, productRes)
        }
      }
      if (packetString !== '') {
        let res = await this.batchPacketStockHttp(packetString)
        if (res.data.success) {
          let packetRes = res.data.message
          newStockData = Object.assign({}, newStockData, packetRes)
        }
      }
      this.that.setUpdateStockData(newStockData)
    }
  },

  batchStockHttp (id) {
    return http.get('/product/getbatchproductstock?id=' + id)
  },

  batchPacketStockHttp (id) {
    return http.get('/product/getbatchpackstock?id=' + id)
  },

  async showHttp (url) {
    return http.get(url)
  },
  async getShow (page = 1, perpage = 5) {
    const url = '/tempshow/' + '?page=' + page + '&per_page=' + perpage
    let res = await this.showHttp(url)
    return res
  },

  async submitOrderHttp (data) {
    return http.post('/pay/setOrder', data)
  },
  async submitOrderPost (data) {
    let res = await this.submitOrderHttp(data)
    return res
  },

  async paymentHttp (url) {
    return http.get(url)
  },
  async getPayment (page = 1, perpage = 5) {
    const url = '/payment/' + '?page=' + page + '&per_page=' + perpage
    let res = await this.paymentHttp(url)
    return res
  },

  async showCode (code, data) {
    let url = ''
    if (code === 'wechat') {
      url = '/wechatpay'
    } else if (code === 'alipay') {
      url = '/alipay'
    }
    let res = http.post(url, data)
    return res
  },

  async getModelShowHttp (id) {
    return http.get(`/tempshow/itemlist/${id}`)
  },
  async getModelShow (id) {
    let res = await this.getModelShowHttp(id)
    return res
  },

  async getPayStatusHttp () {
    return http.post('/pay/notifystatus')
  },
  async getPayStatus () {
    let res = await this.getPayStatusHttp()
    return res
  },

  async getModelShowJsonHttp (url) {
    return http.get(url)
  },
  async getModelShowJson () {
    const url = 'http://10.104.6.204:80/25.json'
    let res = await this.getModelShowJsonHttp(url)
    return res
  }
}

export {
  mallPage
}
