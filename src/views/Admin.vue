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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useImageStore, useUserStore } from '@/stores'
import { categoryAPI } from '@/api'
import {
  SwitchButton,
  Odometer,
  Picture,
  Menu,
  Plus,
  View,
  Star
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
    ElMessage.error('获取分类列表失败')
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

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
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
    ElMessage.error('操作失败：' + error.message)
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
      ElMessage.error('删除失败：' + error.message)
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
    ElMessage.error('添加分类失败：' + error.message)
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
      ElMessage.error('删除失败：' + error.message)
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
}
</style>