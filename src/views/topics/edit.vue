<template>
  <main-panel title="编辑主题">
    <el-row v-loading="pageLoading">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="subtitle">
          <el-input type="textarea" :row="2" v-model="form.subtitle"></el-input>
        </el-form-item>
        <el-form-item label="起价" prop="price_info">
          <el-input v-model.number="form.price_info"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-cascader :options="categories" v-model="form.category" :props="props" clearable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="封面" class="no-line-height" prop="scene_pic_url">
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
            :initial-image="form.scene_pic_url"
            @file-size-exceed="onFileSizeExceed"
            @file-type-mismatch="onFileTypeMismatch"
            @image-remove="onImageRemove(form.scene_pic_url, 'cover')">
          </croppa>
        </el-form-item>
        <el-form-item label="内容" class="no-line-height" prop="content">
          <quill-editor
            v-model="form.content"
            ref="editor"
            :options="editorOption"
            style="height: 500px;">
          </quill-editor>
        </el-form-item>
        <el-form-item label="排序" style="margin-top: 86px;">
          <el-input-number v-model="form.sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="显示">
          <el-switch
            v-model="form.is_show"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示"
            inactive-text="隐藏"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/topics' }">
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
// 需要配置一下webpack https://github.com/kensnyder/quill-image-resize-module/issues/7
Quill.register('modules/imageResize', ImageResize)
Quill.debug(false)

export default {
  components: {
    quillEditor
  },
  data () {
    let that = this
    let coverValidate = function (rule, value, callback) {
      if (!that.coverCroppa.hasImage()) {
        callback(new Error('请选择商品封面图'))
      }
      callback()
    }
    return {
      pageLoading: true,
      categories: [],
      categories2: [],
      coverCroppa: null,
      form: {
        id: null,
        title: '',
        content: '',
        category_id: null,
        category: [],
        subtitle: '',
        is_show: 1,
        scene_pic_url: '',
        price_info: null
      },
      showCost: true,
      loading: false,
      coverChanged: false,
      rules: {
        title: {required: true, message: '请输入主题标题'},
        subtitle: {required: true, message: '请输入主题描述'},
        category: {required: true, message: '请选择文章分类'},
        scene_pic_url: {required: true, validator: coverValidate},
        price_info: {required: true, message: '请输入起价'},
        content: {required: true, message: '请输入主题内容'}
      },
      props: {
        label: 'name',
        children: 'children',
        value: 'id',
        disabled: function (data, node) {
          return !node.data.status
        }
      },
      editorOption: {
        placeholder: '在这里编辑商品详情',
        theme: 'snow',
        debug: false,
        modules: {
          toolbar: {
            handlers: {
              image: this.handlerImg
            },
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'direction': 'rtl'}],
              [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              [{'font': []}],
              [{'align': []}],
              ['clean'],
              ['link', 'image']
            ]
          },
          imageResize: {
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          }
        }
      }
    }
  },
  mounted () {
    this.form.id = this.$route.params.id
    this.getAllCats().then(() => {
      this.getTopicInfo()
    }).catch(err => {
      this.$message.error(err + '')
    })
  },
  methods: {
    getAllCats () {
      return new Promise((resolve, reject) => {
        this.$http.get(api.CATEGORY + '?type=1').then(data => {
          this.categories = data.data
          this.convert(this.categories, this.categories2)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getTopicInfo () {
      this.pageLoading = true
      this.$http.get(api.TOPIC + '/info?id=' + this.form.id).then(data => {
        this.pageLoading = false
        if (data.errno === 0) {
          this.form = data.data
          if (!/^http/i.test(this.form.scene_pic_url)) {
            this.form.scene_pic_url = api.QiniuDomain + this.form.scene_pic_url
          }
          this.form.category = this.findPids(this.form.category_id).reverse()

          this.coverCroppa.refresh()
        }
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
            const res = await utils.qupload(cover, api.GoodsImgPrefix)
            this.form.scene_pic_url = res.key
          }
          this.$http.post(api.TOPIC + '/store?id=' + this.form.id, this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
            this.$router.push({ path: '/topics' })
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }
      })
    },
    handlerImg () {
      var that = this
      var fileInput = this.$refs.editor.quill.container.querySelector('input.ql-image[type=file]')
      if (fileInput === null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute('name', 'image')
        fileInput.setAttribute('accept', 'image/png,image/jpeg,image/gif')
        fileInput.classList.add('ql-image')
        // 监听选择文件
        fileInput.addEventListener('change', function () {
          if (fileInput.files[0].size >= 500 * 1024) {
            fileInput.value = ''
            that.$message.error('图片大小超出500 K限制')
            return
          }
          utils.qupload(fileInput.files[0], api.TopicImgPrefix).then(res => {
            let length = that.$refs.editor.quill.getSelection(true).index
            that.$refs.editor.quill.insertEmbed(length, 'image', api.QiniuDomain + res.key)
            that.$refs.editor.quill.setSelection(length + 1)
          }).catch(err => {
            this.$message.error(err + '')
          })
        })
      }
      fileInput.click()
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
    onFileSizeExceed (file) {
      this.$message.error('图片大小不能超过 500K')
    },
    onFileTypeMismatch (file) {
      this.$message.error('图片只能是 JPG/PNG 格式！')
    },
    onImageRemove (path, type) {
      this.removedImgs.push(path)
      this.removedImgs = [...new Set(this.removedImgs)]
      this.coverChanged = true
    },
    onSelectCat (data, checked, indeterminate) {
      this.form.categories = this.$refs.catTree.getCheckedKeys(true)
    }
  }
}
</script>

<style scoped>

</style>
