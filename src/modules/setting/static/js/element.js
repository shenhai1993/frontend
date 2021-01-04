'use strict'

import http from '../../../../../static/js/utils/http'

class Element {
  constructor () {
    return null
  }

  static async createStream (name, type, path, groupId) {
    let res = await http.post('elements', { 'name': name, 'type': type, 'path': path, 'group_id': groupId })

    return res
  }

  static async modifyStream (id, name, path, groupId) {
    let res = await http.put(`elements/${id}`, { 'id': id, 'name': name, 'path': path, 'group_id': groupId })

    return res
  }

  static async setFilename (id, name, groupId) {
    let res = await http.put(`elements/${id}`, { 'name': name, 'group_id': groupId })

    return res
  }

  static getFileList (type = 'all', groupId) {
    return new Promise((resolve, reject) => {
      http.get(`elements`, { 'type': type, 'group_id': groupId })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  static async remove (files, groupId) {
    // let ids = []
    let res = []
    for (let file of files) {
      let data = await http.delete(`elements/${file.id}`, { group_id: groupId })
      data.id = file.id
      res.push(data)
    }
    return res
  }
}

export default Element
