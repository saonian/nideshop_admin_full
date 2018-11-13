<template>
  <crud-panel title="品牌列表">
    <el-row slot="condition">
        <el-input placeholder="请输入品牌名称" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getBrandsList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getBrandsList(true)">查询</el-button>
        <router-link :to="{ path: '/brands/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="brands" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="品牌名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="floor_price" label="起步价" align="right" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="is_new" label="首页显示" align="center" width="100">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_new === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_new === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_show" label="是否显示" align="center" width="100">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_new === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_new === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="列表排序" align="right" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="home_sort_order" label="首页排序" align="right" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="{ path: '/brands/edit/' + scope.row.id }">
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
      dialogFormVisible: false,
      addSpec: {
        id: null,
        name: '',
        sort_order: 50
      },
      tbloading: false,
      brands: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getBrandsList()
  },
  methods: {
    getBrandsList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.BRAND + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.brands = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getBrandsList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getBrandsList()
    },
    destroy (row) {
      this.$confirm(`确定删除品牌类型“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.BRAND + '/destory', {id: row.id}).then(data => {
          if (data.errno === 0) {
            this.$notify({title: '成功', message: '删除成功', type: 'success'})
            this.getBrandsList()
          }
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
