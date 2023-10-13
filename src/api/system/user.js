import request from '@/utils/request'

const userApi = {
  // 获取用户信息
  UserInfo: '/lzy-system/account/user/info',
  // 新增用户
  UserCreate: '/lzy-service-system/user/create',
  // 修改用户
  UserUpdate: '/lzy-service-system/user/update',
  // 修改用户状态
  UserStatusUpdate: '/lzy-service-system/user/status/',
  // 删除用户
  UserDelete: '/lzy-service-system/user/delete/',
  // 获取用户列表
  FetchUserList: '/lzy-service-system/user/list',
  // 导出用户列表
  ExportUserList: '/lzy-excel-operate/export/system/user/list',
  // 查询用户账号是否已存在
  CheckUserExist: '/lzy-service-system/user/check',
  // 检查密码是否一致
  CheckPassword: '/lzy-service-system/user/check/password',
  // 修改用户数据权限
  UpdateDataPermission: '/lzy-service-system/user/update/organization/data/permission'

}

export default {userApi}

export function queryUserInfo(data) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    data
  })
}

export function fetchUserList(query) {
  return request({
    url: userApi.FetchUserList,
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: userApi.UserCreate,
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: userApi.UserUpdate,
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: userApi.UserDelete + id,
    method: 'post',
  })
}

export function updateStatus(userId, status) {
  return request({
    url: userApi.UserStatusUpdate  + userId + '/' + status,
    method: 'post',
  })
}

export function exportUserList(data) {
  return request({
    url: userApi.ExportUserList,
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function checkUserExist(data) {
  return request({
    url: userApi.CheckUserExist,
    method: 'post',
    data
  })
}

export function checkPassword(query) {
  return request({
    url: userApi.CheckPassword,
    method: 'get',
    params: query
  })
}

export function updateUserDataPermission(data) {
  return request({
    url: userApi.UpdateDataPermission,
    method: 'post',
    data
  })
}
