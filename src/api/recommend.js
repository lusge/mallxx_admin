import request from '@/utils/request';

export function getRecommendList(data) {
    return request({
        url:"/product/recommend/list",
        method:"get",
        params: data
    })
}

export function addRecommend(data) {
    return request({
        url:"/product/recommend/add",
        method:"post",
        data
    })
}


export function deleteRecommend(data) {
    return request({
        url:"/product/recommend/delete",
        method:"delete",
        data
    })
}


export function setRecommendSort(data) {
    return request({
        url:"/product/recommend/set/sort",
        method:"post",
        data
    })
}