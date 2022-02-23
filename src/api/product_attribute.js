import request from '@/utils/request'

export function addProductAttr(data) {
    return request({
        url: "/product/productAttribute/add",
        method: "post",
        data
    })
}

export function updateProductAttr(data) {
    return request({
        url: "/product/productAttribute/update",
        method: "post",
        data
    })
}

export function getProductAttrList(data) {
    return request({
        url: "/product/productAttribute/list",
        method: "get",
        params: data
    })
}

export function delteProductAttr(data) {
    return request({
        url:"/product/productAttribute/delete",
        method:"post",
        data
    })
}

export function getProductAttrInfo(data) {
    return request({
        url: "/product/productAttribute/info",
        method: "get",
        params: data
    })
}
