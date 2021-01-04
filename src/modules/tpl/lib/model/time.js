'use strict'

import leftPad from 'left-pad'

let now = new Date()

export const time = {
  type: 'time',
  text: `${leftPad(now.getHours(), 2, '0')}:${leftPad(now.getMinutes(), 2, '0')}`,
  dragable: true,
  resizable: true,
  width: 130,
  height: 70,
  index: 100,
  file: false,
  color: '#FFFFFF',
  background: '#303133',
  fontsize: 35
}
