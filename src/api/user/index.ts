// 同一管理用户相关的接口
import request from '@/utils/request'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  ResponseData,
} from './type'

// 统一管理API
enum API {
  // LOGIN_URL = '/user/login',
  // USERINFO_URL = 'user/info',
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 暴露请求函数
// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => {
  return request.post<any, ResponseData>(API.LOGOUT_URL)
}
