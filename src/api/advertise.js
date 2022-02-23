import request from '@/utils/request';

export function getAdList(data) {
    return request({
        url:"/advertise/admin/list",
        method: "GET",
        params: data
    })
}

export function addAd(data) {
    return request({
        url:"/advertise/add",
        method: "POST",
        data
    })
}

export function updateAd(data) {
    return request({
        url:"/advertise/update",
        method: "POST",
        data
    })
}

export function deteleAd(data) {
    return request({
        url:"/advertise/delete",
        method: "POST",
        data
    })
}

export function getInfo(data) {
    return request({
        url:"/advertise/info",
        method: "GET",
        params: data
    })
}