<template>
  <div class="app-container content">
    <el-row :gutter="24">
      <el-col :span="4">
        <adaptive-card>
          <organization-tree slot="container" @nodeClick="handleOrgTreeClick"></organization-tree>
        </adaptive-card>
      </el-col>
      <el-col :span="20">
        <adaptive-card>
          <div slot="container">
            <div class="filter-container-card" style="margin-bottom: 50px">
              <!-- 用户列表查询条件 -->
              <div class="text item">
                <el-form :label-width="80" inline>
                  <el-form-item>
                    <el-input v-model="listQuery.realName" clearable placeholder="用户姓名" style="width: 180px;" class="filter-item" maxlength="32" @keyup.enter.native="handleFilter" />
                  </el-form-item>

                  <el-form-item>
                    <el-input v-model="listQuery.mobile" clearable placeholder="手机号码" style="width: 180px;" class="filter-item" maxlength="11" @keyup.enter.native="handleFilter" />
                  </el-form-item>

                  <el-form-item>
                    <el-input v-model="listQuery.email" clearable placeholder="邮箱地址" style="width: 180px;" class="filter-item" maxlength="100" @keyup.enter.native="handleFilter" />
                  </el-form-item>

                  <el-form-item>
                    <el-select v-model="listQuery.roleId" placeholder="用户角色" clearable style="width: 180px" class="filter-item">
                      <el-option v-for="item in roleList" :key="item.key" :label="item.roleName" :value="item.id" />
                    </el-select>
                  </el-form-item>

                  <el-form-item style="float: right">
                    <el-button class="filter-item"  icon="el-icon-search" @click="handleFilter" >查询</el-button>
                    <el-button class="filter-item"  icon="el-icon-refresh" @click="resetListQuery" >重置</el-button>
                    <el-button :loading="downloadLoading" class="filter-item"  icon="el-icon-download" @click="handleDownload" v-has="'system:user:export'">导出</el-button>
                    <el-button class="filter-item" type="primary" style="margin-left: 10px;"  icon="el-icon-edit" @click="handleCreate" v-has="'system:user:create'">新增</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 用户列表 -->
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column label="序号" align="center" width="65">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="组织机构" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.organizationName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="账号" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.account }}</span>
                </template>
              </el-table-column>
              <el-table-column label="昵称" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.nickname }}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.realName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.mobile }}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" width="" align="center" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.email }}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.roleName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="性别" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.gender | sexNameFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="注册时间" width="" align="center" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleUpdate(scope.row)" v-has="'system:user:update'">编辑</el-button>
                  <el-button type="text" size="mini" v-has="'system:user:update:organization:data:permission'"  @click="handleDataPermission(scope.row)">机构权限</el-button>
                  <el-button v-if="scope.row.status!='1'" size="mini" type="text" @click="handleModifyStatus(scope.row,'1')" v-has="'system:user:status'">启用
                  </el-button>
                  <el-button v-if="scope.row.status!='0' && scope.row.status!='2'" type="text" size="mini" @click="handleModifyStatus(scope.row,'0')" v-has="'system:user:status'">禁用
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-has="'system:user:delete'">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页插件 -->
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
          </div>
        </adaptive-card>

        <!-- 用户新增/编辑弹窗-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="5vh" width="35%">
          <el-form ref="userForm" :model="userForm" :rules="rules" label-width="100px" class="userForm" style="width: 400px; margin-left:50px;">
            <el-form-item label="组织机构" prop="account">
              <el-cascader
                v-model="selectedOrgOptions"
                :options="orgList"
                :props="propsOrg"
                :show-all-levels="false"
                placeholder="组织机构"
                filterable
                clearable
                change-on-select
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input v-model="userForm.account" placeholder="输入用户账号" maxlength="32" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userForm.nickname" placeholder="输入用户昵称" maxlength="32" />
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="userForm.realName" placeholder="输入用户姓名" maxlength="32" />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="userForm.mobile" placeholder="输入用户手机号码" maxlength="11" />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="输入用户电子邮箱" maxlength="32" />
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="userForm.roleIds" class="filter-item" multiple placeholder="选择用户角色" style="width: 100%;">
                <el-option v-for="item in roleList" :key="item.key" :label="item.roleName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="区域" prop="areas">
              <el-cascader v-model="userForm.areas" :options="provinceOptions" :props="props" clearable filterable change-on-select style="width:100%;" />
            </el-form-item>
            <el-form-item label="详细地址" prop="street">
              <el-input v-model="userForm.street" placeholder="详细地址" maxlength="120" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="userForm.gender">
                <el-radio :label="'1'">男性</el-radio>
                <el-radio :label="'0'">女性</el-radio>
                <el-radio :label="'2'">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="userForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="userForm.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogDataPermissionVisible" title="设置用户机构权限" :close-on-click-modal="false">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>组织机构列表</span>
            </div>
            <div class="text item">
              <el-tree
                ref="tree"
                :data="orgList"
                :props="propsOrg"
                :default-expanded-keys="userCheckOrgPermission"
                :default-checked-keys="userCheckOrgPermission"
                show-checkbox
                check-strictly
                node-key="id"
                class="filter-container-card"
                highlight-current
                @check-change="computeOrgPermission"
              />
            </div>
          </el-card>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogDataPermissionVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateDataPermission">确 认</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {fetchUserList, createUser, updateUser, deleteUser, updateStatus, exportUserList, checkUserExist, updateUserDataPermission} from '@/api/system/user'
  import {fetchRoleAll} from '@/api/system/role'
  import { fetchOrgList } from '@/api/system/organization'
  import Pagination from '@/components/Pagination'
  import AdaptiveCard from '@/components/AdaptiveCard'
  import OrganizationTree from '@/components/OrganizationTree'
  import Data from '@/api/pcaa'
  import {downloadUrl} from '@/utils'
  export default {
    name: "UserTable",
    components: { Pagination, AdaptiveCard, OrganizationTree },
    data () {
      var validaccount = (rule, value, callback) => {
        var keyData = {
          id: this.userForm.id,
          checkField: 'account',
          checkValue: value
        }
        checkUserExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('用户账号已存在'))
          } else {
            callback()
          }
        })
      }
      var validnickname = (rule, value, callback) => {
        if (value) {
          var keyData = {
            id: this.userForm.id,
            checkField: 'nickname',
            checkValue: value
          }
          checkUserExist(keyData).then(response => {
            if (!response.data) {
              callback(new Error('用户昵称已存在'))
            } else {
              callback()
            }
          })
        }
      }
      var validmobile = (rule, value, callback) => {
        var keyData = {
          id: this.userForm.id,
          checkField: 'mobile',
          checkValue: value
        }
        checkUserExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('手机号已存在'))
          } else {
            callback()
          }
        })
      }
      var validemail = (rule, value, callback) => {
        var keyData = {
          id: this.userForm.id,
          checkField: 'email',
          checkValue: value
        }
        checkUserExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('电子邮箱已存在'))
          } else {
            callback()
          }
        })
      }
      return {
        list: null,
        listLoading: true,
        tableKey: 0,
        total: 0,
        listQuery: {
          current: 1,
          size: 10,
          realName: '',
          mobile: '',
          email: '',
          roleIds: [],
          roleId: '',
          organizationId: '',
          ancestors: [],
          status: ''
        },
        downloadLoading: false,
        roleList: null,
        textMap: {
          update: '编辑用户信息',
          create: '添加用户'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        userForm: {
          id: '',
          account: '',
          nickname: '',
          realName: '',
          mobile: '',
          email: '',
          roleIds: [],
          organizationId: '',
          gender: '1',
          status: 1,
          areas: [],
          street: '',
          comments: ''
        },
        provinceOptions:null,
        props: {
          children: 'children'
        },
        rules: {
          account: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
            { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
            { validator: validaccount, trigger: 'blur' }
          ],
          nickname: [
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' },
            { validator: validnickname, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '请输入用户姓名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          mobile: [
            {
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              required: true,
              message: '请输入正确的手机号',
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '长度在 11 到 11 个字符',
              trigger: 'blur'
            },
            { validator: validmobile, trigger: 'blur' }
          ],
          email: [
            {
              type: 'email',
              required: true,
              message: '请输入正确的邮箱',
              trigger: 'blur'
            },
            { min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur' },
            { validator: validemail, trigger: 'blur' }
          ],
          roleIds: [
            { required: true, message: '请选择用户角色', trigger: 'change' }
          ],
          gender: [
            { required: true, message: '请选择用户性别', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择用户状态', trigger: 'change' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        selectedOrgOptions: [],
        selectedOrgOptionsQuery: [],
        propsOrg: {
          value: 'id',
          label: 'organizationName'
        },
        orgList: [],
        dialogDataPermissionVisible: false,
        dataPermissionForm: {
          userId: '',
          addDataPermissions: [],
          removeDataPermissions: []
        },
        userCheckOrgPermission: [],
        addOrgPermission: [],
        removeOrgPermission: []
      }
    },
    created() {
      // 加载用户列表
      this.getList()
      // 加载组织机构列表
      this.getOrgList()
      // 加载所有角色
      this.getRoleList()
      // 加载区域数据
      this.getAreaList()
    },
    filters: {
      sexNameFilter(sex) {
        const sexNameMap = {
          1: '男',
          2: '保密',
          0: '女'
        }
        return sexNameMap[sex]
      },
      statusFilter(status) {
        const statusMap = {
          '1': 'success',
          '2': 'info',
          '0': 'danger'
        }
        return statusMap[status]
      },
      statusNameFilter(status) {
        const statusNameMap = {
          '1': '启用',
          '0': '禁用'
        }
        return statusNameMap[status]
      },
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchUserList(this.listQuery).then(response => {
          //console.log('response: ',response)
          this.list = response.data
          this.total = response.count
          this.listLoading = false
        })
      },
      getOrgList() {
        this.listLoading = true
        fetchOrgList({ parentId: 0 }).then(response => {
          this.orgList = response.data
          this.listLoading = false
        })
      },
      getRoleList() {
        this.listLoading = true
        fetchRoleAll().then(response => {
          this.roleList = response.data
          this.listLoading = false
        })
      },
      handleFilter () {
        this.listQuery.current = 1
        this.getList()
      },
      resetListQuery() {
        this.listQuery = {
          current: 1,
          size: 10,
          realName: '',
          mobile: '',
          email: '',
          roleIds: [],
          roleId: '',
          organizationId: '',
          ancestors: [],
          status: ''
        }
      },
      async handleDownload() {
        exportUserList(this.listQuery).then(res => {
          downloadUrl(res, '用户列表')
        })
      },
      handleCreate() {
        this.resetUserForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      },
      resetUserForm() {
        this.userForm = {
          id: '',
          account: '',
          nickname: '',
          realName: '',
          mobile: '',
          email: '',
          roleIds: [],
          gender: '1',
          status: 1,
          areas: [],
          street: '',
          comments: ''
        }
      },
      handleUpdate(data) {
        this.resetUserForm()
        this.userForm = Object.assign({}, data) // copy obj

        if (!this.userForm.areas || this.userForm.areas.length === 0) {
          this.userForm.areas = [
            this.userForm.province,
            this.userForm.city,
            this.userForm.area
          ]
        }

        if (this.userForm.organizationId) {
          var orgStr = this.selectOrgListByLastId(this.orgList, this.userForm.organizationId)
          console.log("orgStr:",orgStr)
          this.selectedOrgOptions = orgStr.split(',').map(x => Number.parseInt(x))
          console.log("selectedOrgOptions:",this.selectedOrgOptions)
        }

        if (!(this.userForm.roleIds instanceof Array)) {
          var roleIds = this.userForm.roleIds.split(',')
          var arrRoleIds = []
          for (let roleId of roleIds) {
            arrRoleIds.push(this.$l.parseInt(roleId))
          }
          this.userForm.roleIds = arrRoleIds
        }

        this.userForm.gender = this.userForm.gender
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      },
      selectOrgListByLastId(orgList, lastId) {
        // 递归查询机构父机构，用于展示已选中的机构
        var orgStr = ''
        if (orgList) {
          for (var org of orgList) {
            if (lastId === org.id) {
              return lastId
            } else if (org.children) {
              var childOrg = this.selectOrgListByLastId(org.children, lastId)
              if (childOrg) {
                orgStr = org.id + ',' + childOrg
                return orgStr
              }
            }
          }
        }
        return orgStr
      },
      handleDataPermission(row) {
        this.dialogStatus = 'update'
        this.dialogDataPermissionVisible = true
        this.resetDataPermissionForm()
        this.userForm = Object.assign({}, row)
        if (this.$refs['tree']) {
          this.$refs['tree'].setCheckedKeys([])
        }
        this.addOrgPermission = []
        this.removeOrgPermission = []
        if (row.organizationIds) {
          this.userCheckOrgPermission = row.organizationIds.split(',').map(Number)
        } else {
          this.userCheckOrgPermission = []
        }
        this.dataPermissionForm.userId = this.userForm.id
      },
      resetDataPermissionForm() {
        this.dataPermissionForm = {
          userId: '',
          addDataPermissions: [],
          removeDataPermissions: []
        }
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateStatus(row.id, status).then(() => {
          this.listLoading = false
          row.status = status
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
        })
      },
      handleDelete(data) {
        this.$confirm(
          '此操作将永久删除该用户：' + data.realName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteUser(data.id).then(() => {
              this.listLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const index = this.list.indexOf(data)
              this.list.splice(index, 1)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      createData() {
        if (this.selectedOrgOptions.length > 0) {
          this.userForm.organizationId = this.selectedOrgOptions[this.selectedOrgOptions.length - 1]
        } else {
          this.userForm.organizationId = ''
        }

        this.$refs['userForm'].validate(valid => {
          if (valid) {
            createUser(this.userForm).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$message({
                message: '创建成功',
                type: 'success'
              })
            })
          }
        })
      },
      updateDataPermission() {
        this.dataPermissionForm.addDataPermissions = this.addOrgPermission
        this.dataPermissionForm.removeDataPermissions = this.removeOrgPermission
        updateUserDataPermission(this.dataPermissionForm).then(() => {
          this.handleFilter()
          this.dialogDataPermissionVisible = false
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        })
      },
      computeOrgPermission(item, node) {
        if (node) {
          // 如果原先不存在，则添加到新增列表
          if (this.userCheckOrgPermission.indexOf(item.id) === -1) {
            this.addOrgPermission.push(item.id)
          }
          // 如果在删除列表中，则从删除列表中删除
          var removeIndex = this.removeOrgPermission.indexOf(item.id)
          if (removeIndex > -1) {
            this.removeOrgPermission.splice(removeIndex, 1)
          }
        } else {
          // 如果原先存在，则添加到删除列表
          if (this.userCheckOrgPermission.indexOf(item.id) > -1) {
            this.removeOrgPermission.push(item.id)
          }
          // 如果在新增列表中，则从新增列表中删除
          var addIndex = this.addOrgPermission.indexOf(item.id)
          if (addIndex > -1) {
            this.addOrgPermission.splice(addIndex, 1)
          }
        }
      },
      updateData() {
        if (this.selectedOrgOptions.length > 0) {
          this.userForm.organizationId = this.selectedOrgOptions[this.selectedOrgOptions.length - 1]
        } else {
          this.userForm.organizationId = ''
        }

        this.$refs['userForm'].validate(valid => {
          if (valid) {
            updateUser(this.userForm).then(() => {
              for (const v of this.list) {
                if (v.id === this.userForm.id) {
                  const index = this.list.indexOf(v)
                  var arrRoleNames = []
                  for (const role of this.roleList) {
                    for (var roleId of this.userForm.roleIds) {
                      if (role.id === roleId) {
                        arrRoleNames.push(role.roleName)
                      }
                    }
                  }
                  this.userForm.roleName = arrRoleNames.join()
                  this.list.splice(index, 1, this.userForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            })
          }
        })
      },
      handleOrgTreeClick(row) {
        this.resetListQuery()
        if (row.parentId == 0 && row.children) {
          let ancestors = row.children.map(item => item.id)
          this.listQuery.ancestors = ancestors.join(',')
        } else {
          this.listQuery.organizationId = row.id
        }
        this.getList()
      },
      getAreaList() {
        var options = []
        for (var key in Data['86']) {
          var citys = []
          for (var keyc in Data[key]) {
            var areas = []
            for (var keya in Data[keyc]) {
              var area = { value: keya, label: Data[keyc][keya] }
              areas.push(area)
            }
            var city = { value: keyc, label: Data[key][keyc], children: areas }
            citys.push(city)
          }
          var province = { value: key, label: Data['86'][key], children: citys }
          options.push(province)
        }
        this.provinceOptions = options
      },
    }
  }
</script>

<style scoped>

</style>
