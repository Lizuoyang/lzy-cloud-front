<template>
  <div class="app-container content">
    <adaptive-card>
      <div slot="container">
        <div class="filter-container-card" style="margin-bottom: 50px">
          <el-form label-width="80px" :inline="true">
            <el-form-item label="存储类型:" prop="channelCode">
              <el-select v-model="listQuery.dfsType" placeholder="存储类型" clearable
                         class="filter-item" @keyup.enter.native="handleFilter">
                <el-option v-for="item in dfsTypeList" :key="item.id" :label="item.dictName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="存储编号:" prop="smsCode">
              <el-input v-model="listQuery.dfsCode" clearable placeholder="请输入存储编号"
                        class="filter-item"
                        maxlength="32" @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item style="float:right;">
              <el-button class="filter-item" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
              <el-button class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-edit"
                         @click="handleCreate">新增
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 存储配置列表 -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="存储分类" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dfsType | dfsTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="存储编号" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dfsCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="访问地址" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.accessUrlPrefix }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传地址" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.uploadUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="空间名称" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.bucket }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.dfsStatus | statusFilter">{{ scope.row.dfsStatus | statusNameFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="默认存储" width="" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.dfsDefault | defaultColorFilter">{{ scope.row.dfsDefault | defaultFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="访问控制" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.accessControl | accessControlFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="310" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" v-if="scope.row.dfsDefault !== 1" @click="handleModifyDefault(scope.row)">设为默认</el-button>
              <el-button v-if="scope.row.dfsStatus!='1'" size="mini" type="text"
                         @click="handleModifyStatus(scope.row,'1')"
              >启用
              </el-button>
              <el-button v-if="scope.row.dfsStatus!='0' && scope.row.dfsStatus!='2'" type="text" size="mini"
                         @click="handleModifyStatus(scope.row,'0')">禁用
              </el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)" >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页插件 -->
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

        <!-- 新增/编辑弹窗-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                   top="5vh" width="35%">
          <el-form ref="dfsForm" :model="dfsForm" :rules="rules" label-width="120px" class="dfsForm" style="width: 400px; margin-left:50px;">
            <el-form-item label="存储分类" prop="dfsType">
              <el-select v-model="dfsForm.dfsType" placeholder="请选择分布式存储分类" clearable style="width: 100%"
                         class="filter-item">
                <el-option v-for="item in dfsTypeList" :key="item.id" :label="item.dictName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="存储编号" prop="dfsCode">
              <el-input v-model="dfsForm.dfsCode" placeholder="请输入分布式存储编号"/>
            </el-form-item>
            <el-form-item label="访问地址前缀" prop="accessUrlPrefix">
              <el-input v-model="dfsForm.accessUrlPrefix" placeholder="请输入分布式文件访问地址前缀"/>
            </el-form-item>
            <el-form-item label="文件上传地址" prop="uploadUrl">
              <el-input v-model="dfsForm.uploadUrl" placeholder="请输入文件上传地址"/>
            </el-form-item>
            <el-form-item label="空间名称" prop="bucket">
              <el-input v-model="dfsForm.bucket" placeholder="请输入空间名称"/>
            </el-form-item>
            <el-form-item label="应用ID" prop="appId">
              <el-input v-model="dfsForm.appId" placeholder="请输入应用ID"/>
            </el-form-item>
            <el-form-item label="区域" prop="region">
              <el-input v-model="dfsForm.region" placeholder="请输入区域"/>
            </el-form-item>
            <el-form-item label="accessKey" prop="accessKey">
              <el-input v-model="dfsForm.accessKey" placeholder="请输入accessKey"/>
            </el-form-item>
            <el-form-item label="secretKey" prop="secretKey">
              <el-input v-model="dfsForm.secretKey" placeholder="请输入secretKey"/>
            </el-form-item>
            <el-form-item label="是否默认存储" prop="dfsDefault">
              <el-select v-model="dfsForm.dfsDefault" placeholder="默认存储" clearable style="width: 100%"
                         class="filter-item">
                <el-option v-for="item in defaultOption" :key="item.key" :label="item.label"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="dfsStatus">
              <el-select v-model="dfsForm.dfsStatus" placeholder="状态" clearable style="width: 100%"
                         class="filter-item">
                <el-option v-for="item in statusOption" :key="item.key" :label="item.label"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="访问控制" prop="accessControl">
              <el-select v-model="dfsForm.accessControl" placeholder="状态" clearable style="width: 100%"
                         class="filter-item">
                <el-option v-for="item in accessControlOption" :key="item.key" :label="item.label"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="comments">
              <el-input type="textarea" v-model="dfsForm.comments" placeholder="请输入备注信息"/>
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
  </div>
</template>

<script>
  let vm = {}
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Pagination from '@/components/Pagination'
  import { listDict } from '@/api/system/dict'
  import { queryDfsList, createDfs, updateDfs, deleteDfs, updateDfsStatus,updateDfsDefault } from '@/api/extensions/dfs/dfs'
  export default {
    components: {
      AdaptiveCard, Pagination
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          1: 'green',
          2: '',
          0: 'pink'
        }
        return statusMap[status]
      },
      statusNameFilter (status) {
        const statusNameMap = {
          1: '启用',
          0: '禁用'
        }
        return statusNameMap[status]
      },
      accessControlFilter (acc) {
        const accessControlMap = {
          1: '公开',
          0: '私有'
        }
        return accessControlMap[acc]
      },
      dfsTypeFilter (dfsType) {
        return vm.dfsTypeFilterMap[dfsType]
      },
      defaultColorFilter (def) {
        const defaultColorMap = {
          1: 'green',
          0: ''
        }
        return defaultColorMap[def]
      },
      defaultFilter (def) {
        const defaultMap = {
          1: '是',
          0: '否'
        }
        return defaultMap[def]
      }
    },
    created () {
      vm = this
      this.queryDfsTypeList()
    },
    data() {
      return {
        dfsTypeList: [],
        listQuery: {
          id: '',
          dfsType: '',
          dfsCode: '',
          dfsStatus: ''
        },
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        dfsForm: {
          id: '',
          dfsType: '',
          dfsCode: '',
          accessUrlPrefix: '',
          uploadUrl: '',
          bucket: '',
          appId: '',
          region: '',
          accessKey: '',
          secretKey: '',
          dfsDefault: 0,
          dfsStatus: 1,
          accessControl: 0,
          comments: ''
        },
        rules: {
          accessUrlPrefix: [
            { required: true, message: '请输入文件访问地址前缀', trigger: 'blur' },
            { min: 2, max: 255, message: '地址长度超出范围', trigger: 'blur' }
          ],
          uploadUrl: [
            { required: true, message: '请输入分布式存储上传地址', trigger: 'blur' },
            { min: 2, max: 255, message: '地址长度超出范围', trigger: 'blur' }
          ],
          accessKey: [
            { required: true, message: '请输入accessKey', trigger: 'blur' },
          ],
          secretKey: [
            { required: true, message: '请输入secretKey', trigger: 'blur' },
          ],
        },
        statusOption: [{ label: '启用', key: 1 }, { label: '禁用', key: 0 }],
        defaultOption: [{ label: '是', key: 1 }, { label: '否', key: 0 }],
        accessControlOption: [{ label: '公开', key: 1 }, { label: '私有', key: 0 }],
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        queryDfsList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      queryDfsTypeList () {
        const that = this
        that.listLoading = true
        listDict('DFS_TYPE').then(response => {
          that.dfsTypeList = response.data
          that.dfsTypeFilterMap = {}
          that.dfsTypeList.forEach((item, index, arr) => {
            that.dfsTypeFilterMap[item.id] = item.dictName
          })
          that.listLoading = false
          that.getList()
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      resetListQuery() {
        this.listQuery =  {
          id: '',
            dfsType: '',
            dfsCode: '',
            dfsStatus: ''
        }
      },
      handleCreate() {
        this.resetDfsForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dfsForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dfsForm'].validate(valid => {
          if (valid) {
            createDfs(this.dfsForm).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$message.success('创建成功')
            })
          }
        })
      },
      handleUpdate(row) {
        this.dfsForm = Object.assign({}, row) // copy obj
        this.dfsForm.dfsType = parseInt(this.dfsForm.dfsType)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dfsForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dfsForm'].validate(valid => {
          if (valid) {
            updateDfs(this.dfsForm).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$message.success('更新成功')
            })
          }
        })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateDfsStatus(row.id, status).then(() => {
          this.listLoading = false
          row.dfsStatus = status
          this.$message.success('状态修改成功')
        })
      },
      handleModifyDefault (row) {
        this.listLoading = true
        updateDfsDefault(row.id).then(() => {
          this.listLoading = false
          row.dfsDefault = 1
          this.$message.success('已设置为默认')
        })
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该存储配置，是否继续? ',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteDfs(row.id).then(() => {
              this.listLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const index = this.list.indexOf(row)
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
      resetDfsForm() {
        this.dfsForm = {
          id: '',
            dfsType: '',
            dfsCode: '',
            accessUrlPrefix: '',
            uploadUrl: '',
            bucket: '',
            appId: '',
            region: '',
            accessKey: '',
            secretKey: '',
            dfsDefault: 0,
            dfsStatus: 1,
            accessControl: 0,
            comments: ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
