import request from '@/utils/request'

export function editAttr(data) {
    return request({
        url: "/product/categoryAttribute/edit",
        method: "post",
        data
    })
}

export function getList(data) {
    return request({
        url: "/product/categoryAttribute/list", 
        method:"get",
        params: data
    })
}

export function delCategoryAttr(data) {
    return request({
        url:"/product/categoryAttribute/delete",
        method: "post",
        data
    })
}

//查询分类下的商品属性
export function getCategoryAttrAndProductAttr(data) {
    return request({
        url:"/product/categoryAttribute/and/product/attr",
        method:"get",
        params: data
    })
}