<template>
  <div class="category-management">
    <div class="management-header">
      <div class="header-title">
        <el-icon class="header-icon"><Menu /></el-icon>
        <h2>分类管理</h2>
        <span class="category-count">共 {{ categoryList.length }} 个分类</span>
      </div>
      <el-button type="primary" size="large" @click="showCategoryDialog = true" class="add-btn">
        <el-icon><Plus /></el-icon>
        添加分类
      </el-button>
    </div>
    <div class="category-grid" v-loading="categoryLoading">
      <div
        v-for="category in categoryList"
        :key="category.id"
        class="category-card"
      >
        <div class="card-header">
          <div class="category-icon">
            <el-icon><Menu /></el-icon>
          </div>
          <div class="card-actions">
            <el-dropdown trigger="click">
              <el-button type="text" class="action-btn">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editCategory(category)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="deleteCategory(category.id)" class="danger-item">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="card-content">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-desc">{{ category.description || '暂无描述' }}</p>
          <div class="category-stats">
            <span class="stat-item">
              <el-icon><Picture /></el-icon>
              <span>{{ getCategoryStats(category.name).imageCount }} 张图片</span>
            </span>
            <span class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ getCategoryStats(category.name).totalViews }} 次浏览</span>
            </span>
          </div>
        </div>
        <div class="card-footer">
          <el-tag size="small" type="info">ID: {{ category.id }}</el-tag>
          <span class="create-time">{{ formatDate(category.createdAt) }}</span>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="categoryList.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Menu /></el-icon>
        <h3>暂无分类</h3>
        <p>点击上方按钮添加第一个分类</p>
        <el-button type="primary" @click="showCategoryDialog = true">
          <el-icon><Plus /></el-icon>
          立即添加
        </el-button>
      </div>
    </div>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      v-model="showCategoryDialog"
      width="500px"
      @close="resetCategoryForm"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称" required>
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCategoryDialog = false">取消</el-button>
          <el-button type="primary" @click="saveCategory">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api, {categoryAPI} from '../../api'
import { useImageStore } from '../../stores'
import {
  Menu,
  Plus,
  MoreFilled,
  Edit,
  Delete,
  Picture,
  View
} from '@element-plus/icons-vue'

const showCategoryDialog = ref(false)
const categoryLoading = ref(false)
const categoryList = ref([])
const imageStore = useImageStore()

// 分类表单数据
const categoryForm = reactive({
  name: '',
  description: ''
})

// 获取分类统计数据
const getCategoryStats = (categoryName) => {
  const categoryImages = imageStore.images.filter(img => img.category === categoryName)
  const imageCount = categoryImages.length
  const totalViews = categoryImages.reduce((sum, img) => sum + (img.views || 0), 0)
  return { imageCount, totalViews }
}

// 获取分类列表
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    const response = await categoryAPI.getCategories()
    categoryList.value = response
    // 同时获取图片数据以便计算统计信息
    await imageStore.fetchImages()
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    categoryLoading.value = false
  }
}

// 重置分类表单
const resetCategoryForm = () => {
  Object.assign(categoryForm, {
    name: '',
    description: ''
  })
}

// 添加分类
const addCategory = async () => {
  if (!categoryForm.name.trim()) {
    ElMessage.error('请输入分类名称')
    return
  }

  try {
    await categoryAPI.createCategory(categoryForm)
    ElMessage.success('分类添加成功')
    fetchCategories()
    resetCategoryForm()
    showCategoryDialog.value = false
  } catch (error) {
    // 错误处理已在API层统一处理
  }
}

// 保存分类（添加或编辑）
const saveCategory = () => {
  addCategory()
}

// 编辑分类
const editCategory = (category) => {
  Object.assign(categoryForm, {
    name: category.name,
    description: category.description || ''
  })
  showCategoryDialog.value = true
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
      fetchCategories()
    } catch (error) {
      // 错误处理已在API层统一处理
    }
  })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="less" scoped>
@import '../../style.less';

.category-management {
  padding: @spacing-xl;
  background: @bg-color;
  min-height: 100vh;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-2xl;
  padding: @spacing-xl;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  border-radius: @border-radius-xl;
  color: @white;
  box-shadow: @shadow-2xl;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>') repeat;
    pointer-events: none;
  }
  
  .header-title {
    display: flex;
    align-items: center;
    gap: @spacing-lg;
    position: relative;
    z-index: 1;
    
    .header-icon {
      font-size: @font-size-2xl;
      color: @white;
    }
    
    h2 {
      margin: 0;
      color: @white;
      font-weight: 700;
      font-size: @font-size-2xl;
    }
    
    .category-count {
      background: rgba(255, 255, 255, 0.2);
      padding: @spacing-xs @spacing-sm;
      border-radius: @border-radius-full;
      font-size: @font-size-xs;
      color: @white;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
  }
  
  .add-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: @white;
    transition: all 0.3s ease;
    font-weight: 600;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: @shadow-lg;
    }
  }
}

.data-notice {
  margin-bottom: @spacing-xl;
  
  .el-alert {
    border-radius: @border-radius-lg;
    border: none;
    background: linear-gradient(135deg, @blue-50 0%, @blue-100 100%);
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: @spacing-xl;
}

.category-card {
  background: @white;
  border-radius: @border-radius-xl;
  box-shadow: @shadow-lg;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid @gray-200;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: @shadow-2xl;
    border-color: @primary-color;
    
    &::before {
      opacity: 1;
    }
    
    .category-icon {
      transform: scale(1.1);
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @spacing-lg @spacing-xl;
  background: linear-gradient(135deg, @gray-50 0%, @gray-100 100%);
  border-bottom: 1px solid @gray-200;
  
  .category-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
    border-radius: @border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @white;
    font-size: @font-size-lg;
    transition: all 0.3s ease;
    box-shadow: @shadow-md;
  }
  
  .card-actions {
    .action-btn {
      color: @gray-600;
      padding: @spacing-sm;
      border-radius: @border-radius-md;
      transition: all 0.2s ease;
      
      &:hover {
        background: @gray-200;
        color: @gray-800;
      }
    }
  }
}

.card-content {
  padding: @spacing-xl;
  
  .category-name {
    font-size: @font-size-xl;
    font-weight: 700;
    color: @gray-800;
    margin: 0 0 @spacing-sm 0;
    font-family: @font-family;
  }
  
  .category-desc {
    color: @gray-600;
    font-size: @font-size-sm;
    line-height: @line-height;
    margin: 0 0 @spacing-lg 0;
    min-height: 21px;
    font-weight: 400;
  }
  
  .category-stats {
    display: flex;
    gap: @spacing-lg;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: @spacing-xs;
      color: @gray-500;
      font-size: @font-size-xs;
      font-weight: 500;
      
      .el-icon {
        font-size: @font-size-sm;
        color: @primary-color;
      }
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @spacing-sm @spacing-xl;
  background: @gray-50;
  border-top: 1px solid @gray-200;
  
  .create-time {
    color: @gray-500;
    font-size: @font-size-xs;
    font-weight: 500;
  }
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: @spacing-4xl @spacing-xl;
  background: @white;
  border-radius: @border-radius-xl;
  border: 2px dashed @gray-300;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: @primary-color;
    background: fade(@primary-color, 2%);
  }
  
  .empty-icon {
    font-size: @font-size-4xl;
    color: @gray-400;
    margin-bottom: @spacing-lg;
  }
  
  h3 {
    color: @gray-600;
    margin: 0 0 @spacing-sm 0;
    font-weight: 600;
    font-size: @font-size-lg;
  }
  
  p {
    color: @gray-500;
    margin: 0 0 @spacing-xl 0;
    font-size: @font-size-sm;
    font-weight: 400;
  }
  
  .el-button {
    font-weight: 600;
  }
}

// 下拉菜单样式
:deep(.danger-item) {
  color: @red-500 !important;
  
  &:hover {
    background-color: @red-50 !important;
    color: @red-600 !important;
  }
  
  .el-icon {
    color: @red-500 !important;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .category-management {
    padding: @spacing-lg;
  }
  
  .management-header {
    flex-direction: column;
    gap: @spacing-lg;
    text-align: center;
    
    .header-title {
      flex-direction: column;
      gap: @spacing-sm;
    }
  }
  
  .category-grid {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
  
  .category-card {
    .card-content {
      padding: @spacing-lg;
      
      .category-stats {
        flex-direction: column;
        gap: @spacing-sm;
        align-items: flex-start;
      }
    }
  }
}
</style>