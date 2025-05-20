import request from './request'

export function getInfo(data) {
  return request({
    url: '/api/users/page',
    data,
    method: 'get'
  })
}

export function uploadFile(data) {
  return request({
    url: '/upload/file',
    data,
    method: 'post'
  })
}