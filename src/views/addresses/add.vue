<template>
  <main-panel title="添加地址">
    <el-row>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small">
        <el-form-item label="客户" prop="user_id">
          <el-select v-model="form.user_id" placeholder="请选择" clearable filterable remote :remote-method="getUserRemote" :loading="loading1">
            <el-option
              v-for="item in customers"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province_id">
          <el-select v-model.number="form.province_id" placeholder="请选择" @change="proviceChange" clearable filterable>
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city_id">
          <el-select v-model="form.city_id" placeholder="请选择" @change="cityChange" clearable filterable>
            <el-option
              v-for="item in cities"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="district_id">
          <el-select v-model="form.district_id" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in districts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch
            v-model="form.is_default"
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
          <router-link :to="{ path: '/addresses' }">
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
        id: null,
        user_id: null,
        name: '',
        mobile: '',
        address: '',
        district_id: '',
        country_id: 1,
        province_id: null,
        city_id: null,
        is_default: 0
      },
      customers: [],
      countries: [],
      provinces: [],
      cities: [],
      citiesBak: [],
      districts: [],
      districtsBak: [],
      loading: false,
      loading1: false,
      rules: {
        user_id: {required: true, message: '请选择客户'},
        country_id: {required: true, message: '请选择国家'},
        province_id: {required: true, message: '请选择省份'},
        city_id: {required: true, message: '请选择城市'},
        district_id: {required: true, message: '请选择地区'},
        name: {required: true, message: '请输入收件人'},
        mobile: {required: true, message: '请输入联系手机'},
        address: {required: true, message: '请输入地址'}
      }
    }
  },
  mounted () {
    this.getProvincesList()
  },
  methods: {
    getUserRemote (query) {
      return new Promise((resolve, reject) => {
        this.loading1 = true
        this.$http.get(api.CUSTOMER + '?page=1&size=10&name=' + query).then((data) => {
          if (data.errno === 0) {
            this.customers = data.data.data
            resolve(this.customers)
          } else {
            reject(data)
          }
          this.loading1 = false
        }).catch(err => {
          this.loading1 = false
          this.$message.error(err + '')
          reject(err)
        })
      })
    },
    getProvincesList () {
      this.$http.get(api.REGION + '?type=1&pid=1').then((data) => {
        this.provinces = data.data
      })
    },
    getCitiesList (provinceId = 0) {
      this.$http.get(api.REGION + '?type=2&pid=' + provinceId).then((data) => {
        this.cities = data.data
        this.citiesBak = data.data
      })
    },
    getDistrictList (cityId = 0) {
      this.$http.get(api.REGION + '?type=3&pid=' + cityId).then((data) => {
        this.districts = data.data
        this.districtsBak = data.data
      })
    },
    proviceChange (val) {
      this.getCitiesList(val)
    },
    cityChange (val) {
      this.getDistrictList(val)
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(api.ADDRESS + '/save', this.form).then((data) => {
            this.loading = false
            this.$notify({title: '成功', message: '添加成功', type: 'success'})
            this.$router.push({ path: '/addresses' })
          }).catch(err => {
            this.loading = false
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
