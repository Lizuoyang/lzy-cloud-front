import request from '@/utils/request'

const organizationApi = {
  // 获取资源树形结构列表
  FetchOrganizationTree : '/lzy-service-system/organization/tree',
  CreateOrganization : '/lzy-service-system/organization/create',
  UpdateOrganization : '/lzy-service-system/organization/update',
  DeleteOrganization : '/lzy-service-system/organization/delete/',
  UpdateOrganizationStatus : '/lzy-service-system/organization/status/',
  CheckOrganization : '/lzy-service-system/organization/check',

}

export default { organizationApi }

export function fetchOrgList(data) {
  return request({
    url: organizationApi.FetchOrganizationTree,
    method: 'get',
    params: data
  })
}

export function createOrganization(data) {
  return request({
    url: organizationApi.CreateOrganization,
    method: 'post',
    data
  })
}

export function updateOrganization(data) {
  return request({
    url: organizationApi.UpdateOrganization,
    method: 'post',
    data
  })
}

export function deleteOrganization(id) {
  return request({
    url: organizationApi.DeleteOrganization + id,
    method: 'post'
  })
}

export function updateOrganizationStatus(organizationId, status) {
  return request({
    url: organizationApi.UpdateOrganizationStatus + organizationId + '/' + status,
    method: 'post'
  })
}

export function checkOrganizationExist(data) {
  return request({
    url: organizationApi.CheckOrganization,
    method: 'post',
    data
  })
}
