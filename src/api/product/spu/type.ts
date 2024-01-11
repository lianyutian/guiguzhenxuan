//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//SPU数据的ts类型:需要修改
export interface SpuData {
  category3Id: string | number
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}
//数组:元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//品牌数据的TS类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

//商品图片的ts类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
//已有的SPU的照片墙数据的类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface SaleAttrValue {
  id: number | string
  createTime: Date
  updateTime: Date
  spuId: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName: string
  isChecked: boolean
}
export interface SpuSaleAttrValueList {
  spuSaleAttrValueList: SaleAttrValue[]
}

//销售属性对象ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
//SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}