import request from '@/utils/request'

const datapermissionApi = {
  // 查询数据权限配置表列表
  FentchDatapermissionList: '/lzy-service-system/data/permission/rule/list',
  // 添加数据权限配置表
  CreateDatapermission: '/lzy-service-system/data/permission/rule/create',
  // 修改数据权限配置表
  UpdateDatapermission: '/lzy-service-system/data/permission/rule/update',
  // 修改数据权限配置表状态
  UpdateDatapermissionStatus: '/lzy-service-system/data/permission/rule/status/',
  // 删除数据权限配置表
  BatchDeleteDatapermission: '/lzy-service-system/data/permission/rule/batch/delete',
  // 批量删除数据权限配置表
  DeleteDatapermission: '/lzy-service-system/data/permission/rule/delete/',
  // 校验数据权限配置表是否存在
  CheckDatapermission: '/lzy-service-system/data/permission/rule/check',
  // 获取拥有某个数据权限的所有角色列表
  FentchRoles: '/lzy-service-system/data/permission/rule/get/roles/',
  // 批量修改数据权限的角色列表
  UpdateRoles: '/lzy-service-system/data/permission/rule/batch/role/update'
}

export default { datapermissionApi }


export function queryDataPermissionRuleList(query) {
  return request({
    url: datapermissionApi.FentchDatapermissionList,
    method: 'get',
    params: query
  })
}

export function createDataPermissionRule (data) {
  return request({
    url: datapermissionApi.CreateDatapermission,
    method: 'post',
    data
  })
}

export function updateDataPermissionRule (data) {
  return request({
    url: datapermissionApi.UpdateDatapermission,
    method: 'post',
    data
  })
}

export function updateDataPermissionRuleStatus (dataPermissionRoleId, status) {
  return request({
    url: datapermissionApi.UpdateDatapermissionStatus + dataPermissionRoleId + '/' + status,
    method: 'post'
  })
}

export function batchDeleteDataPermissionRule (data) {
  return request({
    url: datapermissionApi.BatchDeleteDatapermission,
    method: 'post',
    data
  })
}

export function deleteDataPermissionRule (id) {
  return request({
    url: datapermissionApi.DeleteDatapermission + id,
    method: 'post'
  })
}

export function checkDataPermissionRuleExist (data) {
  return request({
    url: datapermissionApi.CheckDatapermission,
    method: 'post',
    data
  })
}

export function queryRuleDataPermission (permissionId) {
  return request({
    url: datapermissionApi.FentchRoles + permissionId,
    method: 'get'
  })
}

export function updateRuleDataPermission (data) {
  return request({
    url: datapermissionApi.UpdateRoles,
    method: 'post',
    data
  })
}
