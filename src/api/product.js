import request from '@/utils/request';

export function getProductList(data) {
    return request({
        url:"/product/product/list",
        method: "GET",
        params: data
    })
}

export function getProductInfo(data) {
    return request({
        url:"/product/product/info",
        method: "GET",
        params: data
    })
}

export function createProduct(data) {
    return request({
        url:"/product/product/add",
        method: "POST",
        data
    })
}


export function updateProduct(data) {
    return request({
        url:"/product/product/update",
        method: "POST",
        data
    })
}

export function changePublishStatus(data) {
    return request({
        url:"/product/product/change/publish-status",
        method: "POST",
        data
    })
}

export function changeVerifyStatus(data) {
    return request({
        url:"/product/product/change/verify-status",
        method: "POST",
        data
    })
}

export function changeNewStatus(data) {
    return request({
        url:"/product/product/change/new-status",
        method: "POST",
        data
    })
}

export function changeRecommendStatus(data) {
    return request({
        url:"/product/product/change/recommend-status",
        method: "POST",
        data
    })
}

export function deleteProduct(data) {
    return request({
        url:"/product/product/delete",
        method: "post",
        data
    })
}
