import axios from 'axios'
import router from '../router/index.js'
import Qs from "qs";
import {ElLoading, ElMessage} from "element-plus";

// 重定向到登录页后重置用户信息
export function redirect() {
    localStorage.removeItem("userInfo");
}

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 基路径
    withCredentials: true, // 跨域请求时发送Cookie
})

let loading = null;

// response 拦截
service.interceptors.response.use(resp => {
        if (loading != null) {
            loading.close();
        }
        if (resp.data.code === 401) {
            redirect()
            router.replace({path: '/login'})
            //退出登录后，禁止点击浏览器返回按钮，返回到系统内部页面
            history.pushState(null, null, document.URL)
            window.addEventListener(
                'popstate',
                function () {
                    history.pushState(null, null, document.URL)
                },
                false
            )
        } else if (resp.data.code === 403) {
            router.go(-1)
            ElMessage.error('当前账号无权访问！')
        }
        return Promise.resolve(resp.data)
    }, error => {
        redirect()
        if (loading != null) {
            loading.close();
        }
        return Promise.reject(error)
    }
)


function uploadFile(url, data, onUploadProgress, headers = {}) {
    return service.post(url, data, {headers: {"Content-Type": "multipart/form-data", ...headers}, onUploadProgress})
}

function axiosPost(url, data, isForm, isLoading) {
    if (isLoading) {
        loading = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
        });
    }
    if (isForm) {
        data = Qs.stringify(data);
    }
    return service.post(url, data)
}

function get(url, isLoading) {
    if (isLoading) {
        loading = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
        });
    }
    return service.get(url)
}

export function axiosForm(url, data, isLoading) {
    return axiosPost(url, data, true, isLoading);
}


export function axiosJson(url, data, isLoading) {
    return axiosPost(url, data, false, isLoading);
}

export function axiosGet(url, isLoading) {
    return get(url, isLoading)
}

export function axiosUploadFile(url, data, onUploadProgress, headers) {
    return uploadFile(url, data, onUploadProgress, headers)
}
