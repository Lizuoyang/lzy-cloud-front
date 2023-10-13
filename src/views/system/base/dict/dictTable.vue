<template>
  <div class="app-container content">
    <el-row :gutter="24">
      <el-col :span="12">
        <adaptive-card>
          <div slot="container">
            <!-- 资源列表查询条件 -->
            <div style="margin-bottom: 10px">
              <el-input v-model="treeQuery.dictName" clearable placeholder="请输入字典名称" style="width: 150px;" size="mini"
                        class="filter-item"
                        maxlength="32" @keyup.enter.native="searchList"/>

              <div style="float: right">
                <el-button class="filter-item"  size="mini" icon="el-icon-search" @click="searchList">查询</el-button>
                <el-button class="filter-item" icon="el-icon-refresh" size="mini" @click="resetListQuery">重置</el-button>
                <el-button class="filter-item" type="primary" style="margin-left: 10px;" size="mini" icon="el-icon-edit" @click="handleCreate(true)" v-has="'base:dict:create'">新增</el-button>
              </div>
            </div>

            <el-table :data="list" row-key="id" border size="mini"  v-loading="listLoading" @row-click="parentNodeClick"  highlight-current-row>
              <el-table-column label="字典名称">
                <template slot-scope="scope">
                  <span :id="scope.row.id">{{ scope.row.dictName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典值">
                <template slot-scope="scope">
                  <span :id="scope.row.dictCode">{{ scope.row.dictCode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典排序">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictOrder }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.dictStatus | statusFilter">{{ scope.row.dictStatus | statusNameFilter }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <span>{{ scope.row.comments }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleUpdate(scope.row, true)" v-has="'base:dict:update'">编辑</el-button>
                  <el-button type="text" size="mini" @click="handleDelete(scope.row, true)" v-has="'base:dict:delete'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="listTotal>0" :total="listTotal" :page.sync="treeQuery.current" :limit.sync="treeQuery.size" @pagination="getList" :small="true" />
          </div>
        </adaptive-card>
      </el-col>
      <el-col :span="12">
        <adaptive-card>
          <div slot="container">
            <!-- 资源列表查询条件 -->
            <div style="margin-bottom: 10px">
              <el-input v-model="childTreeQuery.dictName" clearable placeholder="请输入字典名称" style="width: 150px;" size="mini"
                        class="filter-item"
                        maxlength="32" @keyup.enter.native="searchChildList"/>

              <div style="float: right">
                <el-button class="filter-item"  size="mini" icon="el-icon-search" @click="searchChildList">查询</el-button>
                <el-button class="filter-item" icon="el-icon-refresh" size="mini" @click="resetChildListQuery">重置</el-button>
                <el-button class="filter-item" type="primary" style="margin-left: 10px;" size="mini" icon="el-icon-edit" @click="handleCreate(false)" v-has="'base:dict:create'">新增</el-button>
              </div>
            </div>

            <el-table :data="childList" row-key="id" border size="mini"  v-loading="childListLoading">
              <el-table-column label="字典名称">
                <template slot-scope="scope">
                  <span :id="scope.row.id">{{ scope.row.dictName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典值">
                <template slot-scope="scope">
                  <span :id="scope.row.dictCode">{{ scope.row.dictCode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典排序">
                <template slot-scope="scope">
                  <span>{{ scope.row.dictOrder }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.dictStatus | statusFilter">{{ scope.row.dictStatus | statusNameFilter }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <span>{{ scope.row.comments }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleUpdate(scope.row, false)" v-has="'base:dict:update'">编辑</el-button>
                  <el-button type="text" size="mini" @click="handleDelete(scope.row, false)" v-has="'base:dict:delete'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="childListTotal>0" :total="childListTotal" :page.sync="childTreeQuery.current" :limit.sync="childTreeQuery.size" @pagination="getChildList" :small="true" />
          </div>
        </adaptive-card>
      </el-col>
    </el-row>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="dictForm" :model="dictForm" :rules="rules" label-width="100px" class="dictForm"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model.trim="dictForm.dictName" placeholder="输入字典名称" maxlength="32"/>
        </el-form-item>
        <el-form-item label="字典值" prop="dictCode">
          <el-input v-model.trim="dictForm.dictCode" placeholder="输入字典类型/字典值" maxlength="32"/>
        </el-form-item>
        <el-form-item label="字典排序" prop="dictOrder">
          <el-input v-model.number="dictForm.dictOrder" placeholder="输入字典排序" maxlength="32"/>
        </el-form-item>
        <el-form-item label="字典状态" prop="dictStatus">
          <el-radio-group v-model="dictForm.dictStatus">
            <el-radio :label="'1'">启用</el-radio>
            <el-radio :label="'0'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="dictForm.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
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
</template>

<script>
  import { fetchList, createDict, updateDict, deleteDict } from '@/api/system/dict'
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'dictTable',
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
      }
    },
    components: { AdaptiveCard, Pagination },
    data() {
      return {
        listTotal: 0,
        childListTotal: 0,
        expandAll: false,
        list: [],
        childList: [],
        rootFlag: false,
        expandTitle: 'dictTable.dictName',
        expandName: 'dictName',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogPvVisible: false,
        treeQuery: {
          current: 1,
          size: 10,
          parentId: 0,
          dictName: '',
          dictCode: ''
        },
        childTreeQuery: {
          current: 1,
          size: 10,
          parentId: -1,
          dictName: '',
          dictCode: ''
        },
        dictForm: {
          id: '',
          parentId: 0,
          dictName: '',
          dictCode: '',
          dictStatus: '1',
          dictOrder: '',
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        },
        rules: {
          dictName: [
            { required: true, message: '请输入字典名称', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          dictCode: [
            { required: true, message: '请输入字典值', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          dictOrder: [
            { required: true, message: '请输入字典排序', trigger: 'blur' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        args: [null, null, null],
        listLoading: false,
        childListLoading: false,
        currentParentId: '',
        isParentNode: false,
      }
    },
    created() {
      this.getList()
      this.getChildList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.treeQuery).then(response => {
          this.list = response.data.records
          this.listTotal = response.data.total
          this.listLoading = false
        })
      },
      getChildList() {
        this.childListLoading = true
        fetchList(this.childTreeQuery).then(response => {
          this.childList = response.data.records
          this.childListTotal = response.data.total
          this.childListLoading = false
        })
      },
      searchList() {
        this.treeQuery.current = 1
        this.getList()
      },
      searchChildList() {
        this.childTreeQuery.current = 1
        this.getChildList()
      },
      resetChildListQuery() {
        this.childTreeQuery = {
          parentId: -1,
          dictName: '',
          dictCode: ''
        }
      },
      resetListQuery() {
        this.treeQuery = {
          parentId: 0,
          dictName: '',
          dictCode: ''
        }
      },
      parentNodeClick(row) {
        this.currentParentId = row.id
        this.childTreeQuery.parentId = row.id
        this.childTreeQuery.current = 1
        this.getChildList()
      },
      handleCreate(row) {
        this.isParentNode = row
        if (!row && this.currentParentId == '') {
          this.$message({
            type: 'warning',
            message: '请点击左侧表格选择父节点!'
          })
          return
        }
        this.resetDictForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        console.log(this.dictForm.parentId)
        this.$nextTick(() => {
          this.$refs['dictForm'].clearValidate()
        })
      },
      resetDictForm() {
        this.dictForm.id = ''
        this.dictForm.dictName = ''
        this.dictForm.dictCode = ''
        this.dictForm.dictOrder = ''
        this.dictForm.comments = ''
        this.dictForm.children = []
        this.dictForm.dictStatus = '1'
        this.dictForm.parentId = 0
      },
      handleUpdate(row, isParent) {
        this.isParentNode = isParent
        this.dictForm = Object.assign({}, row) // copy obj
        // JSON不接受循环对象——引用它们自己的对象
        delete this.dictForm.parent
        delete this.dictForm.children
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.dictForm.dictStatus = this.dictForm.dictStatus + ''
        this.$nextTick(() => {
          this.$refs['dictForm'].clearValidate()
        })
      },
      handleDelete(row, isParent) {
        this.isParentNode = isParent
        this.$confirm(
          '此操作将永久删除该字典：' + row.dictName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteDict(row.id).then(() => {
              this.listLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.reloadTable()
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
        this.$refs['dictForm'].validate(valid => {
          if (valid) {
            console.log("this.isParentNode:",this.isParentNode)
            if (!this.isParentNode && this.currentParentId) {
              this.dictForm.parentId = this.currentParentId
            }
            createDict(this.dictForm).then(response => {
              this.dialogFormVisible = false
              this.dictForm.id = response.data.id
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.reloadTable()
            })
          }
        })
      },
      updateData() {
        this.$refs['dictForm'].validate(valid => {
          if (valid) {
            updateDict(this.dictForm).then(() => {
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.reloadTable()
            })
          }
        })
      },
      reloadTable() {
        if (!this.isParentNode && this.currentParentId) {
          this.childTreeQuery.current = 1
          this.getChildList()
        } else {
          this.treeQuery.current = 1
          this.getList()
        }

      }
    }
  }
</script>

<style scoped>

</style>
