<template>
  <div class="admin">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1>管理后台</h1>
      </div>
      <div class="header-right">
        <span class="welcome">欢迎，{{ userStore.adminInfo?.name }}</span>
        <el-button type="danger" size="small" @click="logout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </header>

    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <el-menu
          :default-active="$route.name"
          class="sidebar-menu"
          router
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
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import {
  Picture,
  User,
  Menu,
  DataAnalysis,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/admin/login')
}
</script>

<style lang="less" scoped>
@import '../style.less';

.admin {
  min-height: 100vh;
  background-color: @bg-color-light;
  
  // 顶部导航
  .admin-header {
    background: @white;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 @spacing-xl;
    box-shadow: @shadow-md;
    
    .header-left {
      h1 {
        color: @gray-800;
        font-size: @font-size-xl;
        font-weight: 600;
        margin: 0;
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: @spacing-lg;
      
      .welcome {
        color: @gray-600;
        font-size: @font-size-sm;
      }
    }
  }
  
  // 内容区域
  .admin-content {
    display: flex;
    min-height: calc(100vh - 60px);
    
    // 侧边栏
    .sidebar {
      width: 200px;
      background: @white;
      box-shadow: @shadow-md;
      
      .sidebar-menu {
        border-right: none;
      }
    }
    
    // 主要内容
    .main-content {
      flex: 1;
      padding: @spacing-xl;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .admin {
    .admin-content {
      flex-direction: column;
      
      .sidebar {
        width: 100%;
        height: auto;
        
        .sidebar-menu {
          display: flex;
          overflow-x: auto;
        }
      }
    }
  }
}
</style>