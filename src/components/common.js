import {axiosForm, axiosGet, axiosJson, axiosUploadFile, redirect} from '@/utils/request'

export default {
    redirect() {
        redirect();
    },
    axiosForm(url, data, isLoading) {
        return axiosForm(url, data, isLoading);
    },
    axiosJson(url, data, isLoading) {
        return axiosJson(url, data, isLoading);
    },
    axiosGet(url, isLoading) {
        return axiosGet(url, isLoading);
    },
    axiosUploadFile(url, data, onUploadProgress, headers){
        return axiosUploadFile(url, data, onUploadProgress, headers);
    },
    getCookies(name) {
        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='));
        return value ? decodeURIComponent(value.split('=')[1]) : null;
    }
}
