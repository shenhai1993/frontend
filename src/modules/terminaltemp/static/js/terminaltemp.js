'use strict'

import http from '@static/js/utils/http.js'

const Terminaltemp = {
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

  getSimsViewModelTop (arr, idx) {
    let index = idx
    let top = 0
    let data = JSON.parse(JSON.stringify(arr))
    for (let i = 0; i < index; i++) {
      let item = data[i].item_data
      item = JSON.parse(item)
      const maxTop = item.top + item.height
      if (top < maxTop) {
        top = maxTop
      }
    }
    return top
  },

  saveDragSimsviewData (id, item) {
    let dragData = sessionStorage.getItem('Drag_Simsview_Data')
    if (dragData === null) {
      dragData = {}
    } else {
      dragData = JSON.parse(dragData)
    }
    dragData[id] = item
    dragData = JSON.stringify(dragData)
    sessionStorage.setItem('Drag_Simsview_Data', dragData)
  },

  fileUploadPicurlBefore (file, maxSize) {
    const type = file.name.substring(file.name.lastIndexOf('.') + 1)
    const size = file.size / 1024
    const typeState = type === 'png' || type === 'PNG' || type === 'jpg' || type === 'JPG' || type === 'jpeg' || type === 'JPEG'
    const sizeState = size <= maxSize
    if (!typeState) {
      return 1
    }
    if (!sizeState) {
      return 2
    }
    return 3
  },

  updateTempData (row) {
    return new Promise(async (resolve, reject) => {
      let s = true
      let itemData = row.item_data
      if (itemData !== '') {
        itemData = JSON.parse(itemData)
        let newProductArr = {}
        let productString = ''
        let packetString = ''
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
        if (productString !== '') {
          let res = await this.batchHttp(productString)
          if (res.data.success) {
            let productRes = res.data.message
            for (let i = 0; i < productRes.length; i++) {
              if (productRes[i].expiry_status === 1) {
                newProductArr[productRes[i].id] = productRes[i]
              }
            }
          } else {
            s = false
          }
        }
        if (packetString !== '') {
          let res = await this.batchpackHttp(packetString)
          if (res.data.success) {
            let packetRes = res.data.message
            for (let i = 0; i < packetRes.length; i++) {
              if (packetRes[i].expiry_status === 1) {
                newProductArr[packetRes[i].id] = packetRes[i]
                newProductArr[packetRes[i].id].name = newProductArr[packetRes[i].id].name + '（套餐）'
                newProductArr[packetRes[i].id].sell_price = newProductArr[packetRes[i].id].buy_price = newProductArr[packetRes[i].id].pack_price
              }
            }
          } else {
            s = false
          }
        }
        if (s) {
          let newSimsViewData = []
          for (let i = 0; i < itemData.length; i++) {
            let specialType = itemData[i].special_type
            if (specialType === 'menu-product-one' || specialType === 'menu-product-two' || specialType === 'product-custom') {
              let comData = itemData[i].comData
              comData = JSON.parse(comData)
              let product = comData.comData
              comData.comData = []
              for (let p = 0; p < product.length; p++) {
                let oldCurrProduct = newProductArr[product[p].id]
                if (oldCurrProduct) {
                  product[p] = Object.assign({}, product[p], {
                    category_id: oldCurrProduct.category_id,
                    cname: oldCurrProduct.cname
                  })
                  let attr = product[p].attr
                  for (let a = 0; a < attr.length; a++) {
                    attr[a].val = oldCurrProduct[attr[a].tname]
                  }
                  product[p].attr = attr
                  comData.comData.push(product[p])
                }
              }
              let length = comData.comData.length
              comData = JSON.stringify(comData)
              itemData[i].comData = comData
              if (length > 0) {
                newSimsViewData.push(itemData[i])
              }
            } else if (specialType === 'menu-custom') {
              let oldCom = []
              let comData = itemData[i].comData
              comData = JSON.parse(comData)
              let productData = comData.comData.product.data
              for (let pd = 0; pd < productData.length; pd++) {
                let product = productData[pd].data
                for (let p = 0; p < product.length; p++) {
                  let oldCurrProduct = newProductArr[product[p].id]
                  if (oldCurrProduct) {
                    product[p] = Object.assign({}, product[p], {
                      category_id: oldCurrProduct.category_id,
                      cname: oldCurrProduct.cname
                    })
                    let attr = product[p].attr
                    for (let a = 0; a < attr.length; a++) {
                      attr[a].val = oldCurrProduct[attr[a].tname]
                    }
                    product[p].attr = attr
                    oldCom.push(product[p])
                  }
                }
              }
              let _oldData = JSON.parse(JSON.stringify(productData))
              let oldIndex = 0
              let _oldIndex = 0
              let oldLength = productData.length
              for (let i = 0; i < oldLength; i++) {
                let newLength = productData[i].data.length
                let newIndex = 0
                for (let j = 0; j < newLength; j++) {
                  if (oldIndex < oldCom.length) {
                    newIndex++
                    _oldData[i].data[j] = Object.assign({}, _oldData[i].data[j], { attr: oldCom[oldIndex].attr, category_id: oldCom[oldIndex].category_id, cname: oldCom[oldIndex].cname, id: oldCom[oldIndex].id, packet_id: oldCom[oldIndex].packet_id })
                  } else {
                    productData[i].data.splice(newIndex, 1)
                  }
                  oldIndex++
                }
                if (productData[i].data.length === 0) {
                  _oldData.splice(_oldIndex, 1)
                } else {
                  _oldIndex++
                  _oldData[i].data.length = productData[i].data.length
                }
              }
              let length = oldCom.length
              comData.comData.product.data = _oldData
              comData = JSON.stringify(comData)
              itemData[i].comData = comData
              if (length > 0) {
                newSimsViewData.push(itemData[i])
              }
            } else {
              newSimsViewData.push(itemData[i])
            }
          }
          let tempData = {
            sims_wh: row.sims_wh,
            id: row.id,
            item_name: row.item_name,
            item_data: JSON.stringify(newSimsViewData)
          }
          let res = await this.createTemplate(tempData)
          if (!res.data.success) {
            s = false
          }
        }
      }
      if (s) {
        resolve(s)
      } else {
        reject(s)
      }
    })
  },

  batchHttp (id) {
    return http.get('/product/batch?id=' + id)
  },

  batchpackHttp (id) {
    return http.get('/product/batchpack?id=' + id)
  },

  async showHttp (url) {
    return http.get(url)
  },
  async getShow (page = 1, perpage = 5) {
    const url = '/tempshow/' + '?page=' + page + '&per_page=' + perpage
    let res = await this.showHttp(url)
    return res
  },

  async modelListHttp (url) {
    return http.get(url)
  },
  async getModelList (page = 1, perpage = 5) {
    const url = '/tempshow/listAll/' + '?page=' + page + '&per_page=' + perpage
    let res = await this.modelListHttp(url)
    return res
  },

  async createModelHttp (data) {
    return http.post('/tempshow/templateStore', data)
  },
  async createModel (data) {
    let res = await this.createModelHttp(data)
    return res
  },

  async createTemplateHttp (data) {
    return http.post('/tempshow/store', data)
  },
  async createTemplate (data) {
    let res = await this.createTemplateHttp(data)
    return res
  },

  async removeSimsViewHttp (id) {
    return http.delete(`/tempshow/${id}`)
  },
  async removeSimsViewModel (id) {
    let res = await this.removeSimsViewHttp(id)
    return res
  },

  async removeModelHttp (id) {
    return http.delete(`/tempshow/templateDel/${id}`)
  },
  async removeModel (id) {
    let res = await this.removeModelHttp(id)
    return res
  },

  async commitDragHttp (data) {
    return http.post('/tempshow/multEdit', data)
  },
  async commitDragModel (data) {
    let res = await this.commitDragHttp(data)
    return res
  },

  async getProductsListHttp (url) {
    return http.get(url)
  },
  async getProductsList (page = 1, perpage = 5) {
    let url = '/products/' + '?page=' + page + '&per_page=' + perpage + '&issale=1&expiry_date=1'
    let res = await this.getProductsListHttp(url)
    return res
  },

  async getPacketsListHttp (url) {
    return http.get(url)
  },
  async getPacketsList (page = 1, perpage = 5) {
    let url = '/products/pagepackets/' + '?page=' + page + '&per_page=' + perpage + '&issale=1&expiry_date=1'
    let res = await this.getPacketsListHttp(url)
    return res
  },

  async getAllButeHttp () {
    return http.get('/products/attributes/getAllBute')
  },
  async getAllBute () {
    let res = await this.getAllButeHttp()
    return res
  },

  async getModelShowHttp (id) {
    return http.get(`/tempshow/itemlist/${id}`)
  },
  async getModelShow (id) {
    let res = await this.getModelShowHttp(id)
    return res
  },

  async onlineHttp (data) {
    return http.post('/tempshow/online', data)
  },
  async modelOnline (data) {
    let res = await this.onlineHttp(data)
    return res
  },

  async removeTempHttp (id) {
    return http.delete(`/tempshow/${id}`)
  },
  async removeTemp (id) {
    let res = await this.removeTempHttp(id)
    return res
  },

  async getTerminalsTreesHttp () {
    return http.get('/trees')
  },
  async getTerminalsTrees () {
    let res = await this.getTerminalsTreesHttp()
    return res
  },

  async getTerminalsItemHttp () {
    return http.get('/terminals?branch=1')
  },
  async getTerminalsItem () {
    let res = await this.getTerminalsItemHttp()
    return res
  },

  async commitTerminalsHttp (data) {
    return http.post('/tempshow/union', data)
  },
  async commitTerminals (data) {
    let res = await this.commitTerminalsHttp(data)
    return res
  },

  async getMaterialDirectoriesHttp () {
    return http.get('/directories')
  },
  async getMaterialDirectories () {
    let res = await this.getMaterialDirectoriesHttp()
    return res
  }
}

export {
  Terminaltemp
}
