'use strict'

const floatCount = {
  accAdd (v1, v2) {
    let r1 = 0
    let r2 = 0
    let m = 0
    let c = 0
    try {
      r1 = v1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = v2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    c = Math.abs(r1 - r2)
    if (c > 0) {
      const cm = Math.pow(10, c)
      if (r1 > r2) {
        v1 = Number(v1.toString().replace('.', ''))
        v2 = Number(v2.toString().replace('.', '')) * cm
      } else {
        v1 = Number(v1.toString().replace('.', '')) * cm
        v2 = Number(v2.toString().replace('.', ''))
      }
    } else {
      v1 = Number(v1.toString().replace('.', ''))
      v2 = Number(v2.toString().replace('.', ''))
    }
    return (v1 + v2) / m
  },

  accSub (v1, v2) {
    let r1 = 0
    let r2 = 0
    let m = 0
    let n = 0
    try {
      r1 = v1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = v2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = Math.max(r1, r2)
    return ((v1 * m - v2 * m) / m).toFixed(n)
  },

  accMul (v1, v2) {
    const s1 = v1.toString()
    const s2 = v2.toString()
    let m = 0
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },

  accDiv (v1, v2) {
    let t1 = 0
    let t2 = 0
    let r1 = 0
    let r2
    try {
      t1 = v1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = v2.toString().split('.')[1].length
    } catch (e) {}
    r1 = Number(v1.toString().replace('.', ''))
    r2 = Number(v2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  }
}

export {
  floatCount
}
