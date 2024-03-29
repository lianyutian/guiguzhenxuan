<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="danger"
      size="default"
      @click="dialogFormVisible = true"
      :disabled="selectIdArr.length === 0"
    >
      批量删除
    </el-button>
    <!-- 删除确认 -->
    <el-dialog v-model="dialogFormVisible" title="批量删除">
      <!-- https://lianyutian.github.io/posts/dd58b23f.html 10.3具名插槽 -->
      <template #header>
        <span>您确定要删除该用户吗？</span>
      </template>
      <template #default>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
    <!-- table展示用户信息 -->
    <el-table
      style="margin: 10px 0px"
      border
      :data="userArr"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column
        label="序号"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        show-overflow-tooltip
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        show-overflow-tooltip
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <!-- row 回传编辑数据 -->
        <template #default="{ row }">
          <!-- 分配角色 -->
          <el-button size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>

          <!-- 编辑 -->
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`您确定要删除${row.username}?`"
            width="250px"
            icon="Delete"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRole,
  reqUserInfo,
} from '@/api/acl/user'

//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
onMounted(() => {
  getHasUser()
})
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示的数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    limit.value,
    keyword.value,
    /* keyword.value, */
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 当下拉菜单发生变化的时候触发此方法
// 这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  // 当前每一页的数据量发生变化的时候，当前页码归1
  getHasUser()
}

//添加用户
const drawer = ref(false)
let formRef = ref<any>()
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
//保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  await formRef.value.validate()
  //保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  //添加或者更新成功
  if (result.code === 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    //获取最新的全部账号的信息
    getHasUser(userParams.id ? pageNo.value : 1)
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
    return
  }
  //添加或者更新成功
  //获取最新的全部账号的信息
  getHasUser(userParams.id ? pageNo.value : 1)
  //浏览器自动刷新一次
  window.location.reload()
}
//校验用户名字回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  const len = value.trim().length
  if (len >= 5 && len <= 10) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorName = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  const len = value.trim().length
  if (len >= 5 && len <= 10) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  //用户密码,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

//更新已有的用户按钮的回调
//row:即为已有用户的账号信息
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

//分配角色
let drawer1 = ref(false)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([])
//分配角色按钮的回调
const setRole = async (row: User) => {
  //存储已有的用户信息
  Object.assign(userParams, row)
  //获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    //存储全部的职位
    allRole.value = result.data.allRolesList
    //存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    //抽屉显示出来
    drawer1.value = true
  }
}
//收集顶部复选框全选数据
let checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
let isIndeterminate = ref<boolean>(true)
//顶部的全部复选框的change事件
const handleCheckAllChange = (val: any) => {
  //val:true(全选)|false(没有全选)
  //将所有角色赋给用户角色
  userRole.value = val ? allRole.value : []
  //不确定的样式(确定样式)'-'
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string | any[]) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
//确定按钮的回调(分配职位)
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  //分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: result.data,
    })
  }
}
//table复选框勾选的时候会触发的事件
let selectIdArr = ref([])
console.log(selectIdArr.value.length)

const handleSelectionChange = (value: any) => {
  selectIdArr.value = value
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item: { id: any }) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)

  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: result.data,
    })
  }
}
let dialogFormVisible = ref(false)
const confirm = () => {
  deleteSelectUser()
  dialogFormVisible.value = false
}

let keyword = ref()
//搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}
//重置
import useLayOutSettingStore from '@/store/modules/setting'
//获取模板setting仓库
let settingStore = useLayOutSettingStore()
//重置按钮
//借助 src\layout\main\index.vue 中监听刷新机制，销毁组件
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>
