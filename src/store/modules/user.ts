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
import { constantRoute } from '@/router/router'

// 创建用户小仓库
const useUserStore = defineStore('UserStore', {
  // 用户仓库存储数据地方
  state(): UserState {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '', // 用户头像
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
