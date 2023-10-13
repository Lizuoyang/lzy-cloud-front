import request from '@/utils/request'


//获取验证图片  以及token
export function reqGet(data) {
  return request({
    url: '/lzy-oauth/oauth/captcha',
    method: 'post',
    data
  })
}

//滑动或者点选验证
export function reqCheck(data) {
  return request({
    url: '/lzy-oauth/oauth/captcha/check',
    method: 'post',
    data
  })
}
