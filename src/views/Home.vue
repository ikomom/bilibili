<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <header :class="['header', { 'header-scrolled': isScrolled }]">
      <div class="container">
        <div class="nav-left">
          <div class="logo">
            <h1>哔哩哔哩</h1>
          </div>
          <nav :class="['nav-menu', { 'nav-menu-hidden': isScrolled }]">
            <a href="#" class="nav-item active">首页</a>
            <a href="#" class="nav-item">番剧</a>
            <a href="#" class="nav-item">直播</a>
            <a href="#" class="nav-item">游戏中心</a>
            <a href="#" class="nav-item">会员购</a>
            <a href="#" class="nav-item">漫画</a>
            <a href="#" class="nav-item">赛事</a>
          </nav>
          <!-- 菜单按钮 -->
          <el-button 
            v-show="isScrolled" 
            class="menu-toggle" 
            type="text" 
            @click="toggleSideMenu"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
        </div>
        <div class="nav-right">
          <el-input
            v-model="searchText"
            placeholder="搜索"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon class="search-icon" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
          <router-link :to="adminLinkPath" class="admin-link">
            <el-button type="primary" size="small">管理后台</el-button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 右侧竖向菜单 -->
    <div :class="['side-menu', { 'side-menu-open': showSideMenu }]">
      <div class="side-menu-header">
        <h3>导航菜单</h3>
        <el-button type="text" @click="toggleSideMenu">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <nav class="side-nav">
        <a href="#" class="side-nav-item active">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><VideoPlay /></el-icon>
          <span>番剧</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><Monitor /></el-icon>
          <span>直播</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><Cpu /></el-icon>
          <span>游戏中心</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><ShoppingCart /></el-icon>
          <span>会员购</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><Document /></el-icon>
          <span>漫画</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon><Trophy /></el-icon>
          <span>赛事</span>
        </a>
      </nav>
    </div>

    <!-- 遮罩层 -->
    <div 
      v-show="showSideMenu" 
      class="side-menu-overlay" 
      @click="toggleSideMenu"
    ></div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="container">
        <div class="category-list">
          <span
            v-for="category in categories"
            :key="category"
            :class="['category-item', { active: selectedCategory === category }]"
            @click="selectCategory(category)"
          >
            {{ category }}
          </span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <!-- 轮播图区域 -->
        <div class="banner-section">
          <el-carousel height="200px" indicator-position="outside">
            <el-carousel-item v-for="(banner, index) in banners" :key="banner.id || index">
              <div class="banner-item">
                <img :src="banner.imageUrl" :alt="banner.title" />
                <div class="banner-content">
                  <h3>{{ banner.title }}</h3>
                  <p>{{ banner.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>

        <!-- 加载状态 -->
        <div v-if="imageStore.loading" class="loading-container" v-loading="true" element-loading-text="加载中...">
        </div>

        <!-- 错误状态 -->
        <div v-else-if="imageStore.error" class="error-container">
          <el-alert
            :title="imageStore.error"
            type="error"
            show-icon
            :closable="false"
          />
        </div>

        <!-- 视频网格 -->
        <div v-else class="video-grid">
          <div
            v-for="image in filteredImages"
            :key="image.id"
            class="video-card"
            @click="playVideo(image)"
          >
            <div class="video-thumbnail">
              <img :src="getImageUrl(image)" :alt="image.title" />
              <div class="video-duration">{{ image.duration || '00:00' }}</div>
              <div class="video-overlay">
                <el-icon class="play-icon">
                  <VideoPlay />
                </el-icon>
              </div>
            </div>
            <div class="video-info">
              <h3 class="video-title">{{ image.title }}</h3>
              <div class="video-meta">
                <span class="author">{{ image.author || '未知作者' }}</span>
                <div class="stats">
                  <span class="views" @click.stop="incrementViews(image.id)">
                    <el-icon><View /></el-icon>
                    {{ formatNumber(image.views) }}
                  </span>
                  <span class="likes" @click.stop="incrementLikes(image.id)">
                    <el-icon><Star /></el-icon>
                    {{ formatNumber(image.likes) }}
                  </span>
                </div>
              </div>
              <div class="upload-time">{{ formatDate(image.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStore, useUserStore, useBannerStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  VideoPlay, 
  View, 
  Star, 
  Menu, 
  Close, 
  House, 
  Monitor, 
  Cpu, 
  ShoppingCart, 
  Document, 
  Trophy 
} from '@element-plus/icons-vue'

const router = useRouter()
const imageStore = useImageStore()
const userStore = useUserStore()
const bannerStore = useBannerStore()
const searchText = ref('')
const isScrolled = ref(false)
const showSideMenu = ref(false)

// 管理后台链接路径
const adminLinkPath = computed(() => {
  return userStore.isAdmin ? '/admin' : '/admin/login'
})

// 从store获取响应式数据
const categories = computed(() => imageStore.categories)
const selectedCategory = computed(() => imageStore.selectedCategory)
const filteredImages = computed(() => imageStore.filteredImages)
const banners = computed(() => bannerStore.banners)

// 选择分类
const selectCategory = (category) => {
  imageStore.setSelectedCategory(category)
}

// 搜索功能
const handleSearch = () => {
  if (searchText.value.trim()) {
    ElMessage.info(`搜索: ${searchText.value}`)
  }
}

// 播放视频
const playVideo = (video) => {
  // 跳转到视频详情页面
  router.push(`/video/${video.id}`)
}

// 增加观看次数
const incrementViews = async (id) => {
  try {
    await imageStore.incrementViews(id)
  } catch (error) {
    console.error('增加观看次数失败:', error)
  }
}

// 增加点赞数
const incrementLikes = async (id) => {
  try {
    await imageStore.incrementLikes(id)
    ElMessage.success('点赞成功！')
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}

// 获取图片URL
const getImageUrl = (image) => {
  if (image.thumbnail) {
    // 如果是相对路径，添加后端服务器地址
    if (image.thumbnail.startsWith('/uploads/')) {
      return `http://localhost:3001${image.thumbnail}`
    }
    return image.thumbnail
  }
  // 默认占位图
  return `https://picsum.photos/400/300?random=${image.id}`
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 滚动监听
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isScrolled.value = scrollTop > 100
}

// 切换侧边菜单
const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value
}

// 生命周期
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // 检查用户认证状态
  userStore.checkAuth()
  // 加载数据
  await imageStore.fetchCategories()
  await imageStore.fetchImages()
  await bannerStore.fetchBanners()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f4f5f7;
}

/* 头部导航 */
.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-left {
  display: flex;
  align-items: center;
  position: relative;
}

.logo h1 {
  color: #00a1d6;
  font-size: 24px;
  font-weight: bold;
  margin-right: 40px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateX(0);
}

.nav-menu-hidden {
  opacity: 0;
  transform: translateX(-20px);
  pointer-events: none;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.active {
  color: #00a1d6;
  border-bottom-color: #00a1d6;
}

/* 菜单切换按钮 */
.menu-toggle {
  margin-left: 20px;
  font-size: 20px;
  color: #333;
  transition: all 0.3s;
}

.menu-toggle:hover {
  color: #00a1d6;
  transform: scale(1.1);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.search-icon {
  cursor: pointer;
  color: #999;
}

.search-icon:hover {
  color: #00a1d6;
}

.admin-link {
  text-decoration: none;
}

/* 分类导航 */
.category-nav {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 0;
}

.category-list {
  display: flex;
  gap: 30px;
}

.category-item {
  color: #666;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
  font-size: 14px;
}

.category-item:hover {
  background-color: #f0f0f0;
  color: #333;
}

.category-item.active {
  background-color: #00a1d6;
  color: #fff;
}

/* 主要内容 */
.main-content {
  padding: 20px 0;
}

/* 轮播图 */
.banner-section {
  margin-bottom: 30px;
}

.banner-item {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
  text-align: center;
}

.banner-overlay h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: bold;
}

.banner-overlay p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.video-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 48px;
  color: #fff;
}

.video-info {
  padding: 12px;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.author {
  color: #666;
  font-size: 12px;
}

.stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 2px;
}

.upload-time {
  color: #999;
  font-size: 12px;
}

/* 右侧竖向菜单 */
.side-menu {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
}

.side-menu-open {
  right: 0;
}

.side-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.side-menu-header h3 {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.side-nav {
  padding: 20px 0;
}

.side-nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.side-nav-item:hover {
  background: #f0f8ff;
  color: #00a1d6;
  border-left-color: #00a1d6;
}

.side-nav-item.active {
  background: #e6f7ff;
  color: #00a1d6;
  border-left-color: #00a1d6;
  font-weight: 500;
}

.side-nav-item .el-icon {
  font-size: 18px;
}

/* 遮罩层 */
.side-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 加载和错误状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-container {
  margin-bottom: 20px;
}

/* 交互效果 */
.stats span {
  cursor: pointer;
  transition: color 0.3s;
}

.stats span:hover {
  color: #00a1d6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .search-input {
    width: 200px;
  }
  
  .category-list {
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 15px;
  }
  
  .side-menu {
    width: 280px;
    right: -280px;
  }
  
  .menu-toggle {
    display: block;
  }
}
</style>