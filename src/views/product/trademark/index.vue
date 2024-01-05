<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="dialogFormVisible = true"
    >
      添加品牌
    </el-button>
    <!-- 表格组件，用于展示已有的数据 -->
    <!-- 
      table
      ---border:是否有纵向的边框
      table-column
      ---lable：某一个列表
      ---width：设置这一列的宽度
      ---align：设置这一列对齐方式
     -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- https://lianyutian.github.io/posts/dd58b23f.html 10.4作用域插槽 -->
        <template #default="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #default="{}">
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <!-- 
      pagination
      ---v-model:current-page：设置当前分页器页码
      ---v-model:page-size:设置每一也展示数据条数
      ---page-sizes：每页显示个数选择器的选项设置
      ---background:背景颜色
      ---layout：分页器6个子组件布局的调整 "->"把后面的子组件顶到右侧
     -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      :total="total"
      @current-change="getHasTrademark"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 对话框组件:在添加品牌与修改已有品牌的业务时候使用结构 -->
  <!-- 
       v-model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
       title:设置对话框左上角标题
  -->
  <el-dialog v-model="dialogFormVisible" title="添加品牌">
    <el-form style="width: 80%">
      <el-form-item label="品牌名称" label-width="80px">
        <el-input />
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="80px">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- https://lianyutian.github.io/posts/dd58b23f.html 10.3具名插槽 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqHasTrademark } from '@/api/product/trademark'
// 引入组合式API函数
import { ref, onMounted } from 'vue'
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示的数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<any>([])
// 获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用次函数即可
// 父子组件通信  https://lianyutian.github.io/posts/dd58b23f.html 8.3子传父
const getHasTrademark = async (page = 1) => {
  // 当前页码
  pageNo.value = page
  let result = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    //存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 当下拉菜单发生变化的时候触发此方法
// 这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  // 当前每一页的数据量发生变化的时候，当前页码归1
  getHasTrademark()
}

// 组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})
// 对话框功能逻辑
let dialogFormVisible = ref(false)
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
