<template>
  <main-panel title="编辑客户">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpwd">
          <el-input type="password" v-model="form.checkpwd"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="锁定"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/customers' }">
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
    let validatePwd = (rule, value, callback) => {
      if (value && value.length <= 8) {
        callback(new Error('密码至少8位'))
      } else {
        if (this.form.checkpwd !== '') {
          this.$refs.form.validateField('checkpwd')
        }
        callback()
      }
    }
    let validatePwd2 = (rule, value, callback) => {
      if (this.form.password !== '' && !value) {
        callback(new Error('请再次输入密码'))
      } else if (this.form.password !== '' && value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      id: null,
      form: {
        id: null,
        name: '',
        email: '',
        password: '',
        status: 1
      },
      loading: false,
      rules: {
        name: {required: true, message: '请输入用户名'},
        email: [
          {required: true, message: '请输入邮箱地址'},
          {type: 'email', message: '请输入正确的邮箱地址'}
        ],
        password: {validator: validatePwd},
        checkpwd: {validator: validatePwd2}
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getCustomerInfo()
  },
  methods: {
    getCustomerInfo () {
      this.$http.get(api.CUSTOMER + '/' + this.id).then(data => {
        this.form.id = data.data.id
        this.form.name = data.data.name
        this.form.email = data.data.email
        this.form.status = data.data.status
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form._method = 'PUT'
          this.$http.post(api.CUSTOMER + '/' + this.id, this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
            this.$router.push({ path: '/customers' })
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
