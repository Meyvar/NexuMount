import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from "./components/plugin"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'



const app = createApp(App)

for (let key in plugin) {
    app.config.globalProperties[key] = plugin[key]
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(store)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(Vue3VideoPlayer, {
        lang: 'zh-CN'
    })
    .mount('#app')
