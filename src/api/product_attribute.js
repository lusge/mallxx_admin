import request from '@/utils/request'

export function addProductAttr(data) {
    return request({
        url: "/product/attr/add",
        method: "post",
        data
    })
}

export function updateProductAttr(data) {
    return request({
        url: "/product/attr/update",
        method: "post",
        data
    })
}

export function getProductAttrList(data) {
    return request({
        url: "/product/attr/list",
        method: "get",
        params: data
    })
}

export function delteProductAttr(data) {
    return request({
        url:"/product/attr/delete",
        method:"delete",
        data
    })
}

export function getProductAttrInfo(data) {
    return request({
        url: "/product/attr/info",
        method: "get",
        params: data
    })
}
