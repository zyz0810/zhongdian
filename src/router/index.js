import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

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
    icon: 'svg-name'             the icon show in the sidebar
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
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'indexIcon', affix: true }
  //     }
  //   ]
  // }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/project/list',
    // name: '实时监测',
    meta: {
      // title: '实时监测',
      icon: 'iconfont icon-hangzhengguanli',
      roles: ['admin'],
    },
    children: [
      {
        path: 'project/list',
        component: () => import('@/views/project/list'),
        name: 'projectList',
        meta: {
          title: '项目管理',
          roles: ['admin'],
        }
      }
    ]
  },
  {
    path: '/speed',
    component: Layout,
    redirect: 'noRedirect',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'el-icon-s-order',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/speed/list'),
        name: 'speedList',
        meta: {
          title: '进度管理',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/evaluate',
    component: Layout,
    redirect: 'noRedirect',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-xingxing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/evaluate/list'),
        name: 'evaluateList',
        meta: {
          title: '考核评价',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/display',
    component: Layout,
    redirect: 'noRedirect',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'el-icon-s-opportunity',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/display/list'),
        name: 'displayList',
        meta: {
          title: '重点工作展示板',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
]

const createRouter = () =>
  new Router({
    base:'keynote',
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
