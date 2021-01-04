'use strict'

import http from '../../../../../static/js/utils/http'

class Element {
  constructor () {
    return null
  }

  static async createStream (name, type, path, groupId, directoryId) {
    let res = await http.post('elements', { 'name': name, 'type': type, 'path': path, 'groupId': groupId, 'directoryId': directoryId })

    return res
  }

  static async modifyStream (id, name, path) {
    let res = await http.put(`elements/${id}`, { 'id': id, 'name': name, 'path': path })

    return res
  }

  static async setFilename (id, name) {
    let res = await http.put(`elements/${id}`, { 'name': name })

    return res
  }

  static getFileList (type = 'all', id) {
    return new Promise((resolve, reject) => {
      let p = (type === 'all')
        ? http.get(`elements?directory_id=` + id)
        : http.get(`elements?directory_id=` + id + `&type=` + type)

      p.then((res) => {
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
      if (typeof data !== 'undefined') {
        data.id = file.id
        res.push(data)
      }
    }
    return res
  }
}

export default Element
