import request from '@/utils/request'

export function addBrand(data) {
    return request({
        url:"/product/brand/add",
        method:"POST",
        data
    })
}

export function getBrandList(data) {
    return request({
        url: "/product/brand/list",
        method: "GET",
        params: data
    })
}

export function deleteBrand(data) {
    return request({
        url:"/product/brand/del",
        method:"DELETE",
        data
    })
}

export function updateBrand(data) {
    return request({
        url:"/product/brand/update",
        method:"POST",
        data
    })
}

export function changeBrandShowStatus(data) {
    return request({
        url:"/product/brand/change/show",
        method:"POST",
        data
    })
}

export function changeBrandFactoryStatus(data) {
    return request({
        url:"/product/brand/change/factory",
        method:"POST",
        data
    })
}

export function getBrandInfo(data) {
    return request({
        url: "/product/brand/info",
        method: "GET",
        params: data
    })
}