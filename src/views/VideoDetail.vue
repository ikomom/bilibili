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
  
  // 模拟评论数据
  comments.value = [
    {
      id: 1,
      author: '用户001',
      content: '这个内容真不错！',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 5
    },
    {
      id: 2,
      author: '用户002',
      content: '很有创意，学到了很多',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      likes: 3
    },
    {
      id: 3,
      author: '用户003',
      content: '期待更多这样的内容',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      likes: 8
    }
  ]
}

onMounted(() => {
  userStore.checkAuth()
  initData()
})
</script>

<style scoped>
.video-detail {
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
}

.back-btn {
  margin-right: 20px;
  font-size: 16px;
  color: #666;
}

.back-btn:hover {
  color: #00a1d6;
}

.logo h1 {
  color: #00a1d6;
  font-size: 24px;
  font-weight: bold;
}

.admin-link {
  text-decoration: none;
}

/* 主要内容 */
.main-content {
  padding: 20px 0;
}

.video-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

/* 视频区域 */
.video-section {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.video-player {
  position: relative;
  width: 100%;
  height: 450px;
  background: #000;
}

.video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.play-overlay:hover {
  background: rgba(0, 161, 214, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
}

.play-icon {
  font-size: 32px;
  color: white;
  margin-left: 4px;
}

/* 视频信息 */
.video-info {
  padding: 20px;
}

.video-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 15px 0;
  color: #333;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5;
}

.meta-left {
  display: flex;
  gap: 15px;
  align-items: center;
}

.author {
  color: #00a1d6;
  font-weight: 500;
}

.upload-time {
  color: #999;
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 20px;
}

.views, .likes {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.views:hover, .likes:hover {
  color: #00a1d6;
}

.video-description {
  color: #666;
  line-height: 1.6;
}

/* 评论区 */
.comment-section {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
}

.comment-header h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-input {
  margin-bottom: 10px;
}

.comment-actions {
  text-align: right;
}

.comment-list {
  space-y: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.comment-text {
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.comment-like:hover {
  color: #00a1d6;
}

/* 推荐区域 */
.recommend-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
}

.recommend-section h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.recommend-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

.recommend-item:hover {
  background: #f5f5f5;
}

.recommend-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.recommend-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-info {
  flex: 1;
  min-width: 0;
}

.recommend-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recommend-author,
.recommend-views {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .video-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .recommend-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .video-player {
    height: 250px;
  }
  
  .video-title {
    font-size: 20px;
  }
  
  .video-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>