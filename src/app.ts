import { createApp } from 'vue'
import { setupStore } from '@/stores'
import setNutUi from './nutui'
import './app.scss'
import util from '@/utils/util'

const App = createApp({
  mounted() {},
  onLaunch() {},
  onShow() {},
  onHide() {},
})
App.config.globalProperties.$utils = util
setNutUi(App)
setupStore(App)
export default App
