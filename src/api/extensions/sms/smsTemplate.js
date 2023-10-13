import request from '@/utils/request'

const smsTemplateApi = {
  // 查询短信模板列表
  FetchSmsTemplateList: '/lzy-service-extensions/extension/sms/template/list',
  // 查询全部短信模板
  FetchSmsTemplateAll: '/lzy-service-extensions/extension/sms/template/list/all',
  // 创建短信模板
  CreateSmsTemplate: '/lzy-service-extensions/extension/sms/template/create',
  // 修改短信模板
  UpdateSmsTemplate: '/lzy-service-extensions/extension/sms/template/update',
  // 启用/禁用 短信模板
  UpdateSmsTemplateStatus: '/lzy-service-extensions/extension/sms/template/status/',
  // 批量删除短信模板
  BatchDeleteSmsTemplate: '/lzy-service-extensions/extension/sms/template/batch/delete',
  // 删除短信模板
  DeleteSmsTemplate: '/lzy-service-extensions/extension/sms/template/delete/',
  // 校验短信模板是否存在
  CheckSmsTemplate: '/lzy-service-extensions/extension/sms/template/check'
}

export default { smsTemplateApi }

export function querySmsTemplateList(query) {
  return request({
    url: smsTemplateApi.FetchSmsTemplateList,
    method: 'get',
    params: query
  })
}

export function querySmsTemplateListAll(query) {
  return request({
    url: smsTemplateApi.FetchSmsTemplateAll,
    method: 'get',
    params: query
  })
}

export function createSmsTemplate(data) {
  return request({
    url: smsTemplateApi.CreateSmsTemplate,
    method: 'post',
    data
  })
}

export function updateSmsTemplate(data) {
  return request({
    url: smsTemplateApi.UpdateSmsTemplate,
    method: 'post',
    data
  })
}

export function updateSmsTemplateStatus(smsTemplateId, status) {
  return request({
    url: smsTemplateApi.UpdateSmsTemplateStatus + smsTemplateId + '/' + status,
    method: 'post'
  })
}

export function batchDeleteSmsTemplate(data) {
  return request({
    url: smsTemplateApi.BatchDeleteSmsTemplate,
    method: 'post',
    data
  })
}

export function deleteSmsTemplate(id) {
  return request({
    url: smsTemplateApi.DeleteSmsTemplate + id,
    method: 'post'
  })
}

export function checkSmsTemplateExist(data) {
  return request({
    url: smsTemplateApi.CheckSmsTemplate,
    method: 'post',
    data
  })
}

