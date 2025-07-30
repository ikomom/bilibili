<template>
  <div class="user-management">
    <div class="header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.username"
            placeholder="搜索用户名"
            prefix-icon="Search"
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchForm.role" placeholder="角色" @change="handleSearch">
            <el-option label="全部" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchForm.status" placeholder="状态" @change="handleSearch">
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="users"
      v-loading="loading"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
            {{ row.role === 'admin' ? '管理员' : '用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="editUser(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 'active' ? 'warning' : 'success'"
            @click="toggleUserStatus(row)"
          >
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="deleteUser(row)"
            :disabled="row.role === 'admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password" v-if="editingUser">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="留空则不修改密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser" :loading="saving">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api, { authAPI } from '../../api'

const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref()

const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  username: '',
  role: '',
  status: ''
})

const userForm = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
  role: 'user',
  status: 'active'
})

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      ...searchForm
    }
    
    const response = await authAPI.getUsers(params)
    users.value = response.users
    total.value = response.total
  } catch (error) {
    
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    username: '',
    role: '',
    status: ''
  })
  handleSearch()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  fetchUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    password: '',
    email: user.email || '',
    nickname: user.nickname || '',
    role: user.role,
    status: user.status
  })
  showAddDialog.value = true
}

const saveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    saving.value = true
    
    if (editingUser.value) {
      // 编辑用户
      const updateData = { ...userForm }
      if (!updateData.password) {
        delete updateData.password
      }
      
      await authAPI.updateUser(editingUser.value.id, updateData)
      ElMessage.success('用户更新成功')
    } else {
      // 添加用户
      await authAPI.register(userForm)
      ElMessage.success('用户添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
    fetchUsers()
  } catch (error) {
    
  } finally {
    saving.value = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    await authAPI.toggleUserStatus(user.id)
    ElMessage.success(`用户${user.status === 'active' ? '禁用' : '启用'}成功`)
    fetchUsers()
  } catch (error) {
    
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await authAPI.deleteUser(user.id)
    ElMessage.success('用户删除成功')
    fetchUsers()
  } catch (error) {
  }
}

const resetForm = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    password: '',
    email: '',
    nickname: '',
    role: 'user',
    status: 'active'
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="less" scoped>
@import '../../style.less';

.user-management {
  padding: @spacing-lg;
  font-family: @font-family;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-lg;
    
    h2 {
      margin: 0;
      color: @text-color-primary;
      font-size: @font-size-xl;
      font-weight: @font-weight-bold;
    }
    
    .el-button {
      border-radius: @border-radius;
      transition: all @transition-duration;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: @shadow-hover;
      }
    }
  }
  
  .filters {
    margin-bottom: @spacing-lg;
    padding: @spacing-lg;
    background: @bg-color-light;
    border-radius: @border-radius;
    border: 1px solid @border-color;
    transition: all @transition-duration;
    
    &:hover {
      box-shadow: @shadow-light;
    }
    
    .el-input, .el-select {
      .el-input__wrapper {
        border-radius: @border-radius-sm;
        transition: all @transition-duration;
        
        &:hover {
          border-color: @primary-color;
        }
      }
    }
    
    .el-button {
      border-radius: @border-radius-sm;
      transition: all @transition-duration;
      
      &:hover {
        transform: translateY(-1px);
      }
    }
  }
  
  .pagination {
    margin-top: @spacing-lg;
    text-align: right;
    
    :deep(.el-pagination) {
      .el-pager li {
        border-radius: @border-radius-sm;
        margin: 0 2px;
        transition: all @transition-duration;
        
        &:hover {
          transform: translateY(-1px);
        }
      }
      
      .btn-prev, .btn-next {
        border-radius: @border-radius-sm;
        transition: all @transition-duration;
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: @spacing-sm;
    
    .el-button {
      border-radius: @border-radius;
      transition: all @transition-duration;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: @shadow-hover;
      }
    }
  }
  
  :deep(.el-table) {
    border-radius: @border-radius;
    overflow: hidden;
    box-shadow: @shadow-light;
    border: 1px solid @border-color;
    
    th {
      background-color: @bg-color-light;
      color: @text-color-primary;
      font-weight: @font-weight-semibold;
      font-family: @font-family;
    }
    
    td {
      font-family: @font-family;
      color: @text-color-regular;
    }
    
    .el-button {
      border-radius: @border-radius-sm;
      transition: all @transition-duration;
      
      &:hover {
        transform: translateY(-1px);
      }
    }
    
    .el-tag {
      border-radius: @border-radius-sm;
      font-weight: @font-weight-medium;
    }
  }
  
  :deep(.el-dialog) {
    border-radius: @border-radius;
    
    .el-dialog__header {
      background: @bg-color-light;
      border-bottom: 1px solid @border-color;
      
      .el-dialog__title {
        font-weight: @font-weight-semibold;
        color: @text-color-primary;
      }
    }
    
    .el-form-item {
      .el-input__wrapper, .el-select .el-input__wrapper {
        border-radius: @border-radius-sm;
        transition: all @transition-duration;
        
        &:hover {
          border-color: @primary-color;
        }
      }
    }
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    padding: @spacing-md;
    
    .header {
      flex-direction: column;
      gap: @spacing-md;
      
      h2 {
        font-size: @font-size-lg;
      }
    }
    
    .filters {
      padding: @spacing-md;
      
      .el-row {
        .el-col {
          margin-bottom: @spacing-sm;
        }
      }
    }
    
    .pagination {
      text-align: center;
    }
  }
}
</style>