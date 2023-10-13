import { validUsername, isExternal } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('editor')).toBe(true)
    expect(validUsername('xxxx')).toBe(false)
  })
  it('isExternal', () => {
    expect(isExternal('https://gitee.com/lizuoyang/lzy-cloud-front')).toBe(true)
    expect(isExternal('https://gitee.com/lizuoyang/lzy-cloud-front')).toBe(true)
    expect(isExternal('https://gitee.com/lizuoyang/lzy-cloud-front')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
})
