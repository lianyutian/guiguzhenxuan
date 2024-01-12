<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <!-- SPU展示页面 -->
    <div v-show="scene === 0">
      <el-card style="margin: 10px 0px">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0px" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row 回传编辑数据 -->
            <template #default="{ row }">
              <el-button
                size="small"
                icon="Plus"
                @click="addSku(row)"
                title="添加SKU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateSpu(row)"
                title="编辑SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- SPU编辑页面 -->
    <SpuForm
      v-show="scene === 1"
      ref="spu"
      @changeScene="changeScene"
    ></SpuForm>
    <!-- SKU编辑页面 -->
    <SkuForm
      v-show="scene === 2"
      @changeScene="changeScene"
      ref="sku"
    ></SkuForm>
    <!-- 分页器 -->
    <el-pagination
      v-show="scene === 0"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getHasSpu"
      @size-change="changeSize"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import { HasSpuResponseData, SpuData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'

//分类仓库数据
const categoryStore = useCategoryStore()
//场景的数据
let scene = ref<number>(0)
//分页器默认页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有SPU的数据
let records = ref<any>([])
//此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  console.log(pager)

  //修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 监听c3Id变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的SPU
    records.value = []
    //保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return
    //获取SPU
    getHasSpu()
  },
)
//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
//获取子组件实例
const spu = ref<any>()
//修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1
  //调用子组件实例方法获取完整已有的SPU的数据
  spu.value.initHasSpuData(row)
}

//子组件SpuForm绑定自定义事件:目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  console.log('cancle2')

  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

const sku = ref()
//添加SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
</script>
<style lang="scss" scoped></style>
