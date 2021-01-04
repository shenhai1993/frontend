'use strict'

class RefLine {
  constructor (options = {}) {
    this.options = Object.assign({
      gap: 3
    }, options)

    this._init()
  }

  _init () {
    this.lines = {
      xt: null,
      xc: null,
      xb: null,
      yl: null,
      yc: null,
      yr: null
    }

    this.cvsLeft = this.options.container.offsetLeft
    this.cvsTop = this.options.container.offsetTop

    // 置入参考线
    for (let p in this.lines) {
      let node = this.lines[p] = document.createElement('div')

      node.classList.add('ref-line', p)
      node.style.cssText = `
        position: absolute;
        display: none;
        opacity: 0.7;
        background: #4DAEFF;
        z-index: 199111250;
        ${p[0] === 'x' ? 'width: 100%; height: 1px; left: 0;' : 'width: 1px; height: 100%; top: 0;'}`

      // 挂上一些辅助方法
      node.show = function () {
        this.style.display = 'block'
      }
      node.hide = function () {
        this.style.display = 'none'
      }
      node.isShow = function () {
        return this.style.display !== 'none'
      }
      // document.getElementById(this.options.container).appendChild(node)
      this.options.container.appendChild(node)
    }
  }

  /**
   * @param dragNode {Element} 拖拽元素的原生node
   * @param checkNodes {String|Element} 选择器 或者 原生node集合
   */
  check (dragNode, checkNodes) {
    checkNodes = typeof checkNodes === 'string' ? document.querySelectorAll(checkNodes) : checkNodes
    let dragRect = dragNode.getBoundingClientRect()

    this.uncheck()
    Array.from(checkNodes).forEach((item) => {
      item.classList.remove('ref-line-active')

      if (item === dragNode) return
      let {
        top,
        height,
        bottom,
        left,
        width,
        right
      } = item.getBoundingClientRect()
      let dragWidthHalf = dragRect.width / 2
      let itemWidthHalf = width / 2
      let dragHeightHalf = dragRect.height / 2
      let itemHeightHalf = height / 2

      let conditions = {
        top: [
          // xt-top
          {
            isNearly: this._isNearly(dragRect.top, top),
            lineNode: this.lines.xt,
            lineValue: top - this.cvsTop,
            dragValue: top
          },
          // xt-bottom
          {
            isNearly: this._isNearly(dragRect.bottom, top),
            lineNode: this.lines.xt,
            lineValue: top - this.cvsTop,
            dragValue: top - dragRect.height
          },
          // xc
          {
            isNearly: this._isNearly(dragRect.top + dragHeightHalf, top + itemHeightHalf),
            lineNode: this.lines.xc,
            lineValue: top + itemHeightHalf - this.cvsTop,
            dragValue: top + itemHeightHalf - dragHeightHalf
          },
          // xb-top
          {
            isNearly: this._isNearly(dragRect.bottom, bottom),
            lineNode: this.lines.xb,
            lineValue: bottom - this.cvsTop,
            dragValue: bottom - dragRect.height
          },
          // xb-bottom
          {
            isNearly: this._isNearly(dragRect.top, bottom),
            lineNode: this.lines.xb,
            lineValue: bottom - this.cvsTop,
            dragValue: bottom
          }
        ],

        left: [
          // yl-left
          {
            isNearly: this._isNearly(dragRect.left, left),
            lineNode: this.lines.yl,
            lineValue: left - this.cvsLeft,
            dragValue: left
          },
          // yl-right
          {
            isNearly: this._isNearly(dragRect.right, left),
            lineNode: this.lines.yl,
            lineValue: left - this.cvsLeft,
            dragValue: left - dragRect.width
          },
          // yc
          {
            isNearly: this._isNearly(dragRect.left + dragWidthHalf, left + itemWidthHalf),
            lineNode: this.lines.yc,
            lineValue: left + itemWidthHalf - this.cvsLeft,
            dragValue: left + itemWidthHalf - dragWidthHalf
          },
          // yr-left
          {
            isNearly: this._isNearly(dragRect.right, right),
            lineNode: this.lines.yr,
            lineValue: right - this.cvsLeft,
            dragValue: right - dragRect.width
          },
          // yr-right
          {
            isNearly: this._isNearly(dragRect.left, right),
            lineNode: this.lines.yr,
            lineValue: right - this.cvsLeft,
            dragValue: right
          }
        ]
      }

      for (let key in conditions) {
        // 遍历符合的条件并处理
        conditions[key].forEach((condition) => {
          if (!condition.isNearly) return

          item.classList.add('ref-line-active')
          dragNode.style[key] = `${condition.dragValue}px`
          condition.lineNode.style[key] = `${condition.lineValue}px`
          condition.lineNode.show()
        })
      }
    })
  }

  uncheck () {
    Object.values(this.lines).forEach((item) => item.hide())
    Array.from(document.querySelectorAll('.ref-line-active')).forEach((item) => item.classList.remove('ref-line-active'))
  }

  _isNearly (dragValue, targetValue) {
    return Math.abs(dragValue - targetValue) <= this.options.gap
  }
}

export default RefLine
