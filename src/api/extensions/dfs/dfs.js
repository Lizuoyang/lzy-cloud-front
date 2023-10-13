import request from '@/utils/request'

const dfsApi = {
  QueryDfsList: '/lzy-service-extensions/extension/dfs/list',
  CreateDfs: '/lzy-service-extensions/extension/dfs/create',
  UpdateDfs: '/lzy-service-extensions/extension/dfs/update',
  UpdateDfsStatus: '/lzy-service-extensions/extension/dfs/status/',
  UpdateDfsDefault: '/lzy-service-extensions/extension/dfs/default/',
  BatchDeleteDfs: '/lzy-service-extensions/extension/dfs/batch/delete',
  DeleteDfs: '/lzy-service-extensions/extension/dfs/delete/',
  CheckDfsExist: '/lzy-service-extensions/extension/dfs/check',
  QueryDefaultDfs: '/lzy-service-extensions/extension/dfs/query/default',
}

export function queryDfsList (query) {
  return request({
    url: dfsApi.QueryDfsList,
    method: 'get',
    params: query
  })
}

export function createDfs (data) {
  return request({
    url: dfsApi.CreateDfs,
    method: 'post',
    data
  })
}

export function updateDfs (data) {
  return request({
    url: dfsApi.UpdateDfs,
    method: 'post',
    data
  })
}

export function updateDfsStatus (dfsId, dfsStatus) {
  return request({
    url: dfsApi.UpdateDfsStatus + dfsId + '/' + dfsStatus,
    method: 'post'
  })
}

export function updateDfsDefault (dfsId) {
  return request({
    url: dfsApi.UpdateDfsDefault + dfsId,
    method: 'post'
  })
}

export function batchDeleteDfs (data) {
  return request({
    url: dfsApi.BatchDeleteDfs,
    method: 'post',
    data
  })
}

export function deleteDfs (id) {
  return request({
    url: dfsApi.DeleteDfs + id,
    method: 'post'
  })
}

export function checkDfsExist (data) {
  return request({
    url: dfsApi.CheckDfsExist,
    method: 'post',
    data
  })
}

export function queryDefaultDfs () {
  return request({
    url: dfsApi.QueryDefaultDfs,
    method: 'get'
  })
}
