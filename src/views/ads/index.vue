<template>
  <main-panel title="广告列表">
    <el-row style="margin-bottom: 20px;" :gutter="24">
      <el-col :span="8" :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 20px;">
        <el-row style="margin-bottom: 10px;">
          <el-button type="success" size="small" icon="el-icon-plus" @click="dialogPos = true">新增</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="editPosition" :disabled="!curRow">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="destroyPosition" :disabled="!curRow">删除</el-button>
        </el-row>
        <el-table ref="tblAd" :data="positions" stripe border v-loading="tbloading1" style="margin-bottom: 10px;" @current-change="positionClick" highlight-current-row>
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="广告位置" min-width="70" show-overflow-tooltip></el-table-column>
          <el-table-column prop="width" label="宽" align="right" width="50" show-overflow-tooltip></el-table-column>
          <el-table-column prop="height" label="高" align="right" width="50" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16" :xs="24" :sm="24" :md="16" :lg="16">
        <el-row style="margin-bottom: 10px;">
          <router-link :to="{ path: '/ads/add' }">
            <el-button type="success" size="small" icon="el-icon-plus">新增</el-button>
          </router-link>
          <router-link :to="{ path: '/ads/edit/' + (curAd ? curAd.id : '') }">
            <el-button type="primary" size="small" icon="el-icon-edit" :disabled="!curAd">编辑</el-button>
          </router-link>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="destroyAd" :disabled="!curAd">删除</el-button>
        </el-row>
        <el-table :data="ads" stripe border v-loading="tbloading2" @current-change="adClick" highlight-current-row>
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="image_url" label="广告" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <img :src="/^http/i.test(scope.row.image_url) ? scope.row.image_url : qiniuDomain + scope.row.image_url" height="70" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="enabled" align="center" label="启用" width="50" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" size="small" v-if="scope.row.enabled === 1">是</el-tag>
              <el-tag type="danger" size="small" v-if="scope.row.enabled === 0">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="end_time" align="center" label="过期日期" width="170" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      :title="formPos.id ? '编辑广告位' : '添加广告位'"
      :visible.sync="dialogPos"
      width="30%">
      <el-form ref="formPos" :model="formPos" label-width="80px" size="small">
        <el-form-item label="名称" prop="name" :rules="{required: true, message: '请输入广告位名称'}">
          <el-input v-model="formPos.name"></el-input>
        </el-form-item>
        <el-form-item label="宽度" prop="width" :rules="{required: true, message: '请输入广告位宽度'}">
          <el-input v-model.number="formPos.width" style="width: 130px;" placeholder="广告位宽度，单位px"></el-input>
        </el-form-item>
        <el-form-item label="高度" prop="height" :rules="{required: true, message: '请输入广告位高度'}">
          <el-input v-model.number="formPos.height" style="width: 130px;" placeholder="广告位高度，单位px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAd = false">取 消</el-button>
        <el-button size="small" type="primary" @click="savePos" :loading="loadingPos">提 交</el-button>
      </span>
    </el-dialog>
  </main-panel>
</template>

<script>
import * as api from 'api'

export default {
  data () {
    return {
      dialogPos: false,
      loadingPos: false,
      curRow: null,
      curAd: null,
      dialogAd: false,
      positions: [],
      ads: [],
      tbloading1: false,
      tbloading2: false,
      qiniuDomain: api.QiniuDomain,
      formPos: {
        id: null,
        name: '',
        width: 0,
        height: 0
      }
    }
  },
  mounted () {
    this.getPositionList()
  },
  methods: {
    getPositionList () {
      this.tbloading1 = true
      this.$http.get(api.ADVERTISEMENT + `/positions`).then(data => {
        this.positions = data.data
        this.tbloading1 = false
        if (this.curRow) {
          this.$refs.tblAd.setCurrentRow(this.curRow)
        }
      }).catch(err => {
        this.tbloading1 = false
        this.$message.error(err + '')
      })
    },
    editPosition () {
      if (!this.curRow) {
        this.$message.warning('请先选择一行')
      }
      this.formPos = this.curRow
      this.dialogPos = true
    },
    positionClick (row) {
      if (!row) {
        return
      }
      this.curRow = row
      this.tbloading2 = true
      this.getAds(row.id)
    },
    getAds (pid) {
      this.$http.get(api.ADVERTISEMENT + '/ads?pid=' + pid).then(data => {
        this.ads = data.data
        this.tbloading2 = false
      }).catch(err => {
        this.tbloading2 = false
        this.$message.error(err + '')
      })
    },
    adClick (row) {
      if (!row) {
        return
      }
      this.curAd = row
    },
    destroyPosition () {
      if (!this.curRow) {
        this.$message.warning('请先选择一行')
      }
      this.$confirm(`确定删除广告位'${this.curRow.name}'吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.ADVERTISEMENT + '/posDestroy', {id: this.curRow.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getPositionList()
        })
      })
    },
    destroyAd () {
      if (!this.curAd) {
        this.$message.warning('请先选择一行')
      }
      this.$confirm(`确定删除广告'${this.curAd.name}'吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.ADVERTISEMENT + '/adDestroy', {id: this.curAd.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.positionClick(this.curRow)
        })
      })
    },
    savePos () {
      this.$refs.formPos.validate(valid => {
        if (valid) {
          this.$http.post(api.ADVERTISEMENT + '/posStore', this.formPos).then((data) => {
            this.loadingPos = false
            this.dialogPos = false
            this.formPos = {
              id: null,
              name: '',
              width: 0,
              height: 0
            }
            this.$notify({title: '成功', message: this.formPos.id ? '更新成功' : '添加成功', type: 'success'})
            this.getPositionList()
          }).catch(err => {
            this.loadingPos = false
            this.$message.error(err + '')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
