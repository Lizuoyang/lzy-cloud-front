<template>
  <div class="app-container content">
    <adaptive-card>
      <div slot="container">
        <div class="filter-container-card" style="margin-bottom: 50px">
          <!-- 用户列表查询条件 -->
          <div class="text item">
            <el-form label-width="80px" :inline="true">
              <el-form-item label="短信渠道:" prop="channelCode">
                <el-select v-model="listSmsChannelQuery.channelCode" placeholder="短信渠道" clearable style="width: 180px"
                           class="filter-item" @keyup.enter.native="handleFilter">
                  <el-option v-for="item in channelCodeDict.dictList" :key="item.id" :label="item.dictName"
                             :value="item.dictCode"/>
                </el-select>
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
        </div>

        <el-tag type="warning" style="float: right; margin-bottom: 10px">请注意：默认只允许有一个渠道是启用状态，当启用多个渠道时，会随机选取一个渠道进行短信发送，请保证各个渠道正常可用</el-tag>

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
          <el-table-column label="渠道编码" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.channelCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道名称" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.channelName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="短信数量" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.smsQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效期" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.smsValidity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道状态" width="" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.channelStatus | statusFilter">{{ scope.row.channelStatus | statusNameFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="描述" width="" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="310" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑
              </el-button>
              <el-button v-if="scope.row.channelStatus!='1'" size="mini" type="text"
                         @click="handleModifyStatus(scope.row,'1')"
                         >启用
              </el-button>
              <el-button v-if="scope.row.channelStatus!='0' && scope.row.channelStatus!='2'" type="text" size="mini"
                         @click="handleModifyStatus(scope.row,'0')">禁用
              </el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)" >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页插件 -->
        <pagination v-show="total>0" :total="total" :page.sync="listSmsChannelQuery.current" :limit.sync="listSmsChannelQuery.size" @pagination="getList" />

        <!-- 新增/编辑弹窗-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                   top="5vh" width="35%">
          <el-form ref="smsChannelForm" :model="smsChannelForm" :rules="rules" label-width="100px"
                   class="smsChannelForm" style="width: 400px; margin-left:50px;">
            <el-form-item label="短信渠道" prop="channelCode">
              <el-select v-model="smsChannelForm.channelCode" placeholder="请选择短信渠道" clearable style="width: 100%"
                         @change="handleChannelChange"
                         class="filter-item">
                <el-option v-for="item in channelCodeDict.dictList" :key="item.id" :label="item.dictName"
                           :value="item.dictCode"/>
              </el-select>
            </el-form-item>
            <el-form-item label="SecretId" prop="secretId">
              <el-input v-model="smsChannelForm.secretId" placeholder="请输入SecretId"/>
            </el-form-item>
            <el-form-item label="SecretKey" prop="secretKey">
              <el-input v-model="smsChannelForm.secretKey" placeholder="请输入SecretKey"/>
            </el-form-item>
            <el-form-item label="RegionId" prop="regionId">
              <el-input v-model="smsChannelForm.regionId" placeholder="请输入RegionId"/>
            </el-form-item>
            <el-form-item label="渠道状态" prop="channelStatus">
              <el-radio-group v-model="smsChannelForm.channelStatus">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="短信数量" prop="smsQuantity">
              <el-input-number v-model="smsChannelForm.smsQuantity" placeholder="短信数量,0为不限制" :min="0"
                               :max="9223372036854775807"/>
            </el-form-item>
            <el-form-item label="有效期" prop="smsValidity">
              <el-date-picker v-model.trim="smsChannelForm.smsValidity" placeholder="有效期" type="datetime"
                              style="width: 100%;" default-time="23:59:59" value-format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
            <el-form-item label="描述" prop="comments">
              <el-input type="textarea" v-model="smsChannelForm.comments" placeholder="请输入描述"/>
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
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Pagination from '@/components/Pagination'
  import {listDict} from '@/api/system/dict'
  import {
    querySmsChannelList,
    checkSmsChannelExist,
    createSmsChannel,
    deleteSmsChannel,
    updateSmsChannelStatus,
    updateSmsChannel
  } from '@/api/extensions/sms/smsChannel'

  export default {
    components: { AdaptiveCard,Pagination },
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
    },
    data() {
      // 增加或更新记录时，判断字段是否已经存在
      var validSmsChannel = (rule, value, callback) => {
        var keyData = {
          id: this.smsChannelForm.id,
          checkField: 'channel_code',
          checkValue: value
        }
        checkSmsChannelExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('记录已存在'))
          } else {
            callback()
          }
        })
      }
      return {
        channelCodeDict: {
          dictCode: 'SMS_CHANNEL',
          dictList: [],
          filterMap: {}
        },
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listSmsChannelQuery: {
          current: 1,
          size: 10,
          channelCode: undefined, // 渠道编码
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        smsChannelForm: {
          channelCode: undefined,
          channelName: undefined,
          secretId: undefined,
          secretKey: undefined,
          regionId: undefined,
          channelStatus: 1,
          smsQuantity: '0',
          smsValidity: undefined,
          comments: undefined
        },
        rules: {
          channelCode: [
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string'},
            {required: true, message: '请输入渠道编码', trigger: 'blur'},
            {validator: validSmsChannel, trigger: 'blur'}
          ],
          channelName: [
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string'},
            {required: true, message: '请输入渠道名称', trigger: 'blur'}
          ],
          secretId: [
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur', type: 'string'},
            {required: true, message: '请输入SecretId', trigger: 'blur'}
          ],
          secretKey: [
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur', type: 'string'},
            {required: true, message: '请输入SecretKey', trigger: 'blur'}
          ],
          regionId: [
            {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur', type: 'string'},
            {required: true, message: '请输入RegionId', trigger: 'blur'}
          ],
          channelStatus: [
            {required: true, message: '请输入渠道状态', trigger: 'blur'}
          ],
          comments: [
            {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur', type: 'string'}
          ]
        },
      }
    },
    created() {
      // 获取短信渠道列表
      this.getSmsChannels()
      // 获取短信渠道配置列表
      this.getList()
    },
    methods: {
      getSmsChannels() {
        listDict(this.channelCodeDict.dictCode).then(response => {
          this.channelCodeDict.dictList = response.data
          console.log("getSmsChannels:", this.channelCodeDict.dictList)
        })
      },
      getList() {
        this.listLoading = true
        querySmsChannelList(this.listSmsChannelQuery).then(response => {
          console.log("querySmsChannelList: ", response)
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listSmsChannelQuery.current = 1
        this.getList()
      },
      resetListQuery() {
        this.listSmsChannelQuery = {
          current: 1,
          size: 10,
          channelCode: undefined,
        }
        this.getList()
      },
      handleCreate() {
        this.resetSmsChannelForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['smsChannelForm'].clearValidate()
        })
      },
      resetSmsChannelForm() {
        this.smsChannelForm = {
          channelCode: undefined, // 渠道编码
          channelName: undefined, // 渠道名称
          secretId: undefined, // SecretId
          secretKey: undefined, // SecretKey
          regionId: undefined, // RegionId
          channelStatus: 1, // 渠道状态
          smsQuantity: '0', // 短信数量
          smsValidity: undefined, // 有效期
          comments: undefined // 描述
        }
      },
      handleUpdate(row) {
        this.smsChannelForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['smsChannelForm'].clearValidate()
        })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateSmsChannelStatus(row.id, status).then(() => {
          this.listLoading = false
          row.channelStatus = status
          this.$message.success('状态修改成功')
        })
      },
      handleDelete(data) {
        this.$confirm(
          '此操作将永久删除该渠道配置：' + data.channelName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteSmsChannel(data.id).then(() => {
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
        this.$refs['smsChannelForm'].validate(valid => {
          if (valid) {
            createSmsChannel(this.smsChannelForm).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$message.success('创建成功')
            })
          }
        })
      },
      updateData() {
        this.$refs['smsChannelForm'].validate(valid => {
          if (valid) {
            updateSmsChannel(this.smsChannelForm).then(() => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.$message.success('更新成功')
            })
          }
        })
      },
      handleChannelChange(value) {
        this.smsChannelForm.channelName = this.channelCodeDict.dictList.filter(f => f.dictCode == value).map(m => m.dictName)[0]
      }
    }
  }
</script>

<style scoped>

</style>
