<template>
  <crud-panel title="优惠券列表">
    <el-row slot="condition">
        <el-input placeholder="请输入优惠券" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getCouponsList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getCouponsList(true)">查询</el-button>
        <router-link :to="{ path: '/coupons/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="coupons" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="user.nickname" label="客户" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="coupon" label="优惠券" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="face_val" label="优惠金额" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="discount" label="折扣" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="enough_amount" label="最低消费" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="activation_date" label="激活日期" width="165" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expiration_date" label="失效日期" width="165" show-overflow-tooltip></el-table-column>
      <el-table-column prop="is_used" label="已使用" width="66" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="info" size="small" v-if="scope.row.is_used === 1">是</el-tag>
          <el-tag type="success" size="small" v-if="scope.row.is_used === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <router-link :to="{ path: '/coupons/edit/' + scope.row.id }">
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
      coupons: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getCouponsList()
  },
  methods: {
    getCouponsList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.COUPON + `?page=${this.page.page}&size=${this.page.size}&coupon=${this.keywords}`).then(data => {
        this.coupons = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getCouponsList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getCouponsList()
    },
    destroy (row) {
      this.$confirm(`确定删除优惠券“${row.coupon}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.delete(api.COUPON + '/destroy', {id: row.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getCouponsList()
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
