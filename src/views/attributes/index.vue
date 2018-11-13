<template>
  <crud-panel title="规格列表">
    <el-row slot="condition">
        <el-input placeholder="请输入名称" size="small" prefix-icon="el-icon-search" v-model="keywords" style="width: 200px;margin-right: 10px;" @keyup.enter.native="getSpecificationsList(true)" clearable></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getSpecificationsList(true)">查询</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="newSpec">新增</el-button>
    </el-row>
    <el-table :data="specifications" stripe border v-loading="tbloading">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="规格类型" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort_order" label="排序号" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editSpec(scope.row)">编辑</el-button>
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
    <el-dialog :title="this.addSpec.id ? '编辑规格类型' : '新增规格类型'" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="addSpec" label-width="80px" size="mini" ref="specForm">
        <el-form-item label="规格类型" prop="name" :rules="{required: true, message: '请填写规格类型名称'}">
          <el-input v-model="addSpec.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="addSpec.sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveSpec">确 定</el-button>
      </div>
    </el-dialog>
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
      specifications: [],
      keywords: '',
      page: {
        size: 10,
        page: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getSpecificationsList()
  },
  methods: {
    getSpecificationsList (search = false) {
      this.tbloading = true
      if (search) {
        this.page.page = 1
      }
      this.$http.get(api.SPECIFICATION + `?page=${this.page.page}&size=${this.page.size}&name=${this.keywords}`).then(data => {
        this.specifications = data.data.data
        this.page.total = data.data.count
        this.tbloading = false
      }).catch(err => {
        this.$message.error(err + '')
        this.tbloading = false
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getSpecificationsList()
    },
    handleCurrentChange (val) {
      this.page.page = val
      this.getSpecificationsList()
    },
    newSpec () {
      this.addSpec.id = null
      this.addSpec.name = ''
      this.addSpec.sort_order = 50
      this.dialogFormVisible = true
    },
    editSpec (row) {
      this.addSpec = row
      this.dialogFormVisible = true
    },
    saveSpec () {
      this.$refs.specForm.validate(valid => {
        if (valid) {
          this.$http.post(api.SPECIFICATION + '/store', this.addSpec).then((data) => {
            if (data.errno === 0) {
              this.$notify({title: '成功', message: '保存成功', type: 'success'})
              this.dialogFormVisible = false
              this.getSpecificationsList()
            }
          }).catch(err => {
            this.loading2 = false
            this.$message.error(err + '')
          })
        }
      })
    },
    destroy (row) {
      this.$confirm(`确定删除规格类型“${row.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.SPECIFICATION + '/remove', {id: row.id}).then(data => {
          if (data.errno === 0) {
            this.$notify({title: '成功', message: '删除成功', type: 'success'})
            this.getSpecificationsList()
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
