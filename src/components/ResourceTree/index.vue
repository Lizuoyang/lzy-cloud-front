<template>
  <div class="app-container content">
    <el-row :gutter="24">
      <el-input
        clearable
        placeholder="资源名称"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleFilter"
        v-model="treeQuery.resourceName">
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
  import { fetchResourceTree } from '@/api/system/resource'
  export default {
    data() {
      return {
        treeQuery: {
          parentId: 0,
          resourceKey: '',
          resourceName: ''
        },
        list: [],
        baseList: [],
        propsOrg: {
          value: 'id',
          label: 'resourceName'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        fetchResourceTree(this.treeQuery).then(response => {
          console.log(response)
          this.list = response.data
          this.baseList = JSON.parse(JSON.stringify(response.data)) // 数组深复制
        })
      },
      handleTreeClick(row) {
        this.$emit("nodeClick",row)
      },
      handleFilter() {
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
        var haveFlag = false
        var len = dataList.length - 1
        if (len < 0) {
          return haveFlag
        }
        var haveFlagArray = new Array(dataList.length)
        for (let i = len; i >= 0; i--) {
          var isname = this.treeQuery.resourceName !== ''
          var hasname =
            dataList[i].resourceName.indexOf(
              this.treeQuery.resourceName
            ) >= 0
          var iskey = this.treeQuery.resourceKey !== ''
          var haskey =
            dataList[i].resourceKey.indexOf(this.treeQuery.resourceKey) >=
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
