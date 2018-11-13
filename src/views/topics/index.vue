<template>
  <crud-panel title="专题列表">
    <el-row slot="condition">
        <el-input placeholder="请输入关键字" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getTopicsList" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getTopicsList">查询</el-button>
        <router-link :to="{ path: '/topics/add' }">
          <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
    </el-row>
    <el-table :data="topics" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="分类" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="title" label="标题" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subtitle" label="描述" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort_order" label="排序" align="right" width="60" show-overflow-tooltip></el-table-column>
      <el-table-column prop="is_show" label="状态" align="center" width="65">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.is_show === 1">显示</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.is_show === 0">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <router-link :to="{ path: '/topics/edit/' + scope.row.id }">
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
      topics: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getTopicsList()
  },
  methods: {
    getTopicsList () {
      this.tbloading = true
      this.$http.get(api.TOPIC + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.topics = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getTopicsList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getTopicsList()
    },
    destroy (row) {
      this.$confirm(`确定删除专题“${row.title}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.delete(api.TOPIC + '/destroy?id=' + row.id).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getTopicsList()
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
