import {createStore} from 'vuex'

export default createStore({
    state: {
        webConfig: {},
    },
    getters: {
        getWebConfig: (state) => () => {
            return state.webConfig
        },
    },
    mutations: {
        setWebConfig(state, webConfig) {
            state.webConfig = webConfig
            document.title = state.webConfig.webTitle
        },
    },
    actions: {},
    modules: {}
})
