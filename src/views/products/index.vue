<template>
  <crud-panel title="商品列表">
    <el-row slot="condition">
        <el-input placeholder="请输入关键字" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getProductsList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getProductsList(true)">查询</el-button>
        <router-link :to="{ path: '/products/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="products" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="cat_name" label="商品分类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="商品名称" width="360" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goods_sn" label="SKU" width="80"></el-table-column>
      <el-table-column prop="retail_price" label="零售价" align="right" width="80"></el-table-column>
      <el-table-column prop="sell_volume" label="销量" align="right" width="80"></el-table-column>
      <el-table-column prop="is_new" label="新品" align="center" width="65">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_new === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_new === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_on_sale" label="在售" align="center" width="65">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_on_sale === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_on_sale === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="need_express" label="物流" align="center" width="65">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.need_express === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.need_express === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="add_time" label="创建日期" width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <router-link :to="{ path: '/products/edit/' + scope.row.id }">
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
      products: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getProductsList()
  },
  methods: {
    getProductsList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.GOODS + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.products = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      }).catch(err => {
        this.tbloading = false
        this.$message.error(err + '')
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getProductsList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getProductsList()
    },
    destroy (row) {
      this.$confirm(`确定删除商品“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.GOODS + '/destroy', {id: row.id}).then(data => {
          if (data.errno === 0) {
            this.$notify({title: '成功', message: '删除成功', type: 'success'})
            this.getProductsList()
          }
        })
      }).catch(err => {
        this.$message.error(err + '')
      })
    }
  }
}
</script>

<style scoped>

</style>
