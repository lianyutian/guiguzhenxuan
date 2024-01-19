/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/store/modules/user.ts

// 创建用户相关的仓库
import { defineStore } from 'pinia'
import {
  ResponseData,
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { UserState } from './type/type'
import { constantRoute, asnycRoute, anyRoute } from '@/router/router'
import router from '@/router'
//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        //硅谷333账号:product\trademark\attr\sku
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
const useUserStore = defineStore('UserStore', {
  // 用户仓库存储数据地方
  state(): UserState {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '', // 用户头像
      //存储当前用户是否包含某一个按钮
      buttons: [],
    }
  },
  // 处理异步|逻辑地方
  actions: {
    // 用户登录
    async userLoginAction(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = result.data as string
        //localStorage.setItem('TOKEN', this.token)
        SET_TOKEN(this.token)
        return 'OK'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async userInfoAction() {
      const result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asnycRoute),
          result.data.routes,
        )
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogoutAction() {
      // 退出登录
      const result: ResponseData = await reqLogout()
      if (result.code === 200) {
        //本地数据清空
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
// 对外暴露小仓库
export default useUserStore
