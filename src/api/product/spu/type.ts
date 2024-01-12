//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//SPU数据的ts类型:需要修改
export interface SpuData {
  category3Id: number
  id?: number
  spuName: string
  tmId: string
  description: string
  spuImageList: SpuImg[]
  spuSaleAttrList: SaleAttr[]
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

export interface SpuSaleAttrValue {
  id?: number
  createTime?: Date
  updateTime?: Date
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: boolean
}

//销售属性对象ts类型
export interface SaleAttr {
  saleAttrValue?: string
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValue[]
  flag?: boolean
}
//SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}
export interface SaleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}
export interface SkuData {
  category3Id: string | number //三级分类的ID
  spuId: string | number //已有的SPU的ID
  tmId: string | number //SPU品牌的ID
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: SaleArr[]
  skuDefaultImg: string //sku图片地址
}
