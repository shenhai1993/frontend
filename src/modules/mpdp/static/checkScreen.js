'user strict'

const CheckScreen = function (obj) {
  const tpl = obj
  const row = tpl.row
  const column = tpl.column
  const gw = tpl.gw
  const gh = tpl.gh
  let screenState = false
  let tableArr = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      let position = {
        tl: [i * gh, j * gw],
        tr: [i * gh, (j + 1) * gw],
        bl: [(i + 1) * gh, j * gw],
        br: [(i + 1) * gh, (j + 1) * gw]
      }
      let data = Object.assign({}, position, { state: false })
      tableArr.push(data)
    }
  }
  for (let i = 0; i < tpl.data.length; i++) {
    if (tpl.data[i].type !== 'video') {
      continue
    }
    const top = tpl.data[i].top
    const left = tpl.data[i].left
    const width = tpl.data[i].width
    const height = tpl.data[i].height
    let firstIndex = 0
    for (let j = 0; j < tableArr.length; j++) {
      const currScreen = tableArr[j]
      if (top >= currScreen.tl[0] && top < currScreen.bl[0] && left >= currScreen.tl[1] && left < currScreen.tr[1]) {
        firstIndex = j
        break
      }
    }
    let rowIndex = Math.floor(top / gh)
    let columnIndex = Math.floor(left / gw)
    let newTop = rowIndex * gh
    let newLeft = columnIndex * gw
    let rowNum = Math.ceil(((top + height) - newTop) / gh)
    let columnNum = Math.ceil(((left + width) - newLeft) / gw)
    for (let n = 0; n < rowNum; n++) {
      for (let m = 0; m < columnNum; m++) {
        let index = firstIndex + (n * column + m)
        if (tableArr[index].state) {
          return true
        } else {
          tableArr[index].state = true
        }
      }
    }
  }
  return screenState
}

export default CheckScreen
