import {createStore} from 'vuex'

export default createStore({
    state: {
        fileListMap: {},
    },
    getters: {
        getFileListMap: (state) => (path) => {
            return state.fileListMap[path]
        },
    },
    mutations: {
        setFileList(state, fileList) {
            state.fileListMap[fileList.path] = fileList.list
        },
    },
    actions: {},
    modules: {}
})
