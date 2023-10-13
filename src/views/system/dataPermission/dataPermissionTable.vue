<template>
  <div class="app-container content">
    <el-row :gutter="24">
      <el-col :span="5">
        <adaptive-card>
          <resource-tree slot="container" @nodeClick="handleResourceTreeClick"></resource-tree>
        </adaptive-card>
      </el-col>
      <el-col :span="18">
        <adaptive-card>
          <div slot="container">
            <div class="filter-container-card">
              <div class="text item">
                <el-form inline label-width="100px">
                  <el-form-item>
                    <el-input v-model="listQuery.dataName" placeholder="数据权限名称" clearable class="filter-item"
                              maxlength="100" @keyup.enter.native="handleFilter"/>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="listQuery.dataMapperFunction" placeholder="Mapper接口名称" clearable
                              class="filter-item"
                              maxlength="100" @keyup.enter.native="handleFilter"/>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="listQuery.dataTableName" placeholder="数据主表" clearable class="filter-item"
                              maxlength="100" @keyup.enter.native="handleFilter"/>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="listQuery.dataPermissionType" placeholder="数据权限类型" clearable style="width: 200px">
                      <el-option v-for="item in dataPermissionTypeList" :key="item.dictCode" :label="item.dictName"
                                 :value="item.dictCode"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="float: right">
                    <el-button class="filter-item" icon="el-icon-search" @click="handleFilter">查询
                    </el-button>
                    <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
                    <el-button class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-edit"
                               @click="handleCreate" v-has="'system:data:permission:rule:create'" :disabled="currentResourceType != 4">新增
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 数据权限配置列表 -->
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
              <el-table-column label="资源接口名称" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.resourceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据权限名称" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="权限类型" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataPermissionType | dataPermissionTypeFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Mapper方法名称" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataMapperFunction }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据主表" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataTableName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据权限表" width="" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.innerTableName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" class-name="status-col" width="100">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleUpdate(scope.row)" v-has="'system:data:permission:rule:update'">编辑
                  </el-button>
                  <el-button type="text" size="mini" @click="handleUpdateRole(scope.row)"
                             v-has="'system:data:permission:rule:batch:rule:update'">角色关联
                  </el-button>
                  <el-button v-if="scope.row.status!='1'" size="mini" type="text" @click="handleModifyStatus(scope.row,'1')"
                             v-has="'extension:data:permission:rule:status'">启用
                  </el-button>
                  <el-button v-if="scope.row.status!='0'" type="text" size="mini" @click="handleModifyStatus(scope.row,'0')"
                             v-has="'extension:data:permission:rule:status'">禁用
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-has="'system:data:permission:rule:delete'">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
                        @pagination="getList"/>

            <!-- 角色新增/修改 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
              <el-form ref="dataPermissionRuleForm" :model="dataPermissionRuleForm" :rules="rules" label-width="120px"
                       style="width: 500px; margin-left:50px;">
                <el-form-item label="功能权限名称" prop="resourceId">
                  <span>{{ currentResourceName || dataPermissionRuleForm.resourceName }}</span>
                </el-form-item>
                <el-form-item label="数据权限名称" prop="dataName">
                  <el-input v-model="dataPermissionRuleForm.dataName" placeholder="输入数据权限名称" maxlength="32"/>
                </el-form-item>
                <el-form-item label="Mapper全路径" prop="dataMapperFunction">
                  <el-input v-model="dataPermissionRuleForm.dataMapperFunction" placeholder="输入数据权限对应的mapper方法全路径"
                            maxlength="64"/>
                </el-form-item>
                <el-form-item label="数据权限类型" prop="dataPermissionType">
                  <el-select v-model="dataPermissionRuleForm.dataPermissionType" placeholder="数据权限类型" clearable
                             style="width: 100%">
                    <el-option v-for="item in dataPermissionTypeList" :key="item.dictCode" :label="item.dictName"
                               :value="item.dictCode"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="权限主表" prop="dataTableName">
                  <el-input v-model="dataPermissionRuleForm.dataTableName" placeholder="输入需要做数据权限主表" maxlength="32"/>
                </el-form-item>
                <el-form-item label="权限主表别名" prop="dataTableAlias">
                  <el-input v-model="dataPermissionRuleForm.dataTableAlias" placeholder="输入需要做数据权限表的别名" maxlength="32"/>
                </el-form-item>
                <el-form-item label="数据权限表" prop="innerTableName">
                  <el-input v-model="dataPermissionRuleForm.innerTableName" placeholder="输入数据权限表,默认t_sys_organization"
                            maxlength="32"/>
                </el-form-item>
                <el-form-item label="数据权限表别名" prop="innerTableAlias">
                  <el-input v-model="dataPermissionRuleForm.innerTableAlias" placeholder="输入数据权限表的别名,默认organization"
                            maxlength="32"/>
                </el-form-item>
                <el-form-item label="需排除的字段" prop="dataColumnExclude">
                  <el-input v-model="dataPermissionRuleForm.dataColumnExclude" placeholder="输入数据权限需要排除的字段" maxlength="32"/>
                </el-form-item>
                <el-form-item label="仅保留的字段" prop="dataColumnInclude">
                  <el-input v-model="dataPermissionRuleForm.dataColumnInclude" placeholder="输入数据权限需要保留的字段" maxlength="32"/>
                </el-form-item>
                <el-form-item label="自定义表达式" prop="customExpression">
                  <el-input v-model="dataPermissionRuleForm.customExpression" placeholder="请输入自定义表达式"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="dataPermissionRuleForm.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="comments">
                  <el-input v-model="dataPermissionRuleForm.comments" placeholder="请输入备注信息" maxlength="128"
                            type="textarea"/>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
                <el-button v-else type="primary" @click="updateData">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </adaptive-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Pagination from '@/components/Pagination'
  import ResourceTree from '@/components/ResourceTree'
  import {
    queryDataPermissionRuleList,
    checkDataPermissionRuleExist,
    createDataPermissionRule,
    updateDataPermissionRule,
    updateDataPermissionRuleStatus,
    deleteDataPermissionRule
  } from '@/api/system/datapermission'
  import { listDict } from '@/api/system/dict'
  import { deleteResource } from '@/api/system/resource'

  let vm = {}
  export default {
    components: { AdaptiveCard, Pagination, ResourceTree },
    filters: {
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
      dataPermissionTypeFilter(dataType) {
        return vm.dataPermissionTypeFilterMap[dataType]
      }
    },
    data() {
      var validDataMapperFunction = (rule, value, callback) => {
        if (value) {
          var keyData = {
            id: this.dataPermissionRuleForm.id,
            checkField: 'data_mapper_function',
            checkValue: value
          }
          checkDataPermissionRuleExist(keyData).then(response => {
            if (!response.data) {
              callback(new Error('Mapper方法已存在'))
            } else {
              callback()
            }
          })
        }
      }
      vm = this
      return {
        dataPermissionTypeList: [],
        dataPermissionTypeFilterMap: {},
        total: 0,
        list: null,
        listQuery: {
          current: 1,
          size: 10,
          resourceId: '',
          dataName: '',
          dataMapperFunction: '',
          dataTableName: '',
          dataPermissionType: '',
          status: undefined
        },
        tableKey: 0,
        listLoading: true,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        dataPermissionRuleForm: {
          id: '',
          resourceId: '',
          dataName: '',
          dataMapperFunction: '',
          dataTableName: '',
          dataTableAlias: '',
          dataColumnExclude: '',
          dataColumnInclude: '',
          innerTableName: '',
          innerTableAlias: '',
          dataPermissionType: '',
          customExpression: '',
          status: 1,
          comments: ''
        },
        currentResourceId: '',
        currentResourceName: '',
        currentResourceType: '',
        rules: {
          dataName: [
            { required: true, message: '请输入数据权限名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          dataMapperFunction: [
            { required: true, message: '请输入数据权限对应的mapper方法全路径', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
            { validator: validDataMapperFunction, trigger: 'blur' }
          ],
          dataTableName: [
            { required: true, message: '请输入数据主表', trigger: 'blur' }
          ],
          dataTableAlias: [
            { required: true, message: '请输入数据主表的别名', trigger: 'blur' }
          ],
          innerTableName: [
            { required: true, message: '请输入数据权限表', trigger: 'blur' }
          ],
          innerTableAlias: [
            { required: true, message: '请输入数据权限表的别名', trigger: 'change' }
          ],
          dataPermissionType: [
            { required: true, message: '请选择数据权限类型', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择数据权限状态', trigger: 'change' }
          ]
        },
      }
    },
    methods: {
      getDataPermissionTypeList() {
        listDict('DATA_PERMISSION_TYPE').then(response => {
          this.dataPermissionTypeList = response.data
          this.dataPermissionTypeFilterMap = {}
          this.dataPermissionTypeList.forEach((item, index, arr) => {
            this.dataPermissionTypeFilterMap[item.dictCode] = item.dictName
          })
        })
      },
      getList() {
        this.listLoading = true
        queryDataPermissionRuleList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      resetListQuery() {
        this.listQuery = {
          current: 1,
          size: 10,
          resourceId: '',
          dataName: '',
          dataMapperFunction: '',
          dataTableName: '',
          dataPermissionType: '',
          status: undefined
        }
      },
      handleCreate() {
        this.resetDataPermissionRuleForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataPermissionRuleForm'].clearValidate()
        })
      },
      resetDataPermissionRuleForm() {
        this.dataPermissionRuleForm = {
          id: '',
          resourceId: '',
          dataName: '',
          dataMapperFunction: '',
          dataTableName: '',
          dataTableAlias: '',
          dataColumnExclude: '',
          dataColumnInclude: '',
          innerTableName: '',
          innerTableAlias: '',
          dataPermissionType: '',
          customExpression: '',
          status: 1,
          comments: ''
        }
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      handleUpdate(row) {
        this.dataPermissionRuleForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataPermissionRuleForm'].clearValidate()
        })
      },
      handleUpdateRole() {

      },
      handleResourceTreeClick(row) {
        console.log(row)
        if (row) {
          this.currentResourceId = row.id
          this.currentResourceName = row.resourceName
          this.currentResourceType = row.resourceType
          this.listQuery.resourceId = row.id
          this.getList()
        }
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该资源：' + row.dataName + ',是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.listLoading = true
          deleteDataPermissionRule(row.id).then(() => {
            this.listLoading = false
            this.resetListQuery()
            this.handleFilter()
            this.$message.success('删除成功!')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateDataPermissionRuleStatus(row.id, status).then(() => {
          this.listLoading = false
          row.status = status
          this.$message.success('状态修改成功')
        })
      },
      createData() {
        this.$refs['dataPermissionRuleForm'].validate(valid => {
          if (valid) {
            createDataPermissionRule(this.dataPermissionRuleForm).then(() => {
              this.dialogFormVisible = false
              this.resetListQuery()
              this.handleFilter()
              this.$message.success('创建成功')
            })
          }
        })
      },
      updateData() {
        this.$refs['dataPermissionRuleForm'].validate(valid => {
          if (valid) {
            updateDataPermissionRule(this.dataPermissionRuleForm).then(() => {
              this.dialogFormVisible = false
              this.resetListQuery()
              this.handleFilter()
              this.$message.success('更新成功')
            })
          }
        })
      }
    },
    created() {
      // 获取数据权限类型列表
      this.getDataPermissionTypeList()
      // 获取数据权限配置列表
      this.getList()
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    margin-right: 10px;
  }
</style>
