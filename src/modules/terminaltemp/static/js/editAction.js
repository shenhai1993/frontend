'use strict'

import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/resizable'
import 'jquery-ui/ui/widgets/sortable'

const EditAction = {
  Draggable (selector, opt) {
    const option = opt || {}
    $(selector).draggable({
      addClasses: false,
      containment: 'parent',
      cursor: 'move',
      grid: option.grid || [1, 1],
      axis: option.axis || false,
      stop: function (event, ui) {
        const _class = ui.helper[0].attributes['class'].value
        if (_class.search('simscoms') > -1) {
          window.getSimsActionData(event, ui)
        } else {
          window.getActionData(event, ui)
        }
      }
    })
  },

  Resizable (selector, handles) {
    $(selector).resizable({
      handles: handles || 'all',
      containment: 'parent',
      stop: function (event, ui) {
        window.getActionData(event, ui)
      }
    })
  },

  Sortable (selector, opt) {
    $(selector).sortable({
      distance: 20,
      axis: opt.axis || false,
      placeholder: opt.placeholder || '',
      update: opt.update || function (event, ui) {}
    }).disableSelection()
  }
}

export {
  EditAction
}
