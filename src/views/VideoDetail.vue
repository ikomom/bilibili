<template>
  <div class="video-detail">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="nav-left">
          <el-button type="text" @click="goBack" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="logo">
            <h1>哔哩哔哩</h1>
          </div>
        </div>
        <div class="nav-right">
          <router-link :to="adminLinkPath" class="admin-link">
            <el-button type="primary" size="small">管理后台</el-button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <div class="video-layout">
          <!-- 左侧视频区域 -->
          <div class="video-section">
            <!-- 视频播放器 -->
            <div class="video-player">
              <img :src="getImageUrl(videoData)" :alt="videoData.title" class="video-image" />
              <div class="play-overlay" @click="playVideo">
                <el-icon class="play-icon"><VideoPlay /></el-icon>
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="video-info">
              <h1 class="video-title">{{ videoData.title }}</h1>
              <div class="video-meta">
                <div class="meta-left">
                  <span class="author">{{ videoData.author || '未知作者' }}</span>
                  <span class="upload-time">{{ formatDate(videoData.createdAt) }}</span>
                </div>
                <div class="meta-right">
                  <div class="stats">
                    <span class="views" @click="incrementViews">
                      <el-icon><View /></el-icon>
                      {{ formatNumber(videoData.views) }}
                    </span>
                    <span class="likes" @click="incrementLikes">
                      <el-icon><Star /></el-icon>
                      {{ formatNumber(videoData.likes) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="video-description">
                <p>{{ videoData.description || '暂无描述' }}</p>
              </div>
            </div>

            <!-- 评论区 -->
            <div class="comment-section">
              <div class="comment-header">
                <h3>评论 ({{ comments.length }})</h3>
                <div class="demo-notice">
                  <el-alert
                    title="演示说明"
                    description="以下评论为演示数据，非真实用户评论。在实际应用中，这里会显示真实的用户评论。"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
              </div>
              
              <!-- 发表评论 -->
              <div class="comment-form">
                <el-input
                  v-model="newComment"
                  type="textarea"
                  :rows="3"
                  placeholder="发表你的看法..."
                  class="comment-input"
                />
                <div class="comment-actions">
                  <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
                    发表评论
                  </el-button>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">
                    <el-avatar :size="40">{{ comment.author.charAt(0) }}</el-avatar>
                  </div>
                  <div class="comment-content">
                    <div class="comment-author">{{ comment.author }}</div>
                    <div class="comment-text">{{ comment.content }}</div>
                    <div class="comment-meta">
                      <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                      <span class="comment-like" @click="likeComment(comment.id)">
                        <el-icon><Star /></el-icon>
                        {{ comment.likes || 0 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧推荐区域 -->
          <div class="recommend-section">
            <h3>相关推荐</h3>
            <div class="recommend-list">
              <div
                v-for="item in recommendedVideos"
                :key="item.id"
                class="recommend-item"
                @click="goToVideo(item.id)"
              >
                <div class="recommend-thumbnail">
                  <img :src="getImageUrl(item)" :alt="item.title" />
                </div>
                <div class="recommend-info">
                  <h4 class="recommend-title">{{ item.title }}</h4>
                  <div class="recommend-meta">
                    <span class="recommend-author">{{ item.author || '未知作者' }}</span>
                    <span class="recommend-views">{{ formatNumber(item.views) }}次观看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImageStore, useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  VideoPlay,
  View,
  Star
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const imageStore = useImageStore()
const userStore = useUserStore()

const videoData = ref({})
const comments = ref([])
const newComment = ref('')
const recommendedVideos = ref([])

// 管理后台链接路径
const adminLinkPath = computed(() => {
  return userStore.isAdmin ? '/admin' : '/admin/login'
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 跳转到其他视频
const goToVideo = (id) => {
  router.push(`/video/${id}`)
}

// 获取图片URL
const getImageUrl = (image) => {
  if (image.thumbnail) {
    if (image.thumbnail.startsWith('/uploads/')) {
      return `http://localhost:3001${image.thumbnail}`
    }
    return image.thumbnail
  }
  return `https://via.placeholder.com/800x450/667eea/ffffff?text=${encodeURIComponent(image.title || '视频')}`
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return Number(num).toString()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 播放视频
const playVideo = () => {
  ElMessage.success('开始播放视频')
}

// 增加观看次数
const incrementViews = async () => {
  try {
    await imageStore.incrementViews(videoData.value.id)
    videoData.value.views++
  } catch (error) {
    console.error('增加观看次数失败:', error)
  }
}

// 增加点赞数
const incrementLikes = async () => {
  try {
    await imageStore.incrementLikes(videoData.value.id)
    videoData.value.likes++
    ElMessage.success('点赞成功！')
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}

// 发表评论
const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now(),
    author: '游客' + Math.floor(Math.random() * 1000),
    content: newComment.value,
    createdAt: new Date().toISOString(),
    likes: 0
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
  ElMessage.success('评论发表成功！')
}

// 点赞评论
const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likes = (comment.likes || 0) + 1
    ElMessage.success('点赞成功！')
  }
}

// 初始化数据
const initData = async () => {
  const videoId = parseInt(route.params.id)
  
  // 获取视频数据
  await imageStore.fetchImages()
  const video = imageStore.images.find(img => img.id === videoId)
  
  if (video) {
    videoData.value = { ...video }
    // 自动增加观看次数
    incrementViews()
  } else {
    ElMessage.error('视频不存在')
    router.push('/')
    return
  }
  
  // 获取推荐视频（排除当前视频）
  recommendedVideos.value = imageStore.images
    .filter(img => img.id !== videoId)
    .slice(0, 10)
  
  // 演示评论数据（注：这是演示数据，非真实用户评论）
  comments.value = [
    {
      id: 1,
      author: '演示用户001',
      content: '这个内容真不错！（演示评论）',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 5,
      isDemo: true
    },
    {
      id: 2,
      author: '演示用户002',
      content: '很有创意，学到了很多（演示评论）',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      likes: 3,
      isDemo: true
    },
    {
      id: 3,
      author: '演示用户003',
      content: '期待更多这样的内容（演示评论）',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      likes: 8,
      isDemo: true
    }
  ]
}

onMounted(() => {
  userStore.checkAuth()
  initData()
})
</script>

<style lang="less" scoped>
@import '../style.less';

.video-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, @gray-50 0%, @gray-100 100%);
}

// 头部导航
.header {
  background: @white;
  box-shadow: @shadow-md;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid @gray-200;
  
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 @spacing-xl;
  }
}

.nav-left {
  display: flex;
  align-items: center;
  gap: @spacing-lg;
}

.back-btn {
  font-size: @font-size-base;
  color: @gray-600;
  transition: all 0.3s ease;
  padding: @spacing-sm @spacing-md;
  border-radius: @border-radius-md;
  
  &:hover {
    color: @primary-color;
    background: fade(@primary-color, 10%);
    transform: translateX(-2px);
  }
  
  .el-icon {
    margin-right: @spacing-xs;
  }
}

.logo {
  h1 {
    color: @primary-color;
    font-size: @font-size-xl;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.admin-link {
  text-decoration: none;
  
  .el-button {
    background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
    border: none;
    box-shadow: @shadow-sm;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }
  }
}

// 主要内容
.main-content {
  padding: @spacing-xl 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 @spacing-xl;
  }
}

.video-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: @spacing-2xl;
}

// 视频区域
.video-section {
  background: @white;
  border-radius: @border-radius-xl;
  overflow: hidden;
  box-shadow: @shadow-lg;
  border: 1px solid @gray-200;
}

.video-player {
  position: relative;
  width: 100%;
  height: 480px;
  background: @gray-900;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    z-index: 1;
  }
}

.video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 88px;
  height: 88px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: fade(@primary-color, 90%);
    transform: translate(-50%, -50%) scale(1.15);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    
    ~ .video-image {
      transform: scale(1.05);
    }
  }
}

.play-icon {
  font-size: 36px;
  color: @white;
  margin-left: 4px;
  transition: transform 0.3s ease;
  
  .play-overlay:hover & {
    transform: scale(1.1);
  }
}

// 视频信息
.video-info {
  padding: @spacing-xl;
}

.video-title {
  font-size: @font-size-2xl;
  font-weight: 700;
  margin: 0 0 @spacing-lg 0;
  color: @gray-800;
  line-height: 1.4;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;
  padding-bottom: @spacing-lg;
  border-bottom: 1px solid @gray-200;
}

.meta-left {
  display: flex;
  gap: @spacing-lg;
  align-items: center;
}

.author {
  color: @primary-color;
  font-weight: 600;
  font-size: @font-size-base;
  transition: color 0.3s ease;
  
  &:hover {
    color: @primary-dark;
  }
}

.upload-time {
  color: @gray-500;
  font-size: @font-size-sm;
  font-weight: 400;
}

.stats {
  display: flex;
  gap: @spacing-xl;
}

.views, .likes {
  display: flex;
  align-items: center;
  gap: @spacing-xs;
  color: @gray-600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: @spacing-sm @spacing-md;
  border-radius: @border-radius-md;
  font-weight: 500;
  
  &:hover {
    color: @primary-color;
    background: fade(@primary-color, 10%);
    transform: translateY(-1px);
  }
  
  .el-icon {
    font-size: @font-size-lg;
  }
}

.video-description {
  color: @gray-700;
  line-height: 1.7;
  font-size: @font-size-base;
  
  p {
    margin: 0;
  }
}

// 评论区
.comment-section {
  padding: @spacing-xl;
  border-top: 1px solid @gray-200;
  background: @gray-50;
  
  .comment-header {
    margin-bottom: @spacing-xl;
    
    h3 {
      margin: 0 0 @spacing-lg 0;
      color: @gray-800;
      font-size: @font-size-xl;
      font-weight: 700;
    }
  }
}

.demo-notice {
  margin-bottom: @spacing-xl;
  
  .el-alert {
    border-radius: @border-radius-lg;
    border: 1px solid fade(@info-color, 30%);
    background: fade(@info-color, 5%);
  }
}

.comment-form {
  margin-bottom: @spacing-2xl;
  padding: @spacing-xl;
  background: @white;
  border-radius: @border-radius-lg;
  box-shadow: @shadow-sm;
  border: 1px solid @gray-200;
  
  .comment-input {
    margin-bottom: @spacing-md;
    
    :deep(.el-textarea__inner) {
      border-radius: @border-radius-md;
      border: 1px solid @gray-300;
      font-size: @font-size-base;
      line-height: 1.6;
      
      &:focus {
        border-color: @primary-color;
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
      }
    }
  }
  
  .comment-actions {
    text-align: right;
    
    .el-button {
      background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
      border: none;
      box-shadow: @shadow-sm;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: @shadow-md;
      }
      
      &:disabled {
        background: @gray-300;
        transform: none;
        box-shadow: none;
      }
    }
  }
}

.comment-list {
  .comment-item {
    display: flex;
    gap: @spacing-md;
    margin-bottom: @spacing-xl;
    padding: @spacing-lg;
    background: @white;
    border-radius: @border-radius-lg;
    box-shadow: @shadow-sm;
    border: 1px solid @gray-200;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: @shadow-md;
      transform: translateY(-2px);
    }
  }
}

.comment-content {
  flex: 1;
  
  .comment-author {
    font-weight: 600;
    color: @gray-800;
    margin-bottom: @spacing-xs;
    font-size: @font-size-base;
  }
  
  .comment-text {
    color: @gray-700;
    line-height: 1.6;
    margin-bottom: @spacing-sm;
    font-size: @font-size-base;
  }
  
  .comment-meta {
    display: flex;
    gap: @spacing-lg;
    align-items: center;
  }
  
  .comment-time {
    color: @gray-500;
    font-size: @font-size-xs;
    font-weight: 400;
  }
  
  .comment-like {
    display: flex;
    align-items: center;
    gap: @spacing-xs;
    color: @gray-500;
    cursor: pointer;
    font-size: @font-size-xs;
    transition: all 0.3s ease;
    padding: @spacing-xs @spacing-sm;
    border-radius: @border-radius-sm;
    
    &:hover {
      color: @primary-color;
      background: fade(@primary-color, 10%);
    }
  }
}

// 推荐区域
.recommend-section {
  background: @white;
  border-radius: @border-radius-xl;
  padding: @spacing-xl;
  height: fit-content;
  box-shadow: @shadow-lg;
  border: 1px solid @gray-200;
  position: sticky;
  top: 84px;
  
  h3 {
    margin: 0 0 @spacing-xl 0;
    color: @gray-800;
    font-size: @font-size-lg;
    font-weight: 700;
    padding-bottom: @spacing-md;
    border-bottom: 2px solid @gray-200;
  }
}

.recommend-item {
  display: flex;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;
  cursor: pointer;
  padding: @spacing-md;
  border-radius: @border-radius-lg;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: @gray-50;
    border-color: @gray-200;
    transform: translateY(-2px);
    box-shadow: @shadow-sm;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.recommend-thumbnail {
  width: 88px;
  height: 66px;
  border-radius: @border-radius-md;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .recommend-item:hover & img {
    transform: scale(1.05);
  }
}

.recommend-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommend-title {
  font-size: @font-size-sm;
  font-weight: 600;
  margin: 0 0 @spacing-xs 0;
  color: @gray-800;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  
  .recommend-item:hover & {
    color: @primary-color;
  }
}

.recommend-meta {
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
}

.recommend-author,
.recommend-views {
  font-size: @font-size-xs;
  color: @gray-500;
  font-weight: 400;
}

// 响应式设计
@media (max-width: 1024px) {
  .video-layout {
    grid-template-columns: 1fr;
    gap: @spacing-xl;
  }
  
  .recommend-section {
    order: -1;
    position: static;
    
    h3 {
      font-size: @font-size-base;
    }
  }
  
  .recommend-item {
    padding: @spacing-sm;
    
    .recommend-thumbnail {
      width: 72px;
      height: 54px;
    }
    
    .recommend-title {
      font-size: @font-size-xs;
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: @spacing-lg 0;
    
    .container {
      padding: 0 @spacing-md;
    }
  }
  
  .video-player {
    height: 280px;
  }
  
  .video-info {
    padding: @spacing-lg;
  }
  
  .video-title {
    font-size: @font-size-xl;
    margin-bottom: @spacing-md;
  }
  
  .video-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: @spacing-md;
    
    .stats {
      gap: @spacing-lg;
    }
  }
  
  .comment-section {
    padding: @spacing-lg;
    
    .comment-form {
      padding: @spacing-lg;
    }
    
    .comment-item {
      padding: @spacing-md;
      gap: @spacing-sm;
    }
  }
  
  .recommend-section {
    padding: @spacing-lg;
    
    .recommend-item {
      .recommend-thumbnail {
        width: 64px;
        height: 48px;
      }
    }
  }
  
  .header {
    .container {
      padding: 0 @spacing-md;
    }
    
    .nav-left {
      gap: @spacing-md;
    }
    
    .logo h1 {
      font-size: @font-size-lg;
    }
  }
}
</style>