<template>
  <div class="admin">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1>管理后台</h1>
      </div>
      <div class="header-right">
        <span class="welcome">欢迎，{{ userStore.adminInfo?.name }}</span>
        <el-button type="danger" size="small" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </header>

    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><Odometer /></el-icon>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="images">
            <el-icon><Picture /></el-icon>
            <span>图片管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <el-icon><Menu /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 主要内容区域 -->
      <main class="main-content">
        <!-- 数据概览 -->
        <div v-if="activeMenu === 'dashboard'" class="dashboard">
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Picture /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ imageStore.images.length }}</h3>
                <p>总图片数</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><View /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ totalViews }}</h3>
                <p>总观看数</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Star /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ totalLikes }}</h3>
                <p>总点赞数</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Menu /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ categoryList.length }}</h3>
                <p>分类数量</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 图片管理 -->
        <div v-if="activeMenu === 'images'" class="image-management">
          <div class="management-header">
            <h2>图片管理</h2>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加图片
            </el-button>
          </div>

          <div class="image-table">
            <el-table :data="imageStore.images" style="width: 100%" v-loading="imageStore.loading">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column label="缩略图" width="120">
                <template #default="scope">
                  <img :src="getImageUrl(scope.row)" class="table-thumbnail" />
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" min-width="200" />
              <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
              <el-table-column prop="category" label="分类" width="100" />
              <el-table-column prop="views" label="观看数" width="100" />
              <el-table-column prop="likes" label="点赞数" width="100" />
              <el-table-column label="上传时间" width="120">
                <template #default="scope">
                  {{ formatDate(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" @click="editImage(scope.row)">
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteImage(scope.row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 分类管理 -->
        <div v-if="activeMenu === 'categories'" class="category-management">
          <div class="management-header">
            <h2>分类管理</h2>
            <el-button type="primary" @click="showCategoryDialog = true">
              <el-icon><Plus /></el-icon>
              添加分类
            </el-button>
          </div>

          <div class="category-list" v-loading="categoryLoading">
            <div
              v-for="category in categoryList"
              :key="category.id"
              class="category-item"
            >
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-desc">{{ category.description }}</span>
              </div>
              <el-button
                size="small"
                type="danger"
                @click="deleteCategory(category.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 用户管理 -->
        <div v-if="activeMenu === 'users'" class="user-management">
          <div class="management-header">
            <h2>用户管理</h2>
            <el-button type="primary" @click="showUserAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
          </div>

          <!-- 搜索和筛选 -->
          <div class="filters">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input
                  v-model="userSearchForm.username"
                  placeholder="搜索用户名"
                  prefix-icon="Search"
                  @input="handleUserSearch"
                />
              </el-col>
              <el-col :span="4">
                <el-select v-model="userSearchForm.role" placeholder="角色" @change="handleUserSearch">
                  <el-option label="全部" value="" />
                  <el-option label="管理员" value="admin" />
                  <el-option label="用户" value="user" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="userSearchForm.status" placeholder="状态" @change="handleUserSearch">
                  <el-option label="全部" value="" />
                  <el-option label="正常" value="active" />
                  <el-option label="禁用" value="inactive" />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button @click="resetUserSearch">重置</el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 用户表格 -->
          <el-table
            :data="users"
            v-loading="userLoading"
            stripe
            style="width: 100%"
            class="user-table"
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
              v-model:current-page="userCurrentPage"
              v-model:page-size="userPageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="userTotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleUserSizeChange"
              @current-change="handleUserCurrentChange"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- 添加/编辑图片对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingImage ? '编辑图片' : '添加图片'"
      width="500px"
    >
      <el-form :model="imageForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="imageForm.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="imageForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="imageForm.category" style="width: 100%">
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片文件">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleFileChange"
          >
            <el-button type="primary">选择图片</el-button>
          </el-upload>
          <div v-if="selectedFile" class="file-info">
            已选择: {{ selectedFile.name }}
          </div>
        </el-form-item>
        <el-form-item label="缩略图URL" v-if="!selectedFile">
          <el-input v-model="imageForm.thumbnail" placeholder="或输入图片URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveImage">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加分类对话框 -->
    <el-dialog v-model="showCategoryDialog" title="添加分类" width="400px">
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="addCategory" :loading="categoryLoading">添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="showUserAddDialog"
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
          <el-button @click="showUserAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser" :loading="userSaving">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useImageStore, useUserStore } from '@/stores'
import { categoryAPI, authAPI } from '@/api'
import {
  SwitchButton,
  Odometer,
  Picture,
  Menu,
  Plus,
  View,
  Star,
  User
} from '@element-plus/icons-vue'

const router = useRouter()
const imageStore = useImageStore()
const userStore = useUserStore()

const activeMenu = ref('dashboard')
const showAddDialog = ref(false)
const showCategoryDialog = ref(false)
const editingImage = ref(null)
const categoryLoading = ref(false)
const categoryList = ref([])
const selectedFile = ref(null)
const uploadRef = ref()

// 用户管理相关变量
const showUserAddDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref()
const userLoading = ref(false)
const userSaving = ref(false)
const users = ref([])
const userTotal = ref(0)
const userCurrentPage = ref(1)
const userPageSize = ref(10)

// 图片表单数据
const imageForm = reactive({
  title: '',
  description: '',
  category: '',
  thumbnail: ''
})

// 分类表单数据
const categoryForm = reactive({
  name: '',
  description: ''
})

// 用户搜索表单数据
const userSearchForm = reactive({
  username: '',
  role: '',
  status: ''
})

// 用户表单数据
const userForm = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
  role: 'user',
  status: 'active'
})

// 用户表单验证规则
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

// 计算属性
const totalViews = computed(() => {
  return imageStore.images.reduce((sum, img) => sum + img.views, 0)
})

const totalLikes = computed(() => {
  return imageStore.images.reduce((sum, img) => sum + img.likes, 0)
})

// 菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index
  if (index === 'users') {
    fetchUsers()
  }
}

// 用户管理方法
const fetchUsers = async () => {
  userLoading.value = true
  try {
    const params = {
      page: userCurrentPage.value,
      limit: userPageSize.value,
      ...userSearchForm
    }
    
    const response = await authAPI.getUsers(params)
    users.value = response.users
    userTotal.value = response.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
    
  } finally {
    userLoading.value = false
  }
}

const handleUserSearch = () => {
  userCurrentPage.value = 1
  fetchUsers()
}

const resetUserSearch = () => {
  Object.assign(userSearchForm, {
    username: '',
    role: '',
    status: ''
  })
  handleUserSearch()
}

const handleUserSizeChange = (val) => {
  userPageSize.value = val
  fetchUsers()
}

const handleUserCurrentChange = (val) => {
  userCurrentPage.value = val
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
  showUserAddDialog.value = true
}

const saveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    userSaving.value = true
    
    const userData = { ...userForm }
    if (editingUser.value && !userData.password) {
      delete userData.password
    }
    
    if (editingUser.value) {
      await authAPI.updateUser(editingUser.value.id, userData)
      ElMessage.success('用户更新成功')
    } else {
      await authAPI.register(userData)
      ElMessage.success('用户添加成功')
    }
    
    showUserAddDialog.value = false
    resetUserForm()
    fetchUsers()
  } catch (error) {
    console.error('保存用户失败:', error)
    
  } finally {
    userSaving.value = false
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
    if (error !== 'cancel') {
      
    }
  }
}

const resetUserForm = () => {
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

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/admin/login')
    ElMessage.success('已退出登录')
  })
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    categoryLoading.value = true
    const response = await categoryAPI.getCategories()
    categoryList.value = response
  } catch (error) {
    
  } finally {
    categoryLoading.value = false
  }
}

// 文件选择处理
const handleFileChange = (file) => {
  selectedFile.value = file.raw
}

// 获取图片URL
const getImageUrl = (image) => {
  if (image.thumbnail) {
    if (image.thumbnail.startsWith('/uploads/')) {
      return `http://localhost:3001${image.thumbnail}`
    }
    return image.thumbnail
  }
  return `https://picsum.photos/400/300?random=${image.id}`
}

// 编辑图片
const editImage = (image) => {
  editingImage.value = image
  Object.assign(imageForm, {
    title: image.title,
    description: image.description,
    category: image.category,
    thumbnail: image.thumbnail
  })
  selectedFile.value = null
  showAddDialog.value = true
}

// 保存图片
const saveImage = async () => {
  if (!imageForm.title || !imageForm.category) {
    ElMessage.error('请填写完整信息')
    return
  }

  try {
    if (editingImage.value) {
      // 编辑模式
      await imageStore.updateImage(editingImage.value.id, { ...imageForm })
      ElMessage.success('图片更新成功')
    } else {
      // 添加模式
      const formData = new FormData()
      formData.append('title', imageForm.title)
      formData.append('description', imageForm.description)
      formData.append('category', imageForm.category)
      
      if (selectedFile.value) {
        formData.append('file', selectedFile.value)
      } else if (imageForm.thumbnail) {
        formData.append('url', imageForm.thumbnail)
      } else {
        ElMessage.error('请选择图片文件或输入图片URL')
        return
      }
      
      await imageStore.addImage(formData)
      ElMessage.success('图片添加成功')
    }

    // 重置表单
    Object.assign(imageForm, {
      title: '',
      description: '',
      category: '',
      thumbnail: ''
    })
    selectedFile.value = null
    editingImage.value = null
    showAddDialog.value = false
  } catch (error) {
    
  }
}

// 删除图片
const deleteImage = (id) => {
  ElMessageBox.confirm('确定要删除这张图片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await imageStore.deleteImage(id)
      ElMessage.success('删除成功')
    } catch (error) {
      
    }
  })
}

// 添加分类
const addCategory = async () => {
  if (!categoryForm.name.trim()) {
    ElMessage.error('请输入分类名称')
    return
  }

  try {
    categoryLoading.value = true
    await categoryAPI.createCategory(categoryForm)
    ElMessage.success('分类添加成功')
    Object.assign(categoryForm, { name: '', description: '' })
    showCategoryDialog.value = false
    await fetchCategories()
  } catch (error) {
    
  } finally {
    categoryLoading.value = false
  }
}

// 删除分类
const deleteCategory = (id) => {
  ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await categoryAPI.deleteCategory(id)
      ElMessage.success('删除成功')
      await fetchCategories()
    } catch (error) {
      
    }
  })
}

// 初始化
onMounted(async () => {
  userStore.checkAuth()
  await Promise.all([
    imageStore.fetchImages(),
    fetchCategories()
  ])
})
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background-color: #f4f5f7;
}

/* 顶部导航 */
.admin-header {
  background: #fff;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome {
  color: #666;
  font-size: 14px;
}

/* 内容区域 */
.admin-content {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* 侧边栏 */
.sidebar {
  width: 200px;
  background: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  border-right: none;
}

/* 主要内容 */
.main-content {
  flex: 1;
  padding: 20px;
}

/* 数据概览 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.stat-info h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.stat-info p {
  color: #666;
  font-size: 14px;
}

/* 管理页面通用样式 */
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.management-header h2 {
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

/* 图片表格 */
.image-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

/* 分类管理 */
.category-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

/* 用户管理样式 */
.filters {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
  }
  
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .filters .el-row {
    flex-direction: column;
  }
  
  .filters .el-col {
    margin-bottom: 10px;
  }
}
</style>