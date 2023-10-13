<template>
  <div class="app-container content">
    <adaptive-card>
      <div slot="container">
        <div class="filter-container-card" style="margin-bottom: 50px">
          <el-form label-width="80px" :inline="true">
            <el-form-item label="短信渠道:" prop="channelId">
              <el-select v-model="listSmsTemplateQuery.channelId" placeholder="短信渠道" clearable style="width: 180px"
                         class="filter-item" @keyup.enter.native="handleFilter">
                <el-option v-for="(item,index) in smsChannelList" :key="item.id + index" :label="item.channelName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="短信编码:" prop="smsCode">
              <el-input v-model="listSmsTemplateQuery.smsCode" clearable placeholder="请输入短信编码" style="width: 150px;"
                        class="filter-item"
                        maxlength="32" @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item label="短信名称:" prop="smsName">
              <el-input v-model="listSmsTemplateQuery.smsName" clearable placeholder="请输入短信名称" style="width: 150px;"
                        class="filter-item"
                        maxlength="32" @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item label="模板ID:" prop="templateId">
              <el-input v-model="listSmsTemplateQuery.templateId" clearable placeholder="请输入模板ID" style="width: 150px;"
                        class="filter-item"
                        maxlength="64" @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button class="filter-item" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
              <el-button class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-edit"
                         @click="handleCreate" >新增
              </el-button>
            </el-form-item>
          </el-form>

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
            <el-table-column label="短信渠道" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.channelId | channelFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="短信编码" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.smsCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="短信名称" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.smsName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模板ID" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.templateId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="短信签名" width="150" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.signName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="短信状态" width="" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.templateStatus | statusFilter">{{ scope.row.templateStatus | statusNameFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="短信类型" width="" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.templateType | templateTypeDictFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="缓存有效期" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.cacheTimeOut }}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期单位" width="100" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.cacheTimeOutUnit | timeUnitDictFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发送次数限制" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTimesLimit }}</span>
              </template>
            </el-table-column>
            <el-table-column label="限制时间间隔" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTimesLimitPeriod }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间间隔单位" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.sendTimesLimitPeriodUnit | timeUnitDictFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" width="500" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.comments }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="310" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleUpdate(scope.row)" >编辑
                </el-button>
                <el-button v-if="scope.row.templateStatus!='1'" size="mini" type="text"
                           @click="handleModifyStatus(scope.row,'1')"
                           >启用
                </el-button>
                <el-button v-if="scope.row.templateStatus!='0' && scope.row.templateStatus!='2'" type="text" size="mini"
                           @click="handleModifyStatus(scope.row,'0')" >禁用
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)" >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页插件 -->
          <pagination v-show="total>0" :total="total" :page.sync="listSmsTemplateQuery.current" :limit.sync="listSmsTemplateQuery.size" @pagination="getList" />

          <!-- 新增/编辑弹窗-->
          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                     top="5vh" width="35%">
            <el-form ref="smsTemplateForm" :model="smsTemplateForm" :rules="rules" label-width="100px"
                     class="smsTemplateForm" style="width: 400px; margin-left:50px;">
              <el-form-item label="短信渠道" prop="channelId">
                <el-select v-model="smsTemplateForm.channelId" placeholder="请选择短信渠道" clearable style="width: 100%"
                           class="filter-item">
                  <el-option v-for="(item,index) in smsChannelList" :key="item.id + index" :label="item.channelName"
                             :value="item.id"/>
                </el-select>
              </el-form-item>

              <el-form-item label="短信编码" prop="smsCode">
                <el-input v-model="smsTemplateForm.smsCode" placeholder="请输入自定义短信编码" maxlength="32"/>
              </el-form-item>
              <el-form-item label="短信名称" prop="smsName">
                <el-input v-model="smsTemplateForm.smsName" placeholder="请输入短信名称" maxlength="32"/>
              </el-form-item>
              <el-form-item label="模板ID" prop="templateId">
                <el-input v-model="smsTemplateForm.templateId" placeholder="请输入短信服务商的模板ID" maxlength="32"/>
              </el-form-item>
              <el-form-item label="短信签名" prop="signName">
                <el-input v-model="smsTemplateForm.signName" placeholder="请输入短信签名" maxlength="64"/>
              </el-form-item>
              <el-form-item label="短信状态" prop="templateStatus">
                <el-radio-group v-model="smsTemplateForm.templateStatus">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="短信类型" prop="templateType">
                <el-select v-model="smsTemplateForm.templateType" placeholder="短信类型" clearable style="width: 100%"
                           class="filter-item">
                  <el-option v-for="(item,index) in smsTypeDict.dictList" :key="item.id + index" :label="item.dictName"
                             :value="item.dictCode"/>
                </el-select>
              </el-form-item>
              <el-row v-show="smsTemplateForm.templateType == '1'">
                <el-form-item label="缓存有效期" prop="cacheTimeOut" >
                  <el-input-number v-model="smsTemplateForm.cacheTimeOut" placeholder="缓存有效期" :min="0"
                                   :max="9223372036854775807"/>
                </el-form-item>
                <el-form-item label="有效期单位" prop="cacheTimeOutUnit">
                  <el-select v-model="smsTemplateForm.cacheTimeOutUnit" placeholder="有效期单位" clearable style="width: 100%"
                             class="filter-item" @keyup.enter.native="handleFilter">
                    <el-option v-for="(item,index) in timeUnitDict.dictList" :key="item.id + index" :label="item.dictName"
                               :value="item.dictCode"/>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-form-item label="发送次数限制" prop="sendTimesLimit">
                <el-input-number v-model="smsTemplateForm.sendTimesLimit" placeholder="缓存有效期" :min="0"
                                 :max="9223372036854775807"/>
              </el-form-item>
              <el-form-item label="限制时间间隔" prop="sendTimesLimitPeriod">
                <el-input-number v-model="smsTemplateForm.sendTimesLimitPeriod" placeholder="限制时间间隔" :min="0"
                                 :max="9223372036854775807"/>
              </el-form-item>
              <el-form-item label="时间间隔单位" prop="sendTimesLimitPeriodUnit">
                <el-select v-model="smsTemplateForm.sendTimesLimitPeriodUnit" placeholder="请选择时间间隔单位" clearable style="width: 100%"
                           class="filter-item" @keyup.enter.native="handleFilter">
                  <el-option v-for="(item,index) in timeUnitDict.dictList" :key="item.id + index" :label="item.dictName"
                             :value="item.dictCode"/>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="comments">
                <el-input v-model="smsTemplateForm.comments" placeholder="请输入描述" maxlength="255" type="textarea"/>
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
    </adaptive-card>
  </div>
</template>

<script>
  import AdaptiveCard from '@/components/AdaptiveCard'
  import Pagination from '@/components/Pagination'
  import {deleteSmsChannel, querySmsChannelListAll} from '@/api/extensions/sms/smsChannel'
  import { querySmsTemplateList,checkSmsTemplateExist, createSmsTemplate, deleteSmsTemplate,updateSmsTemplateStatus,updateSmsTemplate } from '@/api/extensions/sms/smsTemplate'
  import {listDict, batchListDict} from '@/api/system/dict'
  let vm = {}
  export default {
    components: { AdaptiveCard, Pagination },
    created() {
      const that = this
      // 获取配置好的短信渠道列表
      that.getSmsChannelList();
      const dictList = [that.smsTypeDict,  that.timeUnitDict]
      const dictCodeList = dictList.map(function (n) {
        return n.dictCode
      })
      this.getBatchDataDictList(dictCodeList).then(function (result) {
        dictList.forEach(function (dict) {
          dict.dictList = result[dict.dictCode]
          dict.filterMap = {}
          dict.dictList.forEach((item, index, arr) => {
            dict.filterMap[item.dictCode] = item.dictName
          })
        })
        that.getList()
      })
    },
    filters: {
      // 短信渠道数据字典展示
      channelFilter (channelId) {
        return vm.smsChannelMap[channelId]
      },
      // 短信类型数据字典展示
      templateTypeDictFilter (dictCode) {
        return vm.smsTypeDict.filterMap[dictCode]
      },
      // 时间单位
      timeUnitDictFilter (dictCode) {
        return vm.timeUnitDict.filterMap[dictCode]
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
    data() {
      vm = this
      // 增加或更新记录时，判断字段是否已经存在
      var validSmsCode = (rule, value, callback) => {
        var keyData = {
          id: this.smsTemplateForm.id,
          checkField: 'sms_code',
          checkValue: value
        }
        checkSmsTemplateExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('记录已存在')) // 这里改为字段名称
          } else {
            callback()
          }
        })
      }
      var validSmsName = (rule, value, callback) => {
        var keyData = {
          id: this.smsTemplateForm.id,
          checkField: 'sms_name',
          checkValue: value
        }
        checkSmsTemplateExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('记录已存在')) // 这里改为字段名称
          } else {
            callback()
          }
        })
      }
      return {
        smsTypeDict: {
          dictCode: 'SMS_TYPE',
          dictList: [],
          filterMap: {}
        },
        timeUnitDict: {
          dictCode: 'TIME_UNIT',
          dictList: [],
          filterMap: {}
        },
        smsChannelList: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listSmsTemplateQuery: {
          current: 1,
          size: 10,
          channelId: undefined, // 短信渠道
          smsCode: undefined, // 短信编码
          smsName: undefined, // 短信名称
          templateId: undefined, // 模板ID
        },
        smsTemplateForm: {
          channelId: undefined,
          smsCode: undefined,
          smsName: undefined,
          templateId: undefined,
          signName: undefined,
          templateStatus: 1,
          templateType: '1',
          cacheCodeKey: undefined,
          cacheTimeOut: '0',
          cacheTimeOutUnit: 'MINUTES',
          sendTimesLimit: '0',
          sendTimesLimitPeriod: '0',
          sendTimesLimitPeriodUnit: 'MINUTES',
          comments: undefined
        },
        rules: {
          // 字段校验
          channelId: [
            { required: true, message: '请输入短信渠道', trigger: 'blur' }
          ],
          smsCode: [
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string' },
            { validator: validSmsCode, trigger: 'blur' },
            { required: true, message: '请输入短信编码', trigger: 'blur' }
          ],
          smsName: [
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string' },
            { validator: validSmsName, trigger: 'blur' },
            { required: true, message: '请输入短信名称', trigger: 'blur' }
          ],
          templateId: [
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur', type: 'string' },
            { required: true, message: '请输入模板ID', trigger: 'blur' }
          ],
          signName: [
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur', type: 'string' },
            { required: true, message: '请输入短信签名', trigger: 'blur' }
          ],
          templateStatus: [
            { required: true, message: '请输入短信状态', trigger: 'blur' }
          ],
          cacheCodeKey: [
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur', type: 'string' }
          ],
          cacheTimeOut: [
          ],
          cacheTimeOutUnit: [
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string' }
          ],
          sendTimesLimit: [
          ],
          sendTimesLimitPeriod: [
          ],
          sendTimesLimitPeriodUnit: [
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur', type: 'string' }
          ],
          comments: [
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur', type: 'string' }
          ]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        smsChannelMap: {}
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        querySmsTemplateList(this.listSmsTemplateQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      async getBatchDataDictList (dictParams) {
        const that = this
        let result = {}
        that.listLoading = true
        await batchListDict(dictParams).then(response => {
          result = response.data
          that.listLoading = false
        })
        return result
      },
      async getSmsChannelList() {
        this.listLoading = true
        await querySmsChannelListAll({}).then(response => {
          this.smsChannelList = response.data
          this.smsChannelMap = {}
          this.smsChannelList.forEach((item, index, arr) => {
            this.smsChannelMap[item.id] = item.channelName
          })
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listSmsTemplateQuery.current = 1
        this.getList()
      },
      resetListQuery() {
        this.listSmsTemplateQuery =  {
          current: 1,
            size: 10,
            channelId: undefined, // 短信渠道
            smsCode: undefined, // 短信编码
            smsName: undefined, // 短信名称
            templateId: undefined, // 模板ID
        }
        this.getList()
      },
      handleCreate() {
        this.resetSmsTemplateForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['smsChannelForm'].clearValidate()
        })
      },
      resetSmsTemplateForm() {
        this.smsTemplateForm =  {
          channelId: undefined,
            smsCode: undefined,
            smsName: undefined,
            templateId: undefined,
            signName: undefined,
            templateStatus: 1,
            templateType: '1',
            cacheCodeKey: undefined,
            cacheTimeOut: '0',
            cacheTimeOutUnit: 'MINUTES',
            sendTimesLimit: '0',
            sendTimesLimitPeriod: '0',
            sendTimesLimitPeriodUnit: 'MINUTES',
            comments: undefined
        }
      },
      handleUpdate(row) {
        this.smsTemplateForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.smsTemplateForm.templateStatus = row.templateStatus
        this.smsTemplateForm.templateType = row.templateType + ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['smsTemplateForm'].clearValidate()
        })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateSmsTemplateStatus(row.id, status).then(() => {
          this.listLoading = false
          row.templateStatus = status
          this.$message.success('状态修改成功')
        })
      },
      handleDelete(data) {
        this.$confirm(
          '此操作将永久删除该渠道配置：' + data.smsName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteSmsTemplate(data.id).then(() => {
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
        this.$refs['smsTemplateForm'].validate(valid => {
          if (valid) {
            createSmsTemplate(this.smsTemplateForm).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$message.success('创建成功')
            })
          }
        })
      },
      updateData() {
        this.$refs['smsTemplateForm'].validate(valid => {
          if (valid) {
            updateSmsTemplate(this.smsTemplateForm).then(() => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.$message.success('更新成功')
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
