import dashboard from '../views/dashboard.vue'
import notfound from '../components/404.vue'
import login from '../views/login'
import layout from '../views/layout/layout.vue'
import products from '../views/products'
import productAdd from '../views/products/add'
import productEdit from '../views/products/edit'
import categories from '../views/categories'
import customers from '../views/customers'
import customerAdd from '../views/customers/add'
import customerEdit from '../views/customers/edit'
import addresses from '../views/addresses'
import addressAdd from '../views/addresses/add'
import addressEdit from '../views/addresses/edit'
import orders from '../views/orders'
import ordersDeail from '../views/orders/detail'
import couriers from '../views/couriers'
import courierAdd from '../views/couriers/add'
import courierEdit from '../views/couriers/edit'
import topics from '../views/topics'
import topicAdd from '../views/topics/add'
import topicEdit from '../views/topics/edit'
import employees from '../views/employees'
import employeeAdd from '../views/employees/add'
import employeeEdit from '../views/employees/edit'
import attributes from '../views/attributes'
import invoices from '../views/invoices'
import invoiceEdit from '../views/invoices/edit'
import coupons from '../views/coupons'
import couponAdd from '../views/coupons/add'
import couponEdit from '../views/coupons/edit'
import brands from '../views/brands'
import brandAdd from '../views/brands/add'
import brandEdit from '../views/brands/edit'
import ads from '../views/ads'
import adAdd from '../views/ads/add'
import adEdit from '../views/ads/edit'

const routes = [
  {path: '/login', component: login},
  {
    path: '/',
    component: layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: dashboard
    }]
  },
  {
    path: '/products',
    component: layout,
    children: [{
      path: '',
      component: products
    }, {
      path: 'add',
      component: productAdd
    }, {
      path: 'edit/:id',
      component: productEdit
    }, {
      path: 'attributes',
      component: attributes
    }]
  },
  {
    path: '/categories',
    component: layout,
    children: [{
      path: '',
      component: categories
    }]
  },
  {
    path: '/customers',
    component: layout,
    children: [{
      path: '',
      component: customers
    }, {
      path: 'add',
      component: customerAdd
    }, {
      path: 'edit/:id',
      component: customerEdit
    }]
  },
  {
    path: '/addresses',
    component: layout,
    children: [{
      path: '',
      component: addresses
    }, {
      path: 'add',
      component: addressAdd
    }, {
      path: 'edit/:id',
      component: addressEdit
    }]
  },
  {
    path: '/orders',
    component: layout,
    children: [{
      path: '',
      component: orders
    }, {
      path: 'detail/:id',
      component: ordersDeail
    }]
  },
  {
    path: '/couriers',
    component: layout,
    children: [{
      path: '',
      component: couriers
    }, {
      path: 'add',
      component: courierAdd
    }, {
      path: 'edit/:id',
      component: courierEdit
    }]
  },
  {
    path: '/topics',
    component: layout,
    children: [{
      path: '',
      component: topics
    }, {
      path: 'add',
      component: topicAdd
    }, {
      path: 'edit/:id',
      component: topicEdit
    }]
  },
  {
    path: '/employees',
    component: layout,
    children: [{
      path: '',
      component: employees
    }, {
      path: 'add',
      component: employeeAdd
    }, {
      path: 'edit/:id',
      component: employeeEdit
    }]
  },
  {
    path: '/invoices',
    component: layout,
    children: [{
      path: '',
      component: invoices
    }, {
      path: 'edit/:id',
      component: invoiceEdit
    }]
  },
  {
    path: '/coupons',
    component: layout,
    children: [{
      path: '',
      component: coupons
    }, {
      path: 'add',
      component: couponAdd
    }, {
      path: 'edit/:id',
      component: couponEdit
    }]
  },
  {
    path: '/brands',
    component: layout,
    children: [{
      path: '',
      component: brands
    }, {
      path: 'add',
      component: brandAdd
    }, {
      path: 'edit/:id',
      component: brandEdit
    }]
  },
  {
    path: '/ads',
    component: layout,
    children: [{
      path: '',
      component: ads
    }, {
      path: 'add',
      component: adAdd
    }, {
      path: 'edit/:id',
      component: adEdit
    }]
  },
  {path: '*', component: notfound}
]

export default routes
