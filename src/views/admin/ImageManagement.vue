<template>
  <div class="image-management">
    <div class="management-header">
      <h2>图片管理</h2>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        添加图片
      </el-button>
    </div>
    
    <div class="data-notice" v-if="categoryList.length === 0">
      <el-alert
        title="提示"
        description="添加图片前，请先在分类管理中创建至少一个分类。"
        type="warning"
        :closable="false"
        show-icon
      />
    </div>

    <div class="image-table">
      <el-table :data="imageStore.images" style="width: 100%" v-loading="imageStore.loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="description" label="描述" width="300" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="views" label="观看数" width="100" />
        <el-table-column prop="likes" label="点赞数" width="100" />
        <el-table-column label="缩略图" width="120">
          <template #default="scope">
            <img :src="scope.row.thumbnail" alt="缩略图" class="thumbnail" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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

    <!-- 添加/编辑图片对话框 -->
    <el-dialog
      :title="editingImage ? '编辑图片' : '添加图片'"
      v-model="showAddDialog"
      width="600px"
      @close="resetImageForm"
    >
      <el-form :model="imageForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="imageForm.title" placeholder="请输入图片标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="imageForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入图片描述"
          />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="imageForm.category" placeholder="请选择分类">
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
          <div v-if="categoryList.length === 0" style="color: #999; font-size: 12px; margin-top: 5px;">
            暂无分类数据，请先在分类管理中添加分类
          </div>
          <div v-else style="color: #666; font-size: 12px; margin-top: 5px;">
            共 {{ categoryList.length }} 个分类可选
          </div>
        </el-form-item>
        <el-form-item label="图片">
          <div class="upload-section">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              @change="handleFileChange"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                选择文件
              </el-button>
            </el-upload>
            <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
          </div>
          <div class="url-input">
            <el-input
              v-model="imageForm.thumbnail"
              placeholder="或输入图片URL"
              style="margin-top: 10px"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveImage">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useImageStore } from '../../stores'
import { categoryAPI } from '../../api'
import {
  Plus,
  Upload
} from '@element-plus/icons-vue'

const imageStore = useImageStore()

const showAddDialog = ref(false)
const editingImage = ref(null)
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

// 获取分类列表
const fetchCategories = async () => {
  try {
    console.log('开始获取分类列表...')
    const response = await categoryAPI.getCategories()
    console.log('分类列表响应:', response)
    categoryList.value = response
    console.log('分类列表已设置:', categoryList.value)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败，请检查网络连接')
  }
}

// 打开添加对话框
const openAddDialog = async () => {
  await fetchCategories() // 确保分类数据是最新的
  showAddDialog.value = true
}

// 处理文件选择
const handleFileChange = (file) => {
  selectedFile.value = file.raw
}

// 重置表单
const resetImageForm = () => {
  Object.assign(imageForm, {
    title: '',
    description: '',
    category: '',
    thumbnail: ''
  })
  selectedFile.value = null
  editingImage.value = null
}

// 编辑图片
const editImage = async (image) => {
  await fetchCategories() // 确保分类数据是最新的
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

    resetImageForm()
    showAddDialog.value = false
  } catch (error) {
    // 错误处理已在API层统一处理
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
      // 错误处理已在API层统一处理
    }
  })
}

onMounted(() => {
  fetchCategories()
  imageStore.fetchImages()
})
</script>

<style lang="less" scoped>
@import '../../style.less';

.image-management {
  padding: @spacing-xl;
  background: @bg-color;
  min-height: 100vh;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-xl;
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
  
  h2 {
    margin: 0;
    color: @white;
    font-weight: 700;
    font-size: @font-size-2xl;
    position: relative;
    z-index: 1;
  }
  
  .el-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: @white;
    font-weight: 600;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    
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
    background: linear-gradient(135deg, @orange-50 0%, @orange-100 100%);
    border-left: 4px solid @orange-400;
  }
}

.image-table {
  background: @white;
  border-radius: @border-radius-xl;
  padding: @spacing-xl;
  box-shadow: @shadow-lg;
  border: 1px solid @gray-200;
  
  .thumbnail {
    width: 64px;
    height: 44px;
    object-fit: cover;
    border-radius: @border-radius-md;
    border: 2px solid @gray-200;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      border-color: @primary-color;
      box-shadow: @shadow-md;
    }
  }
  
  :deep(.el-table) {
    .el-table__header {
      th {
        background: @gray-50;
        color: @gray-700;
        font-weight: 600;
        border-bottom: 2px solid @gray-200;
      }
    }
    
    .el-table__row {
      &:hover {
        background: fade(@primary-color, 5%);
      }
      
      td {
        border-bottom: 1px solid @gray-100;
        color: @gray-700;
      }
    }
    
    .el-button {
      font-weight: 500;
      border-radius: @border-radius-md;
      transition: all 0.3s ease;
      
      &--small {
        padding: @spacing-xs @spacing-sm;
      }
      
      &:not(.el-button--danger):hover {
        background: @primary-color;
        border-color: @primary-color;
        color: @white;
      }
      
      &--danger:hover {
        background: @red-500;
        border-color: @red-500;
      }
    }
  }
}

.upload-section {
  display: flex;
  align-items: center;
  gap: @spacing-sm;
  
  .el-button {
    font-weight: 600;
  }
  
  .file-name {
    color: @gray-600;
    font-size: @font-size-sm;
    font-weight: 500;
    padding: @spacing-xs @spacing-sm;
    background: @gray-100;
    border-radius: @border-radius-md;
    border: 1px solid @gray-200;
  }
}

.url-input {
  margin-top: @spacing-sm;
  
  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: @border-radius-lg;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: @gray-400;
      }
      
      &.is-focus {
        border-color: @primary-color;
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
      }
    }
  }
}

// 对话框样式优化
:deep(.el-dialog) {
  border-radius: @border-radius-xl;
  
  .el-dialog__header {
    background: linear-gradient(135deg, @gray-50 0%, @gray-100 100%);
    border-radius: @border-radius-xl @border-radius-xl 0 0;
    padding: @spacing-lg @spacing-xl;
    border-bottom: 1px solid @gray-200;
    
    .el-dialog__title {
      color: @gray-800;
      font-weight: 700;
      font-size: @font-size-lg;
    }
  }
  
  .el-dialog__body {
    padding: @spacing-xl;
  }
  
  .el-dialog__footer {
    padding: @spacing-lg @spacing-xl;
    background: @gray-50;
    border-radius: 0 0 @border-radius-xl @border-radius-xl;
    border-top: 1px solid @gray-200;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .image-management {
    padding: @spacing-lg;
  }
  
  .management-header {
    flex-direction: column;
    gap: @spacing-lg;
    text-align: center;
  }
  
  .image-table {
    padding: @spacing-lg;
    overflow-x: auto;
  }
  
  .upload-section {
    flex-direction: column;
    align-items: flex-start;
    gap: @spacing-sm;
  }
}
</style>