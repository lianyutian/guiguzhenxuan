import request from '@/utils/request'
import { CategoryResponseData } from './type'
enum API {
  // 获取课程分类接口
  COURSE_CATEGORY = '/learnhub/category/queryCourseCategoryList',
}

export const reqCourseCategory = () =>
  request.get<any, CategoryResponseData>(API.COURSE_CATEGORY)
