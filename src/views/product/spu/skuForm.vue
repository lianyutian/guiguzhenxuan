<template>
  <el-card style="margin: 10px 0px">
    <el-form label-width="100px">
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input placeholder="重量(g)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input placeholder="SKU描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            v-for="item in attrArr"
            :key="item.id"
            :label="item.attrName"
          >
            <el-select v-model="item.attrIdAndValueId">
              <el-option
                :value="`${item.id}:${attrValue.id}`"
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            label="颜色"
            size="small"
            v-for="item in saleArr"
            :key="item.id"
          >
            <el-select>
              <el-option
                :label="option.saleAttrName"
                v-for="option in item"
                :key="option.id"
                :value="option.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称" size="small">
        <el-table border>
          <el-table-column
            type="selection"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">保存</el-button>
        <el-button size="default" @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import { AttrResponseData } from '@/api/product/attr/type'
import { reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import { SaleAttrResponseData, SpuHasImg } from '@/api/product/spu/type'
import { ref } from 'vue'

//定义子传父
const emit = defineEmits(['changeScene'])
//取消按钮的回调
const cancle = () => {
  emit('changeScene', {
    flag: 0,
    params: '',
  })
}

let attrArr = ref()
let saleArr = ref()
let imgArr = ref()
//当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  //获取平台属性
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  let result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙的数据
  let result2: SpuHasImg = await reqSpuImageList(spu.id)
  //平台属性
  attrArr.value = result.data
  //销售属性
  saleArr.value = result1.data
  //图片
  imgArr.value = result2.data
}

defineExpose({ initSkuData })
</script>
