<template>
  <div class="app-container content">
    <div class="filter-container-card">
      <adaptive-card>
        <div slot="container">
          <!-- 资源列表查询条件 -->
          <div class="text item">
            <el-form inline label-width="100px">
              <el-form-item label="组织名称:" prop="id">
                <el-input v-model="treeQuery.organizationName" clearable placeholder="请输入组织名称" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
              <el-form-item label="组织标识:" prop="roleName">
                <el-input v-model="treeQuery.organizationKey" clearable placeholder="请输入组织标识" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
              <el-form-item style="float:right;">
                <el-button class="filter-item" icon="el-icon-search" @click="searchTreeData">查询
                </el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" type="primary"
                           @click="handleCreate(false)" v-has="'system:organization:create'">新增
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="list" row-key="id" border>
            <el-table-column label="组织名称" align="center">
              <template slot-scope="scope">
                <span :id="scope.row.id">{{ scope.row.organizationName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组织标识" align="center">
              <template slot-scope="scope">
                <span :id="scope.row.organizationKey">{{ scope.row.organizationKey }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组织类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.organizationType | typeNameFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组织图标" align="center">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.organizationIcon"/>
              </template>
            </el-table-column>
            <el-table-column label="组织排序" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.organizationLevel }}</span>
              </template>
            </el-table-column>
            <el-table-column label="组织状态" class-name="status-col" width="100" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.organizationStatus | statusFilter">{{ scope.row.organizationStatus |
                  statusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="false" width="110px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.areas }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleCreate(scope.row)" v-has="'system:organization:create'">新增</el-button>
                <el-button type="text" size="mini" @click="handleUpdate(scope.row)" v-has="'system:organization:update'">编辑</el-button>
                <el-button v-if="scope.row.organizationStatus!='1'" size="mini" type="text"
                           @click="handleModifyStatus(scope.row,'1')" v-has="'system:organization:status'">启用
                </el-button>
                <el-button v-if="scope.row.organizationStatus!='0'" size="mini" type="text"
                           @click="handleModifyStatus(scope.row,'0')" v-has="'system:organization:status'">禁用
                </el-button>
                <el-button type="text" size="mini" @click="handleDelete(scope.row)" v-has="'system:organization:delete'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
            <el-form ref="organizationForm" :model="organizationForm" :rules="rules" label-width="100px"
                     class="organizationForm" style="width: 400px; margin-left:50px;">
              <el-form-item label="组织名称" prop="organizationName">
                <el-input v-model.trim="organizationForm.organizationName" placeholder="输入组织名称" maxlength="32"/>
              </el-form-item>
              <el-form-item label="组织标识" prop="organizationKey">
                <el-input v-model.trim="organizationForm.organizationKey" placeholder="输入组织标识" maxlength="32"/>
              </el-form-item>
              <el-form-item label="组织类型" prop="organizationType">
                <el-select v-model="organizationForm.organizationType" style="width: 100%" class="filter-item">
                  <el-option v-for="item in typesOption" :key="item.key" :label="item.label" :value="item.key"/>
                </el-select>
              </el-form-item>
              <el-form-item label="组织图标" prop="organizationIcon">
                <el-popover
                  placement="right"
                  trigger="click">
                  <div class="icon-div">
                    <el-button
                      style="margin-bottom: 5px; margin-left: 5px"
                      size="mini"
                      v-for="(item, index) in iconList"
                      :key="index"
                      @click="iconListCurrentChangeHandle(item)"
                      :class="{ 'is-active': organizationForm.organizationIcon === item }">
                      <svg-icon class="icon-svg" :icon-class="item"></svg-icon>
                    </el-button>
                  </div>
                  <el-input v-model.trim="organizationForm.organizationIcon" disabled placeholder="选择组织图标"
                            maxlength="32" slot="reference"/>
                </el-popover>
              </el-form-item>
              <el-form-item label="组织排序" prop="organizationLevel">
                <el-input v-model.number="organizationForm.organizationLevel" placeholder="输入组织排序" maxlength="32"/>
              </el-form-item>
              <el-form-item label="组织状态" prop="organizationStatus">
                <el-radio-group v-model="organizationForm.organizationStatus">
                  <el-radio :label="'1'">启用</el-radio>
                  <el-radio :label="'0'">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="地区" prop="province">
                <el-cascader v-model="organizationForm.areas" :options="provinceOptions" :props="props" clearable
                             filterable change-on-select style="width:100%;"/>
              </el-form-item>
              <el-form-item label="详细地址" prop="street">
                <el-input v-model="organizationForm.street" placeholder="详细地址" maxlength="120"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model.trim="organizationForm.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                          placeholder="请输入备注信息"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 认</el-button>
              <el-button v-else type="primary" @click="updateData">确 认</el-button>
            </div>
          </el-dialog>
        </div>
      </adaptive-card>
    </div>
  </div>
</template>

<script>
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Data from '@/api/pcaa'
  import {
    fetchOrgList,
    createOrganization,
    deleteOrganization,
    updateOrganization,
    updateOrganizationStatus,
    checkOrganizationExist
  } from '@/api/system/organization'

  export default {
    data() {
      var validOrganizationName = (rule, value, callback) => {
        var keyData = {
          id: this.organizationForm.id,
          checkField: 'organization_name',
          checkValue: value
        }
        checkOrganizationExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('组织名称已存在'))
          } else {
            callback()
          }
        })
      }
      var validOrganizationKey = (rule, value, callback) => {
        var keyData = {
          id: this.organizationForm.id,
          checkField: 'organization_key',
          checkValue: value
        }
        checkOrganizationExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('组织标识已存在'))
          } else {
            callback()
          }
        })
      }
      return {
        expandAll: false,
        provinceOptions: null,
        props: {
          children: 'children'
        },
        list: [],
        baseList: [],
        rootFlag: false,
        expandTitle: 'organizationTable.organizationName',
        expandName: 'organizationName',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        typesOption: [
          { label: '总公司', key: '1' },
          { label: '分公司', key: '2' },
          { label: '事业部', key: '3' },
          { label: '业务部', key: '4' }
        ],
        dialogPvVisible: false,
        treeQuery: {
          parentId: 0,
          organizationName: '',
          organizationKey: ''
        },
        organizationForm: {
          id: '',
          parentId: 0,
          organizationName: '',
          organizationKey: '',
          organizationType: '1',
          organizationIcon: '',
          organizationLevel: '',
          organizationStatus: '1',
          areas: [],
          street: '',
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        },
        rules: {
          organizationName: [
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
            { validator: validOrganizationName, trigger: 'blur' }
          ],
          organizationKey: [
            { required: true, message: '请输入组织标识', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
            { validator: validOrganizationKey, trigger: 'blur' }
          ],
          organizationType: [
            { required: true, message: '请选择组织类型', trigger: 'blur' }
          ],
          organizationIcon: [
            { required: true, message: '请输入组织图标', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          organizationLevel: [
            { required: true, message: '请输入组织排序', trigger: 'blur' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        args: [null, null, null],
        iconList: []
      }
    },
    filters: {
      typeNameFilter(type) {
        const typeNameMap = {
          1: '总公司',
          2: '分公司',
          3: '事业部',
          4: '业务部'
        }
        return typeNameMap[type]
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
      }
    },
    components: {
      AdaptiveCard
    },
    created() {
      this.getList()
      this.getAreaList()
      this.getIcons()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchOrgList(this.treeQuery).then(response => {
          this.list = response.data
          this.baseList = JSON.parse(JSON.stringify(response.data)) // 数组深复制
          this.listLoading = false
        })
      },
      getIcons() {
        const req = require.context('@/icons/svg', false, /\.svg$/)
        const requireAll = requireContext => requireContext.keys()
        const re = /\.\/(.*)\.svg/
        const icons = requireAll(req).map(i => {
          return i.match(re)[1]
        })
        this.iconList = icons
        console.log(this.iconList)
      },
      iconListCurrentChangeHandle(icon) {
        console.log(icon)
        this.organizationForm.organizationIcon = icon
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
      resetOrganizationForm() {
        this.organizationForm = {
          id: '',
          parentId: 0,
          organizationName: '',
          organizationKey: '',
          organizationType: '1',
          organizationIcon: '',
          organizationLevel: '',
          organizationStatus: '1',
          areas: [],
          street: '',
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        }
      },
      handleCreate(row) {
        this.resetOrganizationForm()
        if (row) {
          this.rootFlag = false
          this.organizationForm.parentId = row.id
        } else {
          this.rootFlag = true
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['organizationForm'].clearValidate()
        })
      },
      resetListQuery() {
        this.treeQuery = {
          organizationName: '',
          organizationKey: ''
        }
      },
      createData() {
        this.$refs['organizationForm'].validate(valid => {
          if (valid) {
            createOrganization(this.organizationForm).then(response => {
              this.dialogFormVisible = false
              this.organizationForm.id = response.data.id
              if (this.rootFlag) {
                this.organizationForm['children'] = []
                this.list.push(this.organizationForm)
                this.baseList.push(
                  JSON.parse(JSON.stringify(this.organizationForm))
                )
              } else {
                this.createDataCallBack(this.list)
                this.createDataCallBack(this.baseList)
              }
              this.$message({
                message: '创建成功',
                type: 'success'
              })
            })
          }
        })
      },
      createDataCallBack(dataList) {
        for (const v of dataList) {
          if (v.id === this.organizationForm.parentId) {
            if (!v.children) {
              v['children'] = []
            }
            this.organizationForm['children'] = []
            v.children.push(JSON.parse(JSON.stringify(this.organizationForm)))
            break
          }
          if (v.children && v.children.length > 0) {
            this.createDataCallBack(v.children)
          }
        }
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateOrganizationStatus(row.id, status).then(() => {
          this.listLoading = false
          row.organizationStatus = status
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
        })
      },
      handleUpdate(row) {
        this.organizationForm = Object.assign({}, row) // copy obj
        if (!this.organizationForm.areas || this.organizationForm.areas.length === 0) {
          this.organizationForm.areas = [
            this.organizationForm.province,
            this.organizationForm.city,
            this.organizationForm.area
          ]
        }
        // JSON不接受循环对象——引用它们自己的对象
        delete this.organizationForm.parent
        delete this.organizationForm.children
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['organizationForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['organizationForm'].validate(valid => {
          if (valid) {
            updateOrganization(this.organizationForm).then(() => {
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.updateDataCallBack(this.list)
              this.updateDataCallBack(this.baseList)
            })
          }
        })
      },
      updateDataCallBack(dataList) {
        for (const v of dataList) {
          if (v.id === this.organizationForm.id) {
            Object.assign(v, JSON.parse(JSON.stringify(this.organizationForm)))
            break
          }
          if (v.children && v.children.length > 0) {
            this.updateDataCallBack(v.children)
          }
        }
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该组织：' + row.organizationName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteOrganization(row.id).then(() => {
              this.listLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.deleteDataCallBack(row.id, this.list)
              this.deleteDataCallBack(row.id, this.baseList)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      deleteDataCallBack(id, dataList) {
        for (const v of dataList) {
          if (v.id === id) {
            const index = dataList.indexOf(v)
            dataList.splice(index, 1)
            break
          }
          if (v.children && v.children.length > 0) {
            this.deleteDataCallBack(id, v.children)
          }
        }
      },
      searchTreeData() {
        this.list = JSON.parse(JSON.stringify(this.baseList))
        if (
          !(
            this.treeQuery.organizationName === '' &&
            this.treeQuery.organizationKey === ''
          )
        ) {
          this.queryData(this.list)
        }
        this.expandAll = true
      },
      queryData(dataList) {
        var haveFlag = false
        var len = dataList.length - 1
        if (len < 0) {
          return haveFlag
        }
        var haveFlagArray = new Array(dataList.length)
        for (let i = len; i >= 0; i--) {
          var isname = this.treeQuery.organizationName !== ''
          var hasname =
            dataList[i].organizationName.indexOf(
              this.treeQuery.organizationName
            ) >= 0
          var iskey = this.treeQuery.organizationKey !== ''
          var haskey =
            dataList[i].organizationKey.indexOf(this.treeQuery.organizationKey) >=
            0

          if (isname && !iskey) {
            if (hasname) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              var index1 = dataList.indexOf(dataList[i])
              dataList.splice(index1, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          } else if (!isname && iskey) {
            if (haskey) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              var index2 = dataList.indexOf(dataList[i])
              dataList.splice(index2, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          } else if (isname && iskey) {
            if (hasname && haskey) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              var index3 = dataList.indexOf(dataList[i])
              dataList.splice(index3, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          }

          if (
            dataList[i] &&
            dataList[i].children &&
            dataList[i].children.length > 0
          ) {
            var childHaveFlag = this.queryData(dataList[i].children)
            if (!childHaveFlag && !haveFlagArray[i]) {
              var index4 = dataList.indexOf(dataList[i])
              dataList.splice(index4, 1)
            }
            if (childHaveFlag) {
              haveFlagArray[i] = true
            }
          }
        }

        if (haveFlagArray.indexOf(true) >= 0) {
          haveFlag = true
        }
        return haveFlag
      }
    }
  }
</script>

<style scoped>
  .icon-div {
    width: 400px;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }

  .icon-svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
    overflow: hidden;
  }
</style>
