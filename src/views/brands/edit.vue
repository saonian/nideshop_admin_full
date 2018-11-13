<template>
  <main-panel title="编辑品牌" backPath="/products">
    <el-row v-loading="pageLoading">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="simple_desc">
          <el-input type="textarea" :rows="2" v-model="form.simple_desc" auto-complete="off" placeholder="请输入品牌简介"></el-input>
        </el-form-item>
        <el-form-item label="起步价" prop="floor_price">
          <el-input v-model.number="form.floor_price" style="width: 130px;" placeholder="起步价"></el-input>
        </el-form-item>
        <el-form-item label="品牌列表/商品页展示图" class="no-line-height" prop="list_pic_url">
          <croppa v-model="coverCroppa"
            :width="375"
            :height="210"
            canvas-color="default"
            placeholder="点击选择, PNG/JPEG, <500K"
            :placeholder-font-size="12"
            placeholder-color="default"
            accept="image/png,image/jpeg"
            :file-size-limit="512000"
            :quality="2"
            :prevent-white-space="true"
            :remove-button-size="22"
            :initial-image="form.list_pic_url"
            @file-size-exceed="onFileSizeExceed"
            @file-type-mismatch="onFileTypeMismatch"
            @image-remove="onImageRemove(form.list_pic_url, 'cover')">
          </croppa>
        </el-form-item>
        <el-form-item label="首页Banner" class="no-line-height" prop="new_pic_url">
          <croppa v-model="imgCroppa1"
            :width="330"
            :height="242"
            canvas-color="default"
            placeholder="点击选择, PNG/JPEG, <500K"
            :placeholder-font-size="12"
            placeholder-color="default"
            accept="image/png,image/jpeg"
            :file-size-limit="512000"
            :quality="2"
            :prevent-white-space="true"
            :remove-button-size="22"
            :initial-image="form.new_pic_url"
            @file-size-exceed="onFileSizeExceed"
            @file-type-mismatch="onFileTypeMismatch"
            @image-remove="onImageRemove(form.new_pic_url, 'img1')">
          </croppa>
        </el-form-item>
        <el-form-item label="首页显示">
          <el-radio class="radio" v-model="form.is_new" :label="1">是</el-radio>
          <el-radio class="radio" v-model="form.is_new" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio class="radio" v-model="form.is_show" :label="1">是</el-radio>
          <el-radio class="radio" v-model="form.is_show" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="列表排序">
          <el-input-number v-model="form.sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="首页排序">
          <el-input-number v-model="form.new_sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/brands' }">
            <el-button>取消</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-row>
  </main-panel>
</template>

<script>
import * as api from 'api'
import * as utils from 'utils'

export default {
  data () {
    let that = this
    let coverValidate = function (rule, value, callback) {
      if (!that.coverCroppa.hasImage()) {
        callback(new Error('请选择列表页/商品页显示图'))
      }
      callback()
    }
    let imageValidate = function (rule, value, callback) {
      if (!that.imgCroppa1.hasImage()) {
        callback(new Error('请选择首页/新品显示图'))
      }
      callback()
    }
    return {
      id: null,
      pageLoading: false,
      form: {
        id: null,
        name: '',
        simple_desc: '',
        floor_price: null,
        list_pic_url: null,
        new_pic_url: null,
        is_show: 1,
        is_new: 0,
        sort_order: 100,
        new_sort_order: 10
      },
      coverChanged: false,
      img1Changed: false,
      coverCroppa: null,
      imgCroppa1: null,
      removedImgs: [], // 用于图片删除，这里不删除七牛图片
      loading: false,
      rules: {
        simple_desc: {required: true, message: '请输入品牌简介'},
        name: {required: true, message: '请输入品牌名称'},
        list_pic_url: {required: true, validator: coverValidate},
        new_pic_url: {required: true, validator: imageValidate},
        floor_price: {required: true, message: '请填写起步价'}
      }
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this.getBrandsInfo()
  },
  methods: {
    getBrandsInfo () {
      this.pageLoading = true
      this.$http.get(api.BRAND + '/info?id=' + this.form.id).then(data => {
        this.form = data.data
        if (this.form.list_pic_url) {
          this.form.list_pic_url = /^http/i.test(this.form.list_pic_url) ? this.form.list_pic_url : api.QiniuDomain + this.form.list_pic_url
          this.coverChanged = false
        }
        if (this.form.new_pic_url) {
          this.form.new_pic_url = /^http/i.test(this.form.new_pic_url) ? this.form.new_pic_url : api.QiniuDomain + this.form.new_pic_url
          this.img1Changed = false
        }
        this.coverCroppa.refresh()
        this.imgCroppa1.refresh()

        this.pageLoading = false
      }).catch(err => {
        this.$message.error(err + '')
        this.pageLoading = false
      })
    },
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (this.coverCroppa.hasImage() && this.coverChanged) {
            const cover = await this.coverCroppa.promisedBlob('image/jpeg', 1)
            const res = await utils.qupload(cover, api.BrandImgPrefix)
            this.form.list_pic_url = res.key
          }
          if (this.imgCroppa1.hasImage() && this.img1Changed) {
            const img1 = await this.imgCroppa1.promisedBlob('image/jpeg', 1)
            const res = await utils.qupload(img1, api.BrandImgPrefix)
            this.form.new_pic_url = res.key
          }
          // thinkjs不支持直接传递数组，改为json格式提交
          this.$http.post(api.BRAND + '/store', this.form, {headers: {'Content-Type': 'application/json'}}).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '保存成功', type: 'success'})
            this.$router.push({ path: '/brands' })
          }).catch(err => {
            this.loading = false
            this.$message.error(err + '')
          })
        }
      })
    },
    onFileSizeExceed (file) {
      this.$message.error('图片大小不能超过 500K')
    },
    onFileTypeMismatch (file) {
      this.$message.error('图片只能是 JPG/PNG 格式！')
    },
    onImageRemove (path, type) {
      this.removedImgs.push(path)
      this.removedImgs = [...new Set(this.removedImgs)]
      switch (type) {
        case 'cover':
          this.coverChanged = true
          break
        case 'img1':
          this.img1Changed = true
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
