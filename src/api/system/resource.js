import request from '@/utils/request'

const resourceApi = {
  // 获取资源树形结构列表
  FetchResouceTree : '/lzy-service-system/resource/tree',
  // 修改资源状态
  ResourceStatusUpdate: '/lzy-service-system/resource/status/',
  // 新增资源
  ResourceCreate: '/lzy-service-system/resource/create',
  //检查资源标识是否存在
  ResourceKeyCheck: '/lzy-service-system/resource/check',
  // 删除资源
  ResourceDelete: '/lzy-service-system/resource/delete/',
  // 修改资源
  ResourceUpdate: '/lzy-service-system/resource/update',
}

export default { resourceApi }

export function fetchResourceTree(data) {
  return request({
    url: resourceApi.FetchResouceTree,
    method: 'get',
    params: data
  })
}

export function updateResourceStatus(resourceId, status) {
  return request({
    url: resourceApi.ResourceStatusUpdate + resourceId + '/' + status,
    method: 'post'
  })
}

export function createResource(data) {
  return request({
    url: resourceApi.ResourceCreate,
    method: 'post',
    data
  })
}

export function checkResourceExist(data) {
  return request({
    url: resourceApi.ResourceKeyCheck,
    method: 'post',
    params: data
  })
}

export function deleteResource(id) {
  return request({
    url: resourceApi.ResourceDelete + id,
    method: 'post'
  })
}

export function updateResource(data) {
  return request({
    url: resourceApi.ResourceUpdate,
    method: 'post',
    data
  })
}


