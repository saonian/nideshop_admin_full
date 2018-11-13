<template>
  <main-panel title="编辑管理员">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="若不修改密码请留空"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpwd">
          <el-input type="password" v-model="form.checkpwd" placeholder="若不修改密码请留空"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/employees' }">
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
      form: {
        id: null,
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: {required: true, message: '请输入用户名'},
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
    this.form.id = this.$route.params.id
    this.getEmployeeInfo()
  },
  methods: {
    getEmployeeInfo () {
      this.$http.get(api.EMPLOYEE + '/info?id=' + this.form.id).then(data => {
        this.form.id = data.data.id
        this.form.username = data.data.username
      })
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(api.EMPLOYEE + '/store', this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '更新成功', type: 'success'})
            this.$router.push({ path: '/employees' })
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
