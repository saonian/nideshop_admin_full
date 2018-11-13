<template>
  <crud-panel title="发票列表">
    <el-row slot="condition">
        <el-input placeholder="请输入关键字" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getInvoicesList" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getInvoicesList">查询</el-button>
    </el-row>
    <el-table :data="invoices" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="customer.name" label="客户" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="抬头类型" width="80" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="抬头名称" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tax_number" label="税号(纳税人识别号)" min-width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="{ path: '/invoices/edit/' + scope.row.id }">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="destroy(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      slot="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </crud-panel>
</template>

<script>
import * as api from 'api'

export default {
  data () {
    return {
      tbloading: false,
      invoices: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getInvoicesList()
  },
  methods: {
    getInvoicesList () {
      this.tbloading = true
      this.$http.get(api.INVOICE + `?page=${this.page.page}&size=${this.page.size}&q=${this.keywords}`).then(data => {
        this.invoices = data.data
        this.page.total = data.total
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getInvoicesList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getInvoicesList()
    },
    destroy (row) {
      this.$confirm(`确定删除发票“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.delete(api.INVOICE + '/' + row.id).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getInvoicesList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    formatter (row, column) {
      let types = {company: '单位', personal: '个人'}
      return types[row.type]
    }
  }
}
</script>

<style scoped>

</style>
