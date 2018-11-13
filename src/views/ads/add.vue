<template>
  <main-panel title="编辑广告" backPath="/ads">
    <el-row v-loading="pageLoading">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="广告位" prop="ad_position_id">
          <el-select ref="position" v-model="form.ad_position_id" @change="posChange">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.link" placeholder="请输入小程序页面链接"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" :rows="2" v-model="form.content" auto-complete="off" placeholder="请输入广告简介"></el-input>
        </el-form-item>
        <el-form-item label="广告图" class="no-line-height" prop="list_pic_url">
          <croppa v-model="adCroppa"
            :width="curPos.width/2"
            :height="curPos.height/2"
            canvas-color="default"
            placeholder="点击选择, PNG/JPEG, <500K"
            :placeholder-font-size="12"
            placeholder-color="default"
            accept="image/png,image/jpeg"
            :file-size-limit="512000"
            :quality="2"
            :prevent-white-space="true"
            :remove-button-size="22"
            :initial-image="form.image_url"
            @file-size-exceed="onFileSizeExceed"
            @file-type-mismatch="onFileTypeMismatch"
            @image-remove="onImageRemove(form.image_url, 'ad')">
          </croppa>
        </el-form-item>
        <el-form-item label="失效日期">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
            v-model="form.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
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
    let adValidate = function (rule, value, callback) {
      if (!that.adCroppa.hasImage()) {
        callback(new Error('请选择广告图'))
      }
      callback()
    }
    return {
      pageLoading: false,
      form: {
        id: null,
        name: '',
        content: '',
        link: '',
        image_url: null,
        enabled: 1,
        sort_order: 10,
        ad_position_id: null
      },
      curPos: {
        width: 750,
        height: 420
      },
      positions: [],
      adChanged: true,
      adCroppa: null,
      removedImgs: [], // 用于图片删除，这里不删除七牛图片
      loading: false,
      rules: {
        ad_position_id: {required: true, message: '请选择广告位'},
        name: {required: true, message: '请输入广告简介'},
        image_url: {required: true, validator: adValidate}
      }
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this.getPositions()
  },
  methods: {
    getPositions () {
      this.$http.get(api.ADVERTISEMENT + '/positions').then(data => {
        this.positions = data.data
      }).catch(err => {
        this.$message.error(err + '')
      })
    },
    save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (this.adCroppa.hasImage() && this.adChanged) {
            const cover = await this.adCroppa.promisedBlob('image/jpeg', 1)
            const res = await utils.qupload(cover, api.AdImgPrefix)
            this.form.image_url = res.key
          }
          // thinkjs不支持直接传递数组，改为json格式提交
          this.$http.post(api.ADVERTISEMENT + '/adStore', this.form, {headers: {'Content-Type': 'application/json'}}).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '保存成功', type: 'success'})
            this.$router.push({ path: '/ads' })
          }).catch(err => {
            this.loading = false
            this.$message.error(err + '')
          })
        }
      })
    },
    posChange (val) {
      this.curPos = this.positions.find(item => {
        return item.id === val
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
        case 'ad':
          this.adChanged = true
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
