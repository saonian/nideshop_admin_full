<template>
  <crud-panel title="快递列表">
    <el-row slot="condition">
        <el-input placeholder="请输入快递名称" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getCouriersList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getCouriersList(true)">查询</el-button>
        <router-link :to="{ path: '/couriers/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="couriers" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="快递名称" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="快递鸟编码" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort_order" label="排序" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="{ path: '/couriers/edit/' + scope.row.id }">
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
      couriers: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getCouriersList()
  },
  methods: {
    getCouriersList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.COURIER + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        if (data.errno === 0) {
          this.couriers = data.data.data
          this.page.total = data.data.count
        }
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getCouriersList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getCouriersList()
    },
    destroy (row) {
      this.$confirm(`确定删除快递“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.COURIER + '/destroy', {id: row.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getCouriersList()
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
