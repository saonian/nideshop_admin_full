<template>
  <crud-panel title="地址列表">
    <el-row slot="condition">
        <el-input placeholder="请输入地址" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getAddressesList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getAddressesList(true)">查询</el-button>
        <router-link :to="{ path: '/addresses/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="addresses" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="user.nickname" label="客户" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="收件人" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="province" label="省" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="city" label="城市" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="district" label="地区" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="地址" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="is_default" label="默认地址" align="center" width="80">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_default === 1">是</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_default === 0">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="{ path: '/addresses/edit/' + scope.row.id }">
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
      addresses: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getAddressesList()
  },
  methods: {
    getAddressesList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.ADDRESS + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.addresses = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getaddressesList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getAddressesList()
    },
    destroy (row) {
      this.$confirm(`确定删除地址“${row.full_address}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.ADDRESS + '/destroy', {id: row.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getAddressesList()
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
