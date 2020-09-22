import Vue from 'nativescript-vue'

import GigHost from './components/GigHost'
import GigGuest from './components/GigGuest'

Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
)

new Vue({
  render: h => h('frame', [h(GigGuest)])
}).$start()