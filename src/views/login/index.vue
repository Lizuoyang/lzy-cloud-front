<template>
  <div class="login" :style="loginBackGround">
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <img src="~@/assets/images/login-logo.png" alt="" width="200">
        </div>
      </div>
      <div class="mid">
        <el-form :model="loginForm"
                 :rules="loginRules"
                 ref="loginForm"
                 @keyup.enter.native="captchaVerify"
                 status-icon>
          <el-form-item prop="username">
            <el-input class="info"
                      v-model="loginForm.username"
                      placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="info"
                      v-model="loginForm.password"
                      :type="passwordType"
                      @keyup.enter.native="captchaVerify"
                      placeholder="密码">
              <template slot="append">
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-row :gutter="20" v-if="loginCaptchaType === 'image' && grantType !== 'password'">
              <el-col :span="14">
                <el-input v-model="loginForm.captchaCode"
                          @keyup.enter.native="captchaVerify"
                          placeholder="验证码">
                </el-input>
              </el-col>
              <el-col :span="10"
                      class="login-captcha">
                <img
                  :src="captchaImage"
                  class="v-code-img"
                  @click="refreshImageCode"
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <div class="item-btn">
              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                         @click.native.prevent="captchaVerify">登录</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="bottom">Copyright © 2023 仅供李佐洋个人学习使用</div>
    </div>
    <Verify
      ref="verify"
      :mode="'pop'"
      :captcha-type="'blockPuzzle'"
      :img-size="{ width: '330px', height: '155px' }"
      @success="verifySuccess"
    />
  </div>
</template>

<script>
  import md5 from 'md5'
  import Verify from '@/components/Verifition'
  import { getCaptchaType, getImageCaptcha } from '@/api/login'

  export default {
    components: {
      Verify
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value == '') {
          this.loginFormErrorMsg = '请输入账号'
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          this.loginFormErrorMsg = '请输入不小于6位的密码'
          callback(new Error('请输入不小于6位的密码'))
        } else {
          callback()
        }
      }
      const validateVCode = (rule, value, callback) => {
        if (value.length < 5) {
          this.loginFormErrorMsg = '请输入图片验证码'
          callback(new Error('请输入图片验证码'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '123456',
          captchaCode: '',
          sliding_type: 'blockPuzzle',
          grant_type: 'password'
        },
        loginFormErrorMsg: '',
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          captchaCode: [{ required: true, trigger: 'blur', validator: validateVCode }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        grantType: 'password',
        loginCaptchaType: 'sliding',
        slidingCaptchaType: 'blockPuzzle',
        captchaKey: '',
        captchaImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICRAEAOw==',
        loginBackGround: {
          backgroundImage: 'url(' + require('@/assets/images/login-bg.png') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }
      }
    },
    created() {
      this.queryCaptchaType()
      // window.addEventListener('storage', this.afterQRScan)
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    methods: {
      queryCaptchaType() {
        getCaptchaType().then(res => {
          this.loginCaptchaType = res.data
          if (this.loginCaptchaType === 'image') {
            this.grantType = 'captcha'
            this.refreshImageCode()
          }
        })
      },
      refreshImageCode() {
        getImageCaptcha().then(res => {
          const data = res.data
          this.captchaKey = data.captchaKey
          this.captchaImage = data.captchaImage
        })
      },
      verifySuccess(params) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // this.loginForm.grant_type = 'captcha'
            this.loginForm.client_id = process.env.VUE_APP_CLIENT_ID
            this.loginForm.client_secret = process.env.VUE_APP_CLIENT_SECRET

            if (this.grantType === 'password') {
              this.loginForm.grant_type = 'password'
            } else {
              // 判断是图片验证码还是滑动验证码
              if (this.loginCaptchaType === 'image') {
                this.loginForm.grant_type = 'captcha'
                this.loginForm.captcha_type = 'image'
                this.loginForm.captcha_key = this.captchaKey
                this.loginForm.captcha_code = this.loginForm.captchaCode
              } else {
                delete this.loginForm.captchaCode
                this.loginForm.captcha_verification = params.captchaVerification
                this.loginForm.sliding_type = this.slidingCaptchaType
                this.loginForm.grant_type = 'captcha'
              }
            }
            let params = Object.assign({}, this.loginForm)
            params.password = md5(this.loginForm.password)
            //console.log('params: ', this.loginForm)
            this.$store
              .dispatch('user/loginByPassword', params)
              .then(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              })
              .catch(err => {
                console.log('登录失败：', err)
                this.requestFailed(err)
              })

          } else {
            console.log('登录失败')
            return false
          }
        })
      },
      requestFailed(err) {
        this.loading = false
        console.log('requestFailed: ', err)
        if (err && err.code === 427) {
          // 密码错误次数超过最大限值，请选择验证码模式登录
          this.grantType = 'captcha'

          if (this.loginCaptchaType === 'sliding') {
            this.$refs.verify.show()
          }

          if (this.loginCaptchaType === 'image') {
            this.refreshImageCode()
          }
        }
      },
      captchaVerify(e) {
        e.preventDefault()
        // console.log("this.loginCaptchaType:", this.loginCaptchaType)
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            if (this.grantType === 'password') {
              this.verifySuccess()
            } else {
              if (this.loginCaptchaType === 'sliding') {
                this.$refs.verify.show()
              } else {
                this.verifySuccess()
              }
            }
          } else {
            setTimeout(() => {
              this.loading = false
            }, 600)
          }
        })
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      }
    }
  }
</script>

<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    background-size: cover;
    position: fixed;
  }

  .login .login-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    padding-top: 10%;
  }

  .login .login-box .top {
    margin-bottom: 30px;
    text-align: center;
  }

  .login .login-box .top .logo {
    font-size: 0;
    max-width: 50%;
    margin: 0 auto;
  }

  .login .login-box .top .company {
    font-size: 16px;
    margin-top: 10px;
  }

  .login .login-box .mid {
    font-size: 14px;
  }

  .login .login-box .mid .item-btn {
    margin-top: 20px;
  }

  .login .login-box .mid .item-btn input {
    border: 0;
    width: 100%;
    height: 40px;
    box-shadow: 0;
    background: #1f87e8;
    color: #fff;
    border-radius: 3px;
  }

  .info {
    width: 410px;
  }

  .login-captcha {
    height: 40px;
  }

  .login .login-box .bottom {
    position: absolute;
    bottom: 10%;
    width: 100%;
    color: #999;
    font-size: 12px;
    text-align: center;
  }

  .title {
    font-size: 26px;
    color: black;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
</style>
