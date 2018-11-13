<template>
  <crud-panel title="客户列表">
    <el-row slot="condition">
        <el-input placeholder="请输入昵称" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getCustomersList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getCustomersList(true)">查询</el-button>
    </el-row>
    <el-table :data="customers" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="50" height="50" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" width="65">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.gender === 1">男</el-tag>
          <el-tag type="danger" size="small" v-if="scope.row.gender === 0">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_login_ip" label="最后登录IP" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="last_login_time" label="最后登录" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column prop="add_time" label="注册日期" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-fa fa-mouse-pointer" @click="showFootprint(scope.row)">足迹</el-button>
          <el-button type="danger" size="mini" icon="el-icon-fa fa-heart" @click="showCollect(scope.row)">收藏</el-button>
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
    <el-dialog :title="curRow.nickname + '的足迹'" :visible.sync="dialogVisible1" width="60%">
      <el-table :data="footprints" stripe border v-loading="tbloading1">
        <el-table-column label="商品图片" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <img width="70" height="70" :src="scope.row.list_pic_url"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_sn" label="商品编号" align="center" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="add_time" label="访问时间" width="170" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="page1.page"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :page-size="page1.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page1.total">
      </el-pagination>
    </el-dialog>
    <el-dialog :title="curRow.nickname + '的收藏'" :visible.sync="dialogVisible2" width="60%">
      <el-table :data="collects" stripe border v-loading="tbloading2">
        <el-table-column label="商品图片" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <img width="70" height="70" :src="scope.row.list_pic_url"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_sn" label="商品编号" align="center" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="add_time" label="添加时间" align="center" width="170" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="page2.page"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :page-size="page2.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page2.total">
      </el-pagination>
    </el-dialog>
  </crud-panel>
</template>

<script>
import * as api from 'api'

export default {
  data () {
    return {
      tbloading: false,
      tbloading1: false,
      tbloading2: false,
      customers: [],
      footprints: [],
      collects: [],
      keywords: '',
      dialogVisible1: false,
      dialogVisible2: false,
      curRow: {},
      page: {
        size: 10,
        page: 1,
        total: 0
      },
      page1: {
        size: 5,
        page: 1,
        total: 0
      },
      page2: {
        size: 5,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getCustomersList()
  },
  methods: {
    getCustomersList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.CUSTOMER + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.customers = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading = false
      })
    },
    getFootprint () {
      this.tbloading1 = true
      this.$http.get(api.CUSTOMER + `/footprint?uid=${this.curRow.id}&page=${this.page1.page}&size=${this.page1.size}`).then(data => {
        data.data.data.forEach(item => {
          if (!/^http/i.test(item.list_pic_url)) {
            item.list_pic_url = api.QiniuDomain + item.list_pic_url
          }
        })
        this.footprints = data.data.data
        this.page1.total = data.data.count
        this.tbloading1 = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading1 = false
      })
    },
    getCollect () {
      this.tbloading2 = true
      this.$http.get(api.CUSTOMER + `/collect?uid=${this.curRow.id}&page=${this.page2.page}&size=${this.page2.size}`).then(data => {
        data.data.data.forEach(item => {
          if (!/^http/i.test(item.list_pic_url)) {
            item.list_pic_url = api.QiniuDomain + item.list_pic_url
          }
        })
        this.collects = data.data.data
        this.page2.total = data.data.count
        this.tbloading2 = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading2 = false
      })
    },
    showFootprint (row) {
      if (this.curRow.id !== row.id) {
        this.page1.page = 1
      }
      this.curRow = row
      this.dialogVisible1 = true
      this.getFootprint()
    },
    showCollect (row) {
      if (this.curRow.id !== row.id) {
        this.page2.page = 1
      }
      this.curRow = row
      this.dialogVisible2 = true
      this.getCollect()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getcustomersList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getCustomersList()
    },
    handleSizeChange1 (val) {
      this.page1.size = val
      this.getcustomersList()
    },
    handleCurrentChange1 (val) {
      this.page1.page = val
      this.getFootprint()
    },
    handleSizeChange2 (val) {
      this.page2.size = val
      this.getCollect()
    },
    handleCurrentChange2 (val) {
      this.page2.page = val
      this.getCustomersList()
    },
    destroy (row) {
      this.$confirm(`确定删除客户“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.CUSTOMER + '/destroy', {id: row.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getCustomersList()
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
