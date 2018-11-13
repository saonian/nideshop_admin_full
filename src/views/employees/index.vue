<template>
  <crud-panel title="管理员列表">
    <el-row slot="condition">
        <router-link :to="{ path: '/employees/add' }" v-if="$store.getters.userInfo.username === 'admin'">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="employees" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="last_login_ip" label="最后登录IP" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="last_login_time" label="最后登录时间" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column prop="add_time" label="创建日期" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="{ path: '/employees/edit/' + scope.row.id }" v-if="scope.row.username === $store.getters.userInfo.username || $store.getters.userInfo.username === 'admin'">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button v-if="scope.row.username !== 'admin' && $store.getters.userInfo.username === 'admin'" type="danger" size="mini" icon="el-icon-delete" @click="destroy(scope.row)">删除</el-button>
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
      employees: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getEmployeesList()
  },
  methods: {
    getEmployeesList () {
      this.tbloading = true
      this.$http.get(api.EMPLOYEE).then(data => {
        this.employees = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getEmployeesList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getEmployeesList()
    },
    destroy (row) {
      this.$confirm(`确定删除管理员“${row.username}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.EMPLOYEE + '/destroy', {id: row.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getEmployeesList()
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
