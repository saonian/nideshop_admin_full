<template>
  <main-panel title="编辑发票">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="客户">
          <strong>{{ form.customer }}</strong>
        </el-form-item>
        <el-form-item label="抬头类型" prop="type">
          <el-radio-group v-model="form.type" @change="typeChange">
            <el-radio label="company">单位</el-radio>
            <el-radio label="personal">个人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抬头名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="税号" prop="tax_number" :rules="taxRule">
          <el-input v-model="form.tax_number" placeholder="纳税人识别号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/invoices' }">
            <el-button>取消</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-row>
  </main-panel>
</template>

<script>
import * as api from 'api'

export default {
  data () {
    return {
      id: null,
      form: {
        customer: '',
        type: 'company',
        name: '',
        tax_number: ''
      },
      loading: false,
      rules: {
        type: {required: true, message: '请选择抬头类型'},
        name: {required: true, message: '请输入抬头名称'},
        tax_number: {required: true, message: '请输入纳税人识别号'}
      },
      taxRule: {}
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getInvoiceInfo()
  },
  methods: {
    getInvoiceInfo () {
      this.$http.get(api.INVOICE + '/' + this.id).then((data) => {
        if (data.data) {
          this.form.customer = data.data.customer.name
          this.form.type = data.data.type
          this.form.name = data.data.name
          this.form.tax_number = data.data.tax_number
        }
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form._method = 'PUT'
          this.$http.post(api.INVOICE + '/' + this.id, this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
            this.$router.push({path: '/invoices'})
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }
      })
    },
    typeChange (val) {
      if (val === 'company') {
        this.taxRule = {required: true, message: '请输入纳税人识别号'}
      } else {
        this.taxRule = {required: false}
      }
    }
  }
}
</script>

<style scoped>

</style>
