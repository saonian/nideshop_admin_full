<template>
  <main-panel title="订单详情" v-loading="loading">
    <el-card v-if="order.user">
      <div slot="header">
        <span><i class="el-icon-fa-user">&nbsp;&nbsp;</i>客户信息</span>
      </div>
      <el-form label-position="left" label-width="90px">
        <el-form-item label="头像" class="iteminfo">
          <img :src="order.user.avatar" width="70" height="70" />
        </el-form-item>
        <el-form-item label="客户" class="iteminfo">
          <span>{{ order.user.nickname }}</span>
        </el-form-item>
        <el-form-item label="注册日期" class="iteminfo">
          <span>{{ order.user.add_time }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span><i class="el-icon-fa-info">&nbsp;&nbsp;</i>订单信息({{ order.reference }})</span>
      </div>
      <el-table :data="orders" stripe border>
        <el-table-column prop="order_sn" label="订单号" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payment" label="支付方式" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            微信支付
          </template>
        </el-table-column>
        <el-table-column prop="order_price" label="订单金额" width="80" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actual_price" label="实付款" width="80" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="express.shipper_name" v-if="order.order_status > 300" label="物流" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="express.logistic_code" v-if="order.order_status > 300" label="运单号" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="order_status" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.order_status === 0">未付款</el-tag>
            <el-tag type="warning" size="small" v-if="scope.row.order_status === 101">已取消</el-tag>
            <el-tag type="danger" size="small" v-if="scope.row.order_status === 102">已删除</el-tag>
            <el-tag type="success" size="small" v-if="scope.row.order_status === 201">已付款</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.order_status === 300">已发货</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.order_status === 301">待评价</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="add_time" label="创建日期" width="170" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="120" v-if="order.order_status === 201">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-fa-cube" @click="dialogDelivery = true" v-if="scope.row.order_status === 201">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span><i class="el-icon-fa-shopping-bag">&nbsp;&nbsp;</i>商品清单</span>
      </div>
      <el-table :data="goods" stripe border>
        <el-table-column label="图片" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <img width="100" height="100" :src="scope.row.list_pic_url"/>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_specifition_name_value" label="规格" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_sn" label="SKU" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="retail_price" label="商品价格" width="100" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="数量" width="80" align="right" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin: 10px 0">
      <div slot="header">
        <span><i class="el-icon-fa-truck">&nbsp;&nbsp;</i>收件人</span>
      </div>
      <el-table :data="orders" stripe border>
        <el-table-column prop="consignee" label="收件人" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="120" align="right" show-overflow-tooltip></el-table-column>
        <el-table-column prop="province" label="省" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="city" label="市" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="district" label="地址" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" min-width="150" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>
    <!-- <el-card style="margin: 10px 0">
      <div slot="header">
        <span><i class="el-icon-fa-window-maximize">&nbsp;&nbsp;</i>发票信息</span>
      </div>
      <el-table :data="invoices" stripe border>
      <el-table-column prop="type" label="抬头类型" width="80" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="抬头名称" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tax_number" label="税号(纳税人识别号)" min-width="170" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card> -->
    <el-row>
      <router-link :to="{ path: '/orders' }">
        <el-button icon="el-icon-back" size="small" style="float: right">返回</el-button>
      </router-link>
    </el-row>
    <el-dialog
      title="发货"
      :visible.sync="dialogDelivery"
      width="30%">
      <el-form ref="formDelivery" :model="formDelivery" label-width="80px" size="small">
        <el-form-item label="快递" prop="courier_id" :rules="{required: true, message: '请选择发货快递'}">
          <el-select v-model="formDelivery.courier_id" placeholder="请选择">
            <el-option v-for="item in couriers" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单号" prop="courier_no" :rules="{required: true, message: '请输入快递单号'}">
          <el-input v-model="formDelivery.courier_no"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDelivery = false">取 消</el-button>
        <el-button size="small" type="primary" @click="delivery" :loading="loading">提 交</el-button>
      </span>
    </el-dialog>
  </main-panel>
</template>

<script>
import * as api from 'api'
// import * as utils from 'utils'

export default {
  data () {
    return {
      id: null,
      order: {},
      orders: [],
      goods: [],
      addresses: [],
      invoices: [],
      dialogDelivery: false,
      loading: false,
      couriers: [],
      formDelivery: {
        courier_id: null,
        courier_no: ''
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getOrdersInfo()
    this.getCouriersList()
  },
  methods: {
    getOrdersInfo () {
      this.$http.get(api.ORDER + '/info?id=' + this.id).then(data => {
        this.order = data.data
        this.orders = [this.order]
        this.goods = this.order.goods
        this.goods.forEach(item => {
          item.cover = /^http/i.test(item.list_list_pic_url) ? item.list_list_pic_url : api.QiniuDomain + item.list_list_pic_url
        })
      })
    },
    getCouriersList () {
      this.$http.get(api.COURIER + '?page=1&size=1000').then(data => {
        this.couriers = data.data
      })
    },
    delivery () {
      this.$refs.formDelivery.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post(api.ORDER + '/' + this.id + '/delivery', this.formDelivery).then(data => {
            this.$notify({title: '成功', message: '发货成功', type: 'success'})
            this.loading = false
            this.dialogDelivery = false
            this.getOrdersInfo()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    formatter (row, column) {
      let types = {company: '单位', personal: '个人'}
      return types[row.type]
    }
  }
}
</script>

<style scoped>
.iteminfo {
  margin-bottom: 0;
  label {
    color: #99a9bf;
  }
}
</style>
