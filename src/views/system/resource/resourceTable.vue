<template>
  <div class="app-container content">
    <div class="filter-container-card">
      <adaptive-card>
        <div slot="container">
          <!-- 资源列表查询条件 -->
          <div class="text item">
            <el-form label-width="80px" inline>
              <el-form-item label="资源名称:" prop="id">
                <el-input v-model="treeQuery.resourceName" clearable placeholder="请输入资源名称" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
              <el-form-item label="资源标识:" prop="roleName">
                <el-input v-model="treeQuery.resourceKey" clearable placeholder="请输入资源标识" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
              <el-form-item style="float:right;">
                <el-button class="filter-item"  icon="el-icon-search" @click="searchTreeData">查询
                </el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
                <el-button class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-edit" @click="handleCreate(false)" v-has="'system:resource:create'">新增
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 资源列表 -->
          <el-table ref="resourceTree" :data="list" row-key="id" border>
            <el-table-column label="资源名称" align="left">
              <template slot-scope="scope">
                <span :id="scope.row.id">{{ scope.row.resourceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源标识" align="center">
              <template slot-scope="scope">
                <span :id="scope.row.resourceKey">{{ scope.row.resourceKey }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.resourceType | typeNameFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源链接" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.resourceUrl }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源图标" align="center">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.resourceIcon"/>
              </template>
            </el-table-column>
            <el-table-column label="资源排序" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.resourceLevel }}</span>
              </template>
            </el-table-column>
            <el-table-column label="资源状态" align="center" class-name="status-col" width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.resourceStatus | statusFilter">{{ scope.row.resourceStatus | statusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleCreate(scope.row)" v-has="'system:resource:create'">新增</el-button>
                <el-button type="text" size="mini" @click="handleUpdate(scope.row)" v-has="'system:resource:update'">编辑</el-button>
                <el-button v-if="scope.row.resourceStatus!='1'" size="mini" type="text" @click="handleModifyStatus(scope.row,'1')" v-has="'system:resource:status'">启用</el-button>
                <el-button v-if="scope.row.resourceStatus!='0'" type="text" size="mini" @click="handleModifyStatus(scope.row,'0')" v-has="'system:resource:status'">禁用</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)" v-has="'system:resource:delete'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </adaptive-card>

      <!-- 资源 新增/编辑 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" width="35%">
        <el-form ref="resourceForm" :model="resourceForm" :rules="rules" label-width="100px" class="resourceForm" style="width: 400px; margin-left:50px;">
          <el-form-item label="资源名称" prop="resourceName">
            <el-input v-model.trim="resourceForm.resourceName" placeholder="权限或者菜单的名称" maxlength="32" />
          </el-form-item>
          <el-form-item label="资源标识" prop="resourceKey">
            <el-input v-model.trim="resourceForm.resourceKey" placeholder="系统用来判断权限的唯一key" maxlength="32" />
          </el-form-item>
          <el-form-item label="资源类型" prop="resourceType">
            <el-radio-group v-model="resourceForm.resourceType">
              <el-radio :label="'1'">模块</el-radio>
              <el-radio :label="'2'">菜单</el-radio>
              <el-radio :label="'4'">接口</el-radio>
              <el-radio :label="'3'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="资源图标" prop="resourceIcon">
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
                  :class="{ 'is-active': resourceForm.resourceIcon === item }">
                  <svg-icon class="icon-svg" :icon-class="item"></svg-icon>
                </el-button>
              </div>
              <el-input v-model.trim="resourceForm.resourceIcon" disabled placeholder="菜单的图标，不是菜单可以不选择" maxlength="32" slot="reference"/>
            </el-popover>
          </el-form-item>
          <el-form-item label="资源path" prop="resourcePath">
            <el-tooltip class="item" effect="dark" content="1、单页面路由地址 2、外链地址以http://或https://开头" placement="right">
              <el-input v-model.trim="resourceForm.resourcePath" placeholder="浏览器地址栏显示的url" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="资源链接" prop="resourceUrl">
            <el-tooltip class="item" effect="dark" content="1、一级菜单填Layout 2、包含子菜单的二级菜单填nested 3、最后子菜单填写页面对应路径 4、接口填写请求路径" placement="right">
              <el-input v-model.trim="resourceForm.resourceUrl" placeholder="菜单对应前台页面的路径" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="资源排序" prop="resourceLevel">
            <el-input v-model.number="resourceForm.resourceLevel" placeholder="菜单排序" maxlength="32" />
          </el-form-item>
          <el-form-item v-show="resourceForm.resourceType === '2'" label="页面名称" prop="resourcePageName">
            <el-tooltip class="item" effect="dark" content="如果前端页面开启了tagView，一定要跟页面中定义的name值保持名称一致，否则不能keep-alive" placement="right">
              <el-input v-model.trim="resourceForm.resourcePageName" placeholder="前端页面定义的名称" maxlength="32" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="是否缓存" prop="resourceCache">
            <el-radio-group v-model="resourceForm.resourceCache">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示" prop="resourceShow">
            <el-radio-group v-model="resourceForm.resourceShow">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="资源状态" prop="resourceStatus">
            <el-radio-group v-model="resourceForm.resourceStatus">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="resourceForm.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
          <el-button v-else type="primary" @click="updateData">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { fetchResourceTree, updateResourceStatus, createResource, checkResourceExist, deleteResource, updateResource } from '@/api/system/resource'
  import AdaptiveCard from '@/components/AdaptiveCard'
  export default {
    name: 'ResourceTable',
    components: {AdaptiveCard},
    filters: {
      typeNameFilter(type) {
        const typeNameMap = {
          1: '模块',
          2: '菜单',
          4: '接口',
          3: '按钮'
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
    data() {
      let validResourceKey = (rule, value, callback) => {
        let keyData = {
          id: this.resourceForm.id,
          checkField: 'resource_key',
          checkValue: value
        }
        checkResourceExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('资源标识已存在'))
          } else {
            callback()
          }
        })
      }
      return {
        expandAll: false,
        list: [],
        baseList: [],
        rootFlag: false,
        expandTitle: 'resourceTable.resourceName',
        expandName: 'resourceName',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogPvVisible: false,
        treeQuery: {
          parentId: 0,
          resourceKey: '',
          resourceName: ''
        },
        resourceForm: {
          id: '',
          parentId: 0,
          resourceName: '',
          resourceKey: '',
          resourceType: '1',
          resourceIcon: '',
          resourcePath: '',
          resourceUrl: '',
          resourceLevel: '',
          resourceCache: true,
          resourceShow: true,
          resourcePageName: '',
          resourceStatus: 1,
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        },
        rules: {
          resourceName: [
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          resourceKey: [
            { required: true, message: '请输入资源标识', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
            { validator: validResourceKey, trigger: 'blur' }
          ],
          resourceType: [
            { required: true, message: '请选择资源类型', trigger: 'blur' }
          ],
          resourceIcon: [
            { required: true, message: '请选择资源图标', trigger: 'blur' },
          ],
          resourcePath: [
            { required: true, message: '请输入资源path', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          resourceUrl: [
            { required: true, message: '请输入资源接口', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          resourceLevel: [
            { required: true, message: '请输入资源排序', trigger: 'blur' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        args: [null, null, null],
        iconList: [],
      }
    },
    created() {
      this.getList()
      this.getIcons()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchResourceTree(this.treeQuery).then(response => {
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
        this.resourceForm.resourceIcon = icon
      },
      searchTreeData() {
        this.list = JSON.parse(JSON.stringify(this.baseList))
        if (
          !(
            this.treeQuery.resourceName === '' &&
            this.treeQuery.resourceKey === ''
          )
        ) {
          this.queryData(this.list)
        }
        this.expandAll = true
      },
      queryData(dataList) {
        let haveFlag = false
        let len = dataList.length - 1
        if (len < 0) {
          return haveFlag
        }
        let haveFlagArray = new Array(dataList.length)
        for (let i = len; i >= 0; i--) {
          let isname = this.treeQuery.resourceName !== ''
          let hasname =
            dataList[i].resourceName.indexOf(this.treeQuery.resourceName) >= 0
          let iskey = this.treeQuery.resourceKey !== ''
          let haskey =
            dataList[i].resourceKey.indexOf(this.treeQuery.resourceKey) >= 0

          if (isname && !iskey) {
            if (hasname) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              let index1 = dataList.indexOf(dataList[i])
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
              let index2 = dataList.indexOf(dataList[i])
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
              let index3 = dataList.indexOf(dataList[i])
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
            let childHaveFlag = this.queryData(dataList[i].children)
            if (!childHaveFlag && !haveFlagArray[i]) {
              let index4 = dataList.indexOf(dataList[i])
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
      },
      resetListQuery() {
        this.treeQuery = {
          parentId: 0,
          resourceKey: '',
          resourceName: ''
        }
      },
      resetResourceForm() {
        this.resourceForm = {
          id: '',
          parentId: 0,
          resourceName: '',
          resourceKey: '',
          resourceType: '1',
          resourceIcon: '',
          resourcePath: '',
          resourceUrl: '',
          resourceLevel: '',
          resourceCache: true,
          resourceShow: true,
          resourcePageName: '',
          resourceStatus: 1,
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        }
      },
      handleCreate(row) {
        this.resetResourceForm()
        if (row) {
          this.rootFlag = false
          this.resourceForm.parentId = row.id
        } else {
          this.rootFlag = true
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.resourceForm = Object.assign({}, row) // copy obj
        // JSON不接受循环对象——引用它们自己的对象
        delete this.resourceForm.parent
        delete this.resourceForm.children
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['resourceForm'].clearValidate()
        })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateResourceStatus(row.id, status).then(() => {
          this.listLoading = false
          row.resourceStatus = status
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
        })
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该资源：' + row.resourceName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteResource(row.id).then(() => {
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
      createData() {
        this.$refs['resourceForm'].validate(valid => {
          if (valid) {
            createResource(this.resourceForm).then(response => {
              this.dialogFormVisible = false
              this.resourceForm.id = response.data.id
              if (this.rootFlag) {
                this.resourceForm['children'] = []
                this.list.push(this.resourceForm)
                this.baseList.push(JSON.parse(JSON.stringify(this.resourceForm)))
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
          if (v.id === this.resourceForm.parentId) {
            if (!v.children) {
              v['children'] = []
            }
            this.resourceForm['children'] = []
            v.children.push(JSON.parse(JSON.stringify(this.resourceForm)))
            break
          }
          if (v.children && v.children.length > 0) {
            this.createDataCallBack(v.children)
          }
        }
      },
      updateData() {
        this.$refs['resourceForm'].validate(valid => {
          if (valid) {
            updateResource(this.resourceForm).then(() => {
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
          if (v.id === this.resourceForm.id) {
            Object.assign(v, JSON.parse(JSON.stringify(this.resourceForm)))
            break
          }
          if (v.children && v.children.length > 0) {
            this.updateDataCallBack(v.children)
          }
        }
      },
    }
  }
</script>

<style scoped>
  .icon-div{
    width: 400px;
    align-items: center;  /* 垂直居中 */
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
