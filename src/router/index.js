import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '?????????', icon: 'dashboard', affix: true }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/product",
    component: Layout,
    redirect:"/product",
    meta:{
      title: "????????????",
      icon: 'el-icon-goods'
    },
    children: [
      {
        path: 'productList',
        component: () => import('@/views/product/product/index'),
        name: 'productList',
        meta: { title: '????????????', icon: 'list', affix: true }
      },
      {
        path: 'addProduct',
        component: () => import('@/views/product/product/add'),
        name: 'addProduct',
        meta: { title: '????????????', icon: 'el-icon-circle-plus', affix: true }
      }, 
      {
        path: 'updateProduct',
        component: () => import('@/views/product/product/update'),
        name: 'addProduct',
        meta: { title: '????????????', icon: 'el-icon-circle-plus', affix: true },
        hidden:true
      }, 
      //????????????
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/product/category/index'),
        meta: { title: '????????????', icon: 'el-icon-menu', affix: true },
      },
      {
        path: 'addCategory',
        component: () => import('@/views/product/category/add'),
        name: 'addCategory',
        meta: { title: '????????????' },
        hidden:true
      },
      {
        path: 'updateCategory',
        component: () => import('@/views/product/category/update'),
        name: 'updateCategory',
        meta: { title: '????????????' },
        hidden:true
      },
      
      //????????????
      {
        path: 'attr',
        component: () => import('@/views/product/attr/index'),
        name: 'attr',
        meta: { title: '????????????', icon: 'el-icon-menu', affix: true }
      },
      {
        path: 'productAttrList',
        component: () => import('@/views/product/attr/productAttrList'),
        name: 'productAttrList',
        meta: { title: '????????????', icon: 'el-icon-menu', affix: true },
        hidden:true
      },
      {
        path: 'editProductAttr',
        component: () => import('@/views/product/attr/editProductAttr'),
        name: 'editProductAttr',
        meta: { title: '??????????????????', icon: 'el-icon-menu', affix: true },
        hidden:true
      },

      //brand
      {
        path: 'brand',
        component: () => import('@/views/product/brand/index'),
        name: 'ProductBrandList',
        meta: { title: '????????????', icon: 'component', affix: true }
      },

      //brand
      {
        path: 'brand/update',
        component: () => import('@/views/product/brand/update'),
        name: 'ProductBrandUpdate',
        meta: { title: '????????????', icon: 'component', affix: true },
        hidden: true,
      },
      {
        path: 'brand/add',
        component: () => import('@/views/product/brand/add'),
        name: 'ProductBrandAdd',
        meta: { title: '????????????', icon: 'component', affix: true },
        hidden: true,
      },
      
    ]
  },


  {
    path: "/marketing",
    component: Layout,
    redirect:"/marketing",
    meta:{
      title: "????????????",
      icon: 'el-icon-goods'
    },
    children:[
      {
        path: '/advertisement',
        component: () => import('@/views/marketing/advertisement/index'),
        name: 'Advertisement',
        meta: { title: '????????????', icon: 'component', affix: true },
        // hidden: true,
      },
      {
        path: '/advertisement/add',
        component: () => import('@/views/marketing/advertisement/add'),
        name: 'addAd',
        meta: { title: '????????????', icon: 'component', affix: true },
        hidden: true,
      },
      {
        path: '/advertisement/update',
        component: () => import('@/views/marketing/advertisement/update'),
        name: 'addAd',
        meta: { title: '????????????', icon: 'component', affix: true },
        hidden: true,
      },
      

      {
        path: 'recommend',
        component: () => import('@/views/marketing/recommend/index'),
        name: 'Advertisement',
        meta: { title: '????????????', icon: 'component', affix: true },
        // hidden: true,
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
