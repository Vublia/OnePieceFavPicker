import './assets/main.css'

import { createApp } from 'vue'
import App from './My.vue'
import router from './router'

//imports the root component App from a single file component
  //tend to use a tree structure because trees :)
const app = createApp(App)

app.use(router)

//could also be <div id="app"></div>
app.mount('#app')
//const app2 = createApp(App)
//app2.mount('#container-2')

