import request from '@/utils/request'

const dictApi = {
  // 获取数据字典列表
  FetchDictTree : '/lzy-service-base/dict/list',
  // 根据key查询数据字典列表
  ListDict : '/lzy-service-base/dict/query/',
  // 创建数据字典
  CreateDict : '/lzy-service-base/dict/create',
  // 修改数据字典
  UpdateDict : '/lzy-service-base/dict/update',
  // 删除数据字典
  DeleteDict : '/lzy-service-base/dict/delete/',
  // 批量查询数据字典
  BatchListDict : '/lzy-service-base/dict/batch/query',
}

export default { dictApi }

export function fetchList(data) {
  return request({
    url: dictApi.FetchDictTree,
    method: 'get',
    params: data
  })
}

export function listDict (dictCode) {
  return request({
    url: dictApi.ListDict + dictCode,
    method: 'post'
  })
}

export function createDict(data) {
  return request({
    url: dictApi.CreateDict,
    method: 'post',
    data
  })
}

export function updateDict(data) {
  return request({
    url: dictApi.UpdateDict,
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: dictApi.DeleteDict + id,
    method: 'post'
  })
}

export function batchListDict (data) {
  return request({
    url: dictApi.BatchListDict,
    method: 'post',
    data
  })
}
