import {axiosForm, axiosGet, axiosJson, axiosUploadFile, redirect} from '@/utils/request'

export default {
    redirect() {
        redirect();
    },
    axiosForm(url, data, isLoading, headers) {
        return axiosForm(url, data, isLoading, headers);
    },
    axiosJson(url, data, isLoading, headers) {
        return axiosJson(url, data, isLoading, headers);
    },
    axiosGet(url, isLoading) {
        return axiosGet(url, isLoading);
    },
    axiosUploadFile(url, data, onUploadProgress, headers) {
        return axiosUploadFile(url, data, onUploadProgress, headers);
    },
    getCookies(name) {
        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='));
        return value ? decodeURIComponent(value.split('=')[1]) : null;
    },
    formatSize(bytes) {
        if (bytes < 1024) return bytes + 'B'
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB'
        else if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + 'MB'
        else return (bytes / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    },
}
