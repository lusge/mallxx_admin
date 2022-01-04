import request from '@/utils/request'

export function getMemberLevelList(data) {
    return request({
        url:"/member/level/list",
        method:"GET",
        data
    })
}