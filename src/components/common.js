import {axiosForm, axiosGet, axiosJson, redirect} from '@/utils/request'

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
    }
}
