import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from "./components/plugin"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import vue3videoPlay from 'vue3-video-play' // 引入组件
import 'vue3-video-play/dist/style.css' // 引入css



const app = createApp(App)

for (let key in plugin) {
    app.config.globalProperties[key] = plugin[key]
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

if (process.env.NODE_ENV === 'development' || location.search.includes('debug')) {
    import('vconsole').then(module => {
        const VConsole = module.default
        new VConsole()
        console.log('✅ vConsole 已加载')
    })
}

app.use(store)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(vue3videoPlay)
    .mount('#app')
