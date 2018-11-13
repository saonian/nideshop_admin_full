<template>
  <main-panel title="添加快递">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" size="small">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="快递鸟编号" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
          <router-link :to="{ path: '/couriers' }">
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
      form: {
        name: '',
        code: '',
        sort_order: 50
      },
      showCost: true,
      loading: false,
      rules: {
        name: {required: true, message: '请输入快递名'},
        code: {required: true, message: '请输入快递鸟编号'}
      }
    }
  },
  mounted () {

  },
  methods: {
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(api.COURIER + '/save?id=' + this.id, this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '添加成功', type: 'success'})
            this.$router.push({ path: '/couriers' })
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        }
      })
    },
    isFreeChange (val) {
      if (val === 1) {
        this.form.cost = 0
        this.showCost = false
      } else {
        this.showCost = true
      }
    }
  }
}
</script>

<style scoped>

</style>
