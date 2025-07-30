<template>
  <div class="dashboard">
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
          <h3>{{ categoryStore.categories.length }}</h3>
          <p>分类数量</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useImageStore } from '../../stores'
import {
  Picture,
  View,
  Star,
  Menu
} from '@element-plus/icons-vue'

const imageStore = useImageStore()

// 计算属性
const totalViews = computed(() => {
  return imageStore.images.reduce((sum, img) => sum + img.views, 0)
})

const totalLikes = computed(() => {
  return imageStore.images.reduce((sum, img) => sum + img.likes, 0)
})

// 模拟分类store
const categoryStore = {
  categories: []
}
</script>

<style lang="less" scoped>
@import '../../style.less';

.dashboard {
  padding: @spacing-xl;
  background: @bg-color;
  min-height: 100vh;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: @spacing-xl;
  margin-bottom: @spacing-2xl;
}

.stat-card {
  background: @white;
  padding: @spacing-xl;
  border-radius: @border-radius-xl;
  box-shadow: @shadow-lg;
  display: flex;
  align-items: center;
  gap: @spacing-lg;
  transition: all 0.3s ease;
  border: 1px solid @gray-200;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: @shadow-2xl;
    border-color: @primary-color;
    
    .stat-icon {
      transform: scale(1.1);
    }
  }
}

.stat-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  border-radius: @border-radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @white;
  font-size: @font-size-xl;
  transition: all 0.3s ease;
  box-shadow: @shadow-md;
  
  .el-icon {
    font-size: @font-size-2xl;
  }
}

.stat-info {
  flex: 1;
  
  h3 {
    font-size: @font-size-3xl;
    font-weight: 700;
    color: @gray-800;
    margin: 0 0 @spacing-xs 0;
    font-family: @font-family;
    background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: @gray-600;
    margin: 0;
    font-size: @font-size-sm;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard {
    padding: @spacing-lg;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
  
  .stat-card {
    padding: @spacing-lg;
    
    .stat-icon {
      width: 56px;
      height: 56px;
      font-size: @font-size-lg;
    }
    
    .stat-info {
      h3 {
        font-size: @font-size-2xl;
      }
    }
  }
}
</style>