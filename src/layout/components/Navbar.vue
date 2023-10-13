<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <el-avatar size="medium" :src="avatar"></el-avatar>
          <span class="user-name">{{ nickname }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toUpdatePwd()">
            <svg-icon icon-class="update-pwd"/>&nbsp;
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <svg-icon icon-class="exit-green"/>&nbsp;
            <span>安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="updPwdDialogShow" width="25%" title="修改密码">
      <el-form ref="updPwdForm" :model="updPwdForm" :rules="rules">
        <el-form-item label="当前密码" prop="oldpassword">
          <el-input v-model="updPwdForm.oldpassword" type="password" :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="密码长度6-32位，包含数字和字母"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updPwdForm.newPassword" type="password" :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="新密码和当前密码不能相同"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="updPwdForm.checkPassword" type="password" :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="确认密码和新密码保持一致"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { checkPassword, updateUser } from '@/api/system/user'

  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    data() {
      let validOldPassword = (rule, value, callback) => {
        let keyData = {
          account: this.user.name,
          newPassword: value
        }
        checkPassword(keyData).then(response => {
          if (!response.data) {
            callback(new Error('当前密码错误'))
          } else {
            callback()
          }
        })
      }
      let checkpass = (rule, value, callback) => {
        if (value == this.updPwdForm.newPassword) {
          callback()
        } else {
          callback(new Error('两次密码不一致'))
        }
      }
      return {
        updPwdDialogShow: false,
        updPwdForm: {
          oldpassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          oldpassword: [
            { required: true, message: '请输入当前密码', trigger: 'blur' },
            { validator: validOldPassword, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: checkpass }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'nickname',
        'user'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      toUpdatePwd() {
        this.resetUpdPwdForm()
        this.updPwdDialogShow = true
        this.$nextTick(() => {
          this.$refs['updPwdForm'].clearValidate()
        })
      },
      updatePwd() {
        let updParams = {
          id: this.user.id,
          account: this.user.account,
          password: this.updPwdForm.newPassword
        }
        updateUser(updParams).then(res => {
          this.updPwdDialogShow = false
          this.$message({
            message: '修改成功，请妥善保管新密码。',
            type: 'success'
          })
        })
      },
      resetUpdPwdForm() {
        this.updPwdForm = {
          oldpassword: '',
          newPassword: '',
          checkPassword: ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .buttons-container {
      float: right;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 15px;
        cursor: pointer;

        .avatar-wrapper {
          position: relative;
          display: flex; /* 设置父元素为flex布局 */
          align-items: center; /* 垂直居中 */
          justify-content: center; /* 水平居中 */

          .user-name {
            font-size: 15px;
            margin-left: 5px;
            font-family: "爱奇艺黑体 Medium";
          }
        }
      }
    }
  }
</style>
