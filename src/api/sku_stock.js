import request from '@/utils/request'

export function getSkuStockList(data) {
    return request({
        url: "/product/sku/list",
        method: "GET",
        params: data
    })
}

export function updateSkuStockList(data) {
    return request({
        url: "/product/sku/update",
        method:"POST",
        data
    })
}