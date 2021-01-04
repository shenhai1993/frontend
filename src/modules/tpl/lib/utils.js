'use strict'

export const getZoomRate = function (container, direction) {
  let rate = 1

  if (direction === 0) { // 横屏
    rate = floor(container.width() / 1920 * 10) / 10

    if (container.height() < (1920 * rate)) {
      rate -= 0.1
    }
  } else {
    rate = floor(container.height() / 1920 * 10) / 10
  }

  // 0.4 <= rate <= 1
  return rate < 0.3 ? 0.3 : (rate > 1) ? 1 : rate
}

export const floor = function (float) {
  return Math.floor(float)
}
