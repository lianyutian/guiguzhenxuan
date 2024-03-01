//分类相关的数据ts类型
export interface ResponseData {
  code: number
  message: string
  success: boolean
}

//分类ts类型
export interface CourseCategoryObj {
  id: string
  name: string
  label: string
  parentId: string
  isShow: number
  isLeaf: number
  orderBy: number
  childrens: []
}

//相应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CourseCategoryObj[]
}
