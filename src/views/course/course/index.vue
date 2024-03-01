<template>
  <!-- 课程搜索选择 -->
  <el-card style="margin: 10px 0px">
    <el-form inline>
      <el-form-item label="课程分类">
        <el-cascader
          v-model="value"
          :options="options"
          :props="props"
          clearable
        />
      </el-form-item>
      <el-form-item label="售卖模式">
        <el-select v-model="saleModel" clearable>
          <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
          <el-option value="免费"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="courseName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="更新时间">
        <div class="block">
          <el-date-picker
            v-model="courseDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 课程管理界面 -->
  <el-card style="margin: 10px 0px">
    <div class="course">
      <el-button type="primary" size="default">新增课程</el-button>
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="User" name="first"></el-tab-pane>
        <el-tab-pane label="Config" name="second"></el-tab-pane>
        <el-tab-pane label="Role" name="third"></el-tab-pane>
        <el-tab-pane label="Task" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <el-table border style="margin: 10px 0px">
      <el-table-column
        type="index"
        align="center"
        label="序号"
      ></el-table-column>

      <el-table-column
        label="课程名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="课程价格"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="课时"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column
        label="所属分类"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template #="{ row, $index }">
          <el-button size="small" icon="User">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { reqCourseCategory } from '@/api/course/course'
import { CategoryResponseData } from '@/api/course/course/type'
import { onMounted, ref } from 'vue'

// 课程分类 start
let value = ref()

const props = {
  expandTrigger: 'hover' as const,
}

let options = ref([
  {
    value: '',
    label: '',
    children: [],
  },
])

const activeName = ref('first')
let courseCategory = ref()
const getCourseCategory = async () => {
  let result: CategoryResponseData = await reqCourseCategory()

  if (result.code === 200) {
    courseCategory.value = result.data

    options.value = parseData(courseCategory.value)

    console.log(options)
  }
}

// 递归函数，解析数据，构建树结构
const parseData = (data) => {
  return data.map((item) => {
    const newItem = {
      value: item.id,
      label: item.label,
      children: [],
    }
    if (item.childrens && item.childrens.length > 0) {
      newItem.children = parseData(item.childrens)
    }
    return newItem
  })
}

// 课程分类 end

// 售卖模式
let saleModel = ref()
// 课程名称
let courseName = ref()
// 课程日期
const courseDate = ref('')
onMounted(() => {
  // 获取分类数据
  getCourseCategory()
})
</script>
<script lang="ts">
export default {
  name: 'CourseManager',
}
</script>
<style lang="scss" scoped>
.course {
  display: flex;
  justify-content: space-between;
}
</style>
