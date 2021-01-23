import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '../components/users/users.vue'
import Right from '../components/rights/right.vue'
import Role from '../components/rights/role.vue'
import Goods from '../components/goods/goods.vue'
import { Message } from 'element-ui'
import AddGoods from '../components/goods/addGoods.vue'
import Params from '../components/goods/params.vue'
import Categories from '../components/goods/categories.vue'
import Orders from '../components/orders/orders.vue'
import Reports from '../components/reports/reports.vue'

Vue.use(Router)

var router =  new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Right
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'addGoods',
          path: '/addGoods',
          component: AddGoods
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'orders',
          path: '/orders',
          component: Orders
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})

// 导航守卫，进行路由跳转的控制
router.beforeEach((to, from, next) => {
  // to：准备前往的路由
  // from: 路由来自哪里
  // next: 向下继续执行

  // 1、首先判断当前是否是前往登录页面，不是就进行token的判断
  if (to.name !== 'login') {
    const token = localStorage.getItem('token')
    // 2、获取token并且判断token，存在时前往目的url，不存在返回的登录页面
    if (!token) {
      Message.warning('请先登录！')
      router.push({name: 'login'})
      return
    }
  }
  next()
})

export default router
