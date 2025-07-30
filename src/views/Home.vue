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
          <el-button v-show="isScrolled" class="menu-toggle" type="text" @click="toggleSideMenu">
            <el-icon>
              <Menu />
            </el-icon>
          </el-button>
        </div>
        <div class="nav-right">
          <el-input v-model="searchText" placeholder="搜索" class="search-input" @keyup.enter="handleSearch">
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
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>
      <nav class="side-nav">
        <a href="#" class="side-nav-item active">
          <el-icon>
            <House />
          </el-icon>
          <span>首页</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <VideoPlay />
          </el-icon>
          <span>番剧</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <Monitor />
          </el-icon>
          <span>直播</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <Cpu />
          </el-icon>
          <span>游戏中心</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <ShoppingCart />
          </el-icon>
          <span>会员购</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <Document />
          </el-icon>
          <span>漫画</span>
        </a>
        <a href="#" class="side-nav-item">
          <el-icon>
            <Trophy />
          </el-icon>
          <span>赛事</span>
        </a>
      </nav>
    </div>

    <!-- 遮罩层 -->
    <div v-show="showSideMenu" class="side-menu-overlay" @click="toggleSideMenu"></div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="container">
        <div class="category-list">
          <span v-for="category in categories" :key="category"
            :class="['category-item', { active: selectedCategory === category }]" @click="selectCategory(category)">
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
          <el-alert :title="imageStore.error" type="error" show-icon :closable="false" />
        </div>

        <!-- 视频网格 -->
        <div v-else class="video-grid">
          <div v-for="image in filteredImages" :key="image.id" class="video-card" @click="playVideo(image)">
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
                    <el-icon>
                      <View />
                    </el-icon>
                    {{ formatNumber(image.views) }}
                  </span>
                  <span class="likes" @click.stop="incrementLikes(image.id)">
                    <el-icon>
                      <Star />
                    </el-icon>
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

<style lang="less" scoped>
@import '../style.less';

.home {
  min-height: 100vh;
  background: linear-gradient(135deg, @bg-color-light 0%, @bg-color 100%);
  font-family: @font-family;

  // 头部导航
  .header {
    background: @white;
    box-shadow: @shadow-md;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all @transition-duration;

    &-scrolled {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: @shadow-xl;
    }

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 @spacing-lg;
    }
  }

  .nav-left {
    display: flex;
    align-items: center;
    position: relative;

    .logo {
      h1 {
        color: @primary-color;
        font-size: @font-size-2xl;
        font-weight: @font-weight-bold;
        margin-right: @spacing-2xl;
        background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .nav-menu {
      display: flex;
      gap: @spacing-xl;
      transition: all @transition-duration;
      opacity: 1;
      transform: translateX(0);

      &-hidden {
        opacity: 0;
        transform: translateX(-20px);
        pointer-events: none;
      }
    }

    // 菜单切换按钮
    .menu-toggle {
      margin-left: @spacing-lg;
      font-size: @font-size-xl;
      color: @text-color-secondary;
      transition: all @transition-duration;
      cursor: pointer;

      &:hover {
        color: @primary-color;
        transform: scale(1.1);
      }
    }
  }

  .nav-item {
    color: @text-color-regular;
    text-decoration: none;
    font-size: @font-size-base;
    font-weight: @font-weight-medium;
    padding: @spacing-sm 0;
    border-bottom: 2px solid transparent;
    transition: all @transition-duration;
    position: relative;

    &:hover,
    &.active {
      color: @primary-color;
      border-bottom-color: @primary-color;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
      transition: all @transition-duration;
      transform: translateX(-50%);
    }

    &:hover::after,
    &.active::after {
      width: 100%;
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: @spacing-lg;

    .search-input {
      width: 300px;

      .el-input__wrapper {
        border-radius: @border-radius-lg;
        box-shadow: @shadow-sm;
        transition: all @transition-duration;

        &:hover {
          box-shadow: @shadow-md;
        }

        &.is-focus {
          box-shadow: 0 0 0 2px fade(@primary-color, 20%);
        }
      }
    }

    .search-icon {
      cursor: pointer;
      color: @text-color-placeholder;
      transition: color @transition-duration;

      &:hover {
        color: @primary-color;
      }
    }

    .admin-link {
      text-decoration: none;

      .el-button {
        border-radius: @border-radius-lg;
        font-weight: @font-weight-medium;
        transition: all @transition-duration;

        &:hover {
          transform: translateY(-1px);
          box-shadow: @shadow-lg;
        }
      }
    }
  }

  // 分类导航
  .category-nav {
    background: @white;
    border-bottom: 1px solid @border-color;
    padding: @spacing-md 0;
    box-shadow: @shadow-sm;

    .container {
      padding: 0 @spacing-lg;
    }

    .category-list {
      display: flex;
      gap: @spacing-xl;
      overflow-x: auto;
      padding-bottom: @spacing-xs;

      &::-webkit-scrollbar {
        height: 4px;
      }

      .category-item {
        color: @text-color-secondary;
        cursor: pointer;
        padding: @spacing-sm @spacing-md;
        border-radius: @border-radius-xl;
        transition: all @transition-duration;
        font-size: @font-size-sm;
        font-weight: @font-weight-medium;
        white-space: nowrap;
        position: relative;

        &:hover {
          background: linear-gradient(135deg, fade(@primary-color, 10%) 0%, fade(@primary-light, 15%) 100%);
          color: @primary-color;
          transform: translateY(-1px);
        }

        &.active {
          background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
          color: @white;
          box-shadow: @shadow-md;
        }
      }
    }
  }

  // 主要内容
  .main-content {
    padding: @spacing-xl 0;

    .container {
      padding: 0 @spacing-lg;
    }
  }

  // 轮播图
  .banner-section {
    margin-bottom: @spacing-2xl;

    .el-carousel {
      border-radius: @border-radius-xl;
      overflow: hidden;
      box-shadow: @shadow-lg;
    }

    .banner-item {
      width: 100%;
      height: 240px;
      border-radius: @border-radius-xl;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .banner-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      color: @white;
      padding: @spacing-xl;
      text-align: center;

      h3 {
        margin: 0 0 @spacing-sm 0;
        font-size: @font-size-xl;
        font-weight: @font-weight-bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      p {
        margin: 0;
        font-size: @font-size-sm;
        opacity: 0.9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }

  // 视频网格
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: @spacing-xl;
  }

  .video-card {
    background: @white;
    border-radius: @border-radius-xl;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: @shadow-md;
    border: 1px solid @gray-100;

    &:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: @shadow-xl;
      border-color: fade(@primary-color, 20%);

      .video-thumbnail img {
        transform: scale(1.08);
      }

      .video-overlay {
        opacity: 1;
      }
    }
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: @gray-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .video-duration {
    position: absolute;
    bottom: @spacing-sm;
    right: @spacing-sm;
    background: rgba(0, 0, 0, 0.8);
    color: @white;
    padding: @spacing-xs @spacing-sm;
    border-radius: @border-radius-sm;
    font-size: @font-size-xs;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }

  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 180, 216, 0.3) 0%, rgba(0, 119, 182, 0.4) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;
    backdrop-filter: blur(2px);
  }

  .play-icon {
    font-size: 56px;
    color: @white;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .video-info {
    padding: @spacing-md;
  }

  .video-title {
    font-size: @font-size-sm;
    font-weight: 600;
    color: @gray-800;
    margin-bottom: @spacing-sm;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s ease;

    &:hover {
      color: @primary-color;
    }
  }

  .video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @spacing-xs;
  }

  .author {
    color: @gray-600;
    font-size: @font-size-xs;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: @primary-color;
    }
  }

  .stats {
    display: flex;
    gap: @spacing-md;
    font-size: @font-size-xs;
    color: @gray-500;

    span {
      display: flex;
      align-items: center;
      gap: @spacing-xs;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: @spacing-xs;
      border-radius: @border-radius-sm;

      &:hover {
        color: @primary-color;
        background: fade(@primary-color, 10%);
        transform: translateY(-1px);
      }
    }
  }

  .upload-time {
    color: @gray-500;
    font-size: @font-size-xs;
    font-weight: 400;
  }

  // 右侧竖向菜单
  .side-menu {
    position: fixed;
    top: 0;
    right: -340px;
    width: 340px;
    height: 100vh;
    background: @white;
    box-shadow: -4px 0 32px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    backdrop-filter: blur(10px);

    &-open {
      right: 0;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @spacing-xl;
      border-bottom: 1px solid @gray-200;
      background: linear-gradient(135deg, @gray-50 0%, @gray-100 100%);

      h3 {
        color: @gray-800;
        font-size: @font-size-lg;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .el-icon {
        font-size: @font-size-xl;
        color: @gray-600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: @primary-color;
          transform: scale(1.1);
        }
      }
    }

    &-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
    }
  }

  .side-nav {
    padding: @spacing-xl 0;

    &-item {
      display: flex;
      align-items: center;
      gap: @spacing-md;
      padding: @spacing-md @spacing-xl;
      color: @gray-700;
      text-decoration: none;
      font-size: @font-size-base;
      font-weight: 500;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
        transition: width 0.3s ease;
      }

      &:hover {
        background: linear-gradient(135deg, fade(@primary-color, 8%) 0%, fade(@primary-light, 12%) 100%);
        color: @primary-color;
        transform: translateX(4px);

        &::before {
          width: 3px;
        }
      }

      &.active {
        background: linear-gradient(135deg, fade(@primary-color, 15%) 0%, fade(@primary-light, 20%) 100%);
        color: @primary-color;
        font-weight: 600;

        &::before {
          width: 3px;
        }
      }

      .el-icon {
        font-size: @font-size-lg;
        transition: transform 0.3s ease;
      }

      &:hover .el-icon {
        transform: scale(1.1);
      }
    }
  }

  // 加载和错误状态
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background: @white;
    border-radius: @border-radius-xl;
    margin-bottom: @spacing-xl;
    color: @gray-600;
    font-size: @font-size-lg;
    box-shadow: @shadow-sm;

    .el-loading-spinner {
      .path {
        stroke: @primary-color;
      }
    }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background: @white;
    border-radius: @border-radius-xl;
    margin-bottom: @spacing-xl;
    padding: @spacing-xl;
    text-align: center;
    box-shadow: @shadow-sm;

    .el-icon {
      font-size: 48px;
      margin-bottom: @spacing-lg;
      color: @error-color;
    }

    h3 {
      font-size: @font-size-lg;
      margin-bottom: @spacing-md;
      color: @gray-800;
    }

    p {
      color: @gray-600;
      font-size: @font-size-base;
      margin-bottom: @spacing-lg;
    }

    .el-button {
      background: @primary-color;
      border-color: @primary-color;

      &:hover {
        background: @primary-dark;
        border-color: @primary-dark;
      }
    }
  }

  /* 交互效果 */
  .stats span {
    cursor: pointer;
    transition: color 0.3s;
  }

  .stats span:hover {
    color: #00a1d6;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .home {
    .header {
      padding: 0 @spacing-md;

      .container {
        padding: 0;
      }
    }

    .nav-menu {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .search-input {
      width: 180px;
      font-size: @font-size-sm;
    }

    .category-nav {
      padding: 0 @spacing-md;

      .category-list {
        gap: @spacing-md;
        overflow-x: auto;
        padding-bottom: @spacing-xs;

        .category-item {
          font-size: @font-size-sm;
          padding: @spacing-sm @spacing-md;
        }
      }
    }

    .main-content {
      padding: @spacing-lg @spacing-md;
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: @spacing-md;
    }

    .side-menu {
      width: 100vw;
      right: -100vw;

      &-header {
        padding: @spacing-lg @spacing-md;

        h3 {
          font-size: @font-size-base;
        }
      }

      .side-nav {
        padding: @spacing-lg 0;

        &-item {
          padding: @spacing-md;
          font-size: @font-size-sm;

          .el-icon {
            font-size: @font-size-base;
          }
        }
      }
    }

    .banner-section {
      margin-bottom: @spacing-lg;

      .banner-item {
        height: 200px;

        .banner-content {
          h3 {
            font-size: @font-size-lg;
          }

          p {
            font-size: @font-size-sm;
          }
        }
      }
    }
  }
}
</style>