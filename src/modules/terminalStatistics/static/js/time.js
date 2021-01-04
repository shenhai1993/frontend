class Time {
  /**
   * 设置默认时间
   */
  getTimeFn () {
    let time = []
    const that = this
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    time[0] = that.formatDate(start)
    time[1] = that.formatDate(end)
    return time
  }
  /**
   * 格式化时间
   */
  formatDate (date) {
    let myyear = date.getFullYear()
    let mymonth = date.getMonth() + 1
    let myweekday = date.getDate()

    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    return myyear + '-' + mymonth + '-' + myweekday
  }
}
let setTime = new Time()
export {setTime}
