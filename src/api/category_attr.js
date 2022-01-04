import request from '@/utils/request'

export function editAttr(data) {
    return request({
        url: "/product/category/attr/edit",
        method: "post",
        data
    })
}

export function getList(data) {
    return request({
        url: "/product/category/attr/list", 
        method:"get",
        params: data
    })
}

export function delCategoryAttr(data) {
    return request({
        url:"/product/category/attr/delete",
        method: "delete",
        data
    })
}

//查询分类下的商品属性
export function getCategoryAttrAndProductAttr(data) {
    return request({
        url:"/product/categoryattr/productattr",
        method:"get",
        params: data
    })
}