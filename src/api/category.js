import request from '@/utils/request';

export function getCategoryList(data) {
    return request({
        url:"/product/category/list",
        method:"GET",
        params: data
    })
}

export function getCategoryInfo(data) {
    return request({
        url:"/product/category/info",
        method:"GET",
        params: data
    })
}

export function changeCategoryNavStatus(data) {
    return request({
        url:"/product/category/changenavstatus",
        method:"post",
        data
    })
}

export function changeCategoryShowStatus(data) {
    return request({
        url:"/product/category/changeshowstatus",
        method:"post",
        data
    })
}

export function updateCategory(data) {
    return request({
        url:"/product/category/update",
        method: "post",
        data
    })
}

export function createCategory(data) {
    return request({
        url:"/product/category/create",
        method: "POST",
        data
    })
}

export function deleteCategory(data) {
    return request({
        url:"/product/category/del",
        method:"POST",
        data
    })
}

export function getCategoryListWithChildren() {
    return request({
        url:"/product/category/list/children",
        method:"GET"
    })
}