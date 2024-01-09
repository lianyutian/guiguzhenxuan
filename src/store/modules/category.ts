//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from './type/type'
const useCategoryStore = defineStore('Category', {
  state(): CategoryState {
    return {
      //存储一级分类的数据
      c1Arr: [],
      //存储一级分类的ID
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    //获取一级分类的方法
    async getC1Action() {
      //发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    //获取二级分类的方法
    async getC2Action(category1Id: string | number) {
      //发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC2(category1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    //获取三级分类的方法
    async getC3Action(category2Id: string | number) {
      //发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC3(category2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
