import Vue from 'nativescript-vue'

import Gig from './components/Gig'

new Vue({
  render: h => h('frame', [h(Gig)])
}).$start()