<template>
  <div class="app-container content">
    <el-row :gutter="24">
      <el-input
        clearable
        placeholder="机构名称"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleFilter"
        v-model="treeQuery.organizationName">
      </el-input>
    </el-row>

    <el-row :gutter="24">
      <el-tree
        @node-click="handleTreeClick"
        ref="tree"
        :data="list"
        :props="propsOrg"
        check-strictly
        node-key="id"
        class="filter-container-card"
        highlight-current
        :expand-on-click-node="false"
        :default-expand-all="true"
      />
    </el-row>
  </div>
</template>

<script>
  import {
    fetchOrgList,
  } from '@/api/system/organization'
  export default {
    data() {
      return {
        treeQuery: {
          parentId: 0,
          organizationName: '',
          organizationKey: ''
        },
        list: [],
        baseList: [],
        propsOrg: {
          value: 'id',
          label: 'organizationName'
        },
        expandAll: false
      }
    },
    created() {
      // 获取组织机构树
      this.getOrganizationTree()
    },
    methods: {
      getOrganizationTree() {
        fetchOrgList(this.treeQuery).then(response => {
          this.list = response.data
          this.baseList = JSON.parse(JSON.stringify(response.data)) // 数组深复制
          console.log(this.list)
        })
      },
      handleTreeClick(row) {
        console.log(row)
        this.$emit("nodeClick",row)
      },
      handleFilter() {
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
  .el-row {
    margin-bottom: 20px;
  }
</style>
