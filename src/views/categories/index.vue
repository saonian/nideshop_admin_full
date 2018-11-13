<template>
  <crud-panel title="分类列表">
    <el-row slot="condition">
      <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="info" size="small" icon="el-icon-refresh" @click="getCategoriesList(catType)">刷新</el-button>
    </el-row>
    <el-row style="margin-bottom: 20px;" :gutter="24">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card class="box-card">
          <el-row>
            <el-button type="text" class="catBtn" :class="{active: catType === 0}" @click="getCategoriesList(0)">商品</el-button>
            <el-button type="text" class="catBtn" :class="{active: catType === 1}" @click="getCategoriesList(1)">专题</el-button>
          </el-row>
          <el-tree v-loading="loading2" ref="catTree" :data="categories" highlight-current @node-click="handleNodeClick" clearable node-key="id" :props="props" :expand-on-click-node="false"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div class="text item">
            <el-form :model="form" ref="form" label-width="80px" size="small">
              <el-form-item label="父级">
                <el-cascader :options="categories" v-model="form.parent" :props="props" clearable change-on-select>
                </el-cascader>
              </el-form-item>
              <el-form-item label="类型">
                <el-radio-group v-model="form.type" @change="typeChange">
                  <el-radio :label="0">商品</el-radio>
                  <el-radio :label="1">专题</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分类名称" prop="name" :rules="{required: true, message: '请输入分类名称'}">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="显示名称" prop="front_name" :rules="{required: true, message: '请输入显示名称'}">
                <el-input v-model="form.front_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="显示描述">
                <el-input type="textarea" :rows="2" v-model="form.front_desc" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item class="no-line-height" label="图标" v-show="catType === 0">
                <croppa v-model="iconCroppa"
                  :width="45"
                  :height="45"
                  canvas-color="default"
                  placeholder="点击选择, PNG/JPEG, <100K"
                  :placeholder-font-size="12"
                  placeholder-color="default"
                  accept="image/png,image/jpeg"
                  :file-size-limit="10240"
                  :quality="2"
                  :prevent-white-space="true"
                  :initial-image="iconUrl"
                  :remove-button-size="15"
                  @file-choose="iconUpload"
                  @file-size-exceed="onFileSizeExceed"
                  @file-type-mismatch="onFileTypeMismatch"
                  @image-remove="onIconRemove">
                </croppa>
              </el-form-item>
              <el-form-item class="no-line-height" label="横幅" prop="wap_banner_url" :rules="{required: true, validator: bannerValidate}">
                <croppa v-model="bannerCroppa"
                  :width="375"
                  :height="123"
                  canvas-color="default"
                  placeholder="点击选择, PNG/JPEG, <500K"
                  :placeholder-font-size="12"
                  placeholder-color="default"
                  accept="image/png,image/jpeg"
                  :file-size-limit="512000"
                  :quality="2"
                  :prevent-white-space="true"
                  :initial-image="wapBannerUrl"
                  :remove-button-size="15"
                  @file-choose="bannerUpload"
                  @file-size-exceed="onFileSizeExceed2"
                  @file-type-mismatch="onFileTypeMismatch"
                  @image-remove="onBannerRemove">
                </croppa>
              </el-form-item>
              <el-form-item label="首页显示" v-show="catType === 0">
                <el-radio class="radio" v-model="form.show_index" :label="1">是</el-radio>
                <el-radio class="radio" v-model="form.show_index" :label="0">否</el-radio>
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="form.sort_order" :min="1" :max="1000"></el-input-number>
              </el-form-item>
              <el-form-item label="首页排序" v-show="catType === 0">
                <el-input-number v-model="form.index_sort_order" :min="1" :max="1000"></el-input-number>
              </el-form-item>
              <el-form-item label="状态">
                <el-radio class="radio" v-model="form.is_show" :label="1">启用</el-radio>
                <el-radio class="radio" v-model="form.is_show" :label="0">禁用</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="save" :loading="loading">{{ form.id ? '修改' : '新增' }}</el-button>
                <el-button type="danger" @click="destroy" v-show="form.id && form.children && form.children.length === 0">删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </crud-panel>
</template>

<script>
import * as api from 'api'
import * as utils from 'utils'

export default {
  data () {
    let that = this
    let iconValidate = function (rule, value, callback) {
      if (!that.iconCroppa.hasImage()) {
        callback(new Error('请上传分类图标'))
      }
      callback()
    }
    let bannerValidate = function (rule, value, callback) {
      if (!that.bannerCroppa.hasImage()) {
        callback(new Error('请上传封面Banner'))
      }
      callback()
    }
    return {
      iconChange: false,
      bannerChange: false,
      iconValidate: iconValidate,
      bannerValidate: bannerValidate,
      form: {
        id: null,
        name: '',
        front_name: '',
        type: 0,
        front_desc: '',
        parent: [],
        is_show: 1,
        children: [],
        sort_order: 50,
        index_sort_order: 5,
        icon_url: '',
        wap_banner_url: '',
        show_index: 0
      },
      props: {
        label: 'name',
        children: 'children',
        value: 'id'
      },
      catType: 0,
      categories: [],
      categories2: [],
      loading: false,
      loading2: false,
      iconCroppa: null,
      bannerCroppa: null
    }
  },
  computed: {
    iconUrl: function () {
      return this.form.icon_url && !/^http/i.test(this.form.icon_url) ? api.QiniuDomain + this.form.icon_url : this.form.icon_url
    },
    wapBannerUrl: function () {
      return this.form.wap_banner_url && !/^http/i.test(this.form.wap_banner_url) ? api.QiniuDomain + this.form.wap_banner_url : this.form.wap_banner_url
    }
  },
  mounted () {
    this.getCategoriesList()
  },
  methods: {
    getCategoriesList (type = 0) {
      this.loading2 = true
      this.catType = type
      this.$http.get(api.CATEGORY + '?type=' + type).then(data => {
        this.categories = data.data
        this.convert(this.categories, this.categories2)
        this.loading2 = false
      }).catch(err => {
        this.loading2 = false
        this.$message.error(err + '')
      })
    },
    add () {
      this.form = {
        id: null,
        name: '',
        front_name: '',
        type: 0,
        front_desc: '',
        parent: [],
        is_show: 1,
        children: [],
        sort_order: 50,
        index_sort_order: 5,
        icon_url: '',
        wap_banner_url: '',
        show_index: 0
      }
      this.iconCroppa.refresh()
      this.bannerCroppa.refresh()
    },
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (this.form.parent.length > 0) {
            this.form.parent_id = this.form.parent[this.form.parent.length - 1]
          } else {
            this.form.parent_id = 0
          }
          if (this.iconCroppa.hasImage() && this.iconChange) {
            const icon = await this.iconCroppa.promisedBlob('image/jpeg', 0.8)
            const res = await utils.qupload(icon, api.CategoryIconPrefix)
            this.form.icon_url = res.key
          }
          if (this.bannerCroppa.hasImage() && this.bannerChange) {
            const banner = await this.bannerCroppa.promisedBlob('image/jpeg', 0.8)
            const res = await utils.qupload(banner, api.CategoryBannerPrefix)
            this.form.wap_banner_url = res.key
          }
          this.$http.post(api.CATEGORY + '/store', this.form).then(data => {
            this.$notify({title: '成功', message: this.form.id ? '更新成功' : '添加成功', type: 'success'})
            !this.form.id && this.add()
            this.getCategoriesList()
            this.loading = false
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        }
      })
    },
    destroy () {
      this.$confirm(`确定删除分类“${this.form.name}”吗?`, '提示', {type: 'warning'}).then(() => {
        this.$http.post(api.CATEGORY + '/destory', {id: this.form.id}).then(data => {
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
          this.getCategoriesList()
          this.add()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleNodeClick (data) {
      this.form.id = data.id
      this.form.name = data.name
      this.form.front_name = data.front_name
      this.form.front_desc = data.front_desc
      this.form.parent = this.findPids(data.parent_id).reverse()
      this.form.icon_url = data.icon_url
      this.form.wap_banner_url = data.wap_banner_url
      this.form.is_show = data.is_show
      this.form.type = data.type
      this.form.children = data.children
      this.form.show_index = data.show_index

      this.iconCroppa.refresh()
      this.bannerCroppa.refresh()
    },
    convert (cats, result) {
      cats.forEach(item => {
        result.push(item)
        if (item.children) {
          this.convert(item.children, result)
        }
      })
    },
    findPids (pid) {
      if (pid === 0 || !pid) {
        return []
      }
      let result = [pid]
      let flag = true
      while (flag) {
        this.categories2.forEach(item => {
          if (item.id === pid) {
            if (item.parent_id && item.parent_id > 0) {
              pid = item.parent_id
              result.push(pid)
            } else {
              flag = false
            }
          }
        })
      }
      return result
    },
    typeChange (val) {
      this.catType = val
    },
    onFileSizeExceed (file) {
      this.$message.error('图片大小不能超过 100K！')
    },
    onFileSizeExceed2 (file) {
      this.$message.error('图片大小不能超过 500K！')
    },
    onFileTypeMismatch (file) {
      this.$message.error('图片只能是 JPG/PNG 格式！')
    },
    onIconRemove (file) {
      this.form.icon_url = ''
      this.iconChange = true
    },
    onBannerRemove (file) {
      this.form.wap_banner_url = ''
      this.bannerChange = true
    },
    iconUpload (file) {
      utils.qupload(file, api.CategoryIconPrefix).then(res => {
        this.form.icon_url = res.key
      }).catch(err => {
        this.$message.error(err + '')
      })
    },
    bannerUpload (file) {
      utils.qupload(file, api.CategoryBannerPrefix).then(res => {
        this.form.wap_banner_url = res.key
      }).catch(err => {
        this.$message.error(err + '')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.catBtn {
  padding-top: 0;
  color: #c0c4cc;

  &.active {
    color: #409EFF;
  }
}
</style>
