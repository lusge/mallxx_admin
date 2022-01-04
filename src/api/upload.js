import request from '@/utils/request'

export function uploadFile(data) {
    return request({
        url:"/upload",
        method:"POST",
        data
    })
}