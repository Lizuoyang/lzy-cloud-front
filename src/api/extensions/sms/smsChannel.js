import request from '@/utils/request'

const smsChannelApi = {
  // 查询短信渠道列表
  FetchSmsChannelList: '/lzy-service-extensions/extension/sms/channel/list',
  // 查询全部短信渠道
  FetchSmsChannelAll: '/lzy-service-extensions/extension/sms/channel/list/all',
  // 创建短信渠道
  CreateSmsChannel: '/lzy-service-extensions/extension/sms/channel/create',
  // 修改短信渠道
  UpdateSmsChannel: '/lzy-service-extensions/extension/sms/channel/update',
  // 启用/禁用 短信渠道
  UpdateSmsChannelStatus: '/lzy-service-extensions/extension/sms/channel/status/',
  // 批量删除短信渠道
  BatchDeleteSmsChannel: '/lzy-service-extensions/extension/sms/channel/batch/delete',
  // 删除短信渠道
  DeleteSmsChannel: '/lzy-service-extensions/extension/sms/channel/delete/',
  // 校验短信渠道是否存在
  CheckSmsChannel: '/lzy-service-extensions/extension/sms/channel/check',
}

export default {smsChannelApi}

export function querySmsChannelList (query) {
  return request({
    url: smsChannelApi.FetchSmsChannelList,
    method: 'get',
    params: query
  })
}

export function querySmsChannelListAll (query) {
  return request({
    url: smsChannelApi.FetchSmsChannelAll,
    method: 'get',
    params: query
  })
}

export function createSmsChannel (data) {
  return request({
    url: smsChannelApi.CreateSmsChannel,
    method: 'post',
    data
  })
}

export function updateSmsChannel (data) {
  return request({
    url: smsChannelApi.UpdateSmsChannel,
    method: 'post',
    data
  })
}

export function updateSmsChannelStatus (smsChannelId, status) {
  return request({
    url: smsChannelApi.UpdateSmsChannelStatus + smsChannelId + '/' + status,
    method: 'post'
  })
}

export function batchDeleteSmsChannel (data) {
  return request({
    url: smsChannelApi.BatchDeleteSmsChannel,
    method: 'post',
    data
  })
}

export function deleteSmsChannel (id) {
  return request({
    url: smsChannelApi.DeleteSmsChannel + id,
    method: 'post'
  })
}

export function checkSmsChannelExist (data) {
  return request({
    url: smsChannelApi.CheckSmsChannel,
    method: 'post',
    data
  })
}

