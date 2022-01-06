import request from '@/utils/request';

export function getAdList(data) {
    return request({
        url:"/advertisement/list",
        method: "GET",
        params: data
    })
}

export function addAd(data) {
    return request({
        url:"/advertisement/add",
        method: "POST",
        data
    })
}

export function updateAd(data) {
    return request({
        url:"/advertisement/update",
        method: "POST",
        data
    })
}

export function deteleAd(data) {
    return request({
        url:"/advertisement/delete",
        method: "DELETE",
        data
    })
}

export function getInfo(data) {
    return request({
        url:"/advertisement/info",
        method: "GET",
        params: data
    })
}