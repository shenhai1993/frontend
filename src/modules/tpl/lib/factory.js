'use strict'

class TypeFactory {
  static get (type) {
    try {
      const model = require(`./model/${type}`)

      return model[type]
    } catch (e) {
      console.log(e.message)
    }

    return null
  }
}

export default TypeFactory
