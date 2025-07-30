<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>管理后台登录</h2>
          <p>请输入管理员账号密码</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-tips">
          <p>默认账号：admin</p>
          <p>默认密码：admin123</p>
        </div>
        
        <div class="register-link">
          <span>还没有账号？</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
        
        <div class="back-home">
          <router-link to="/">
            <el-button type="text">
              <el-icon><ArrowLeft /></el-icon>
              返回首页
            </el-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    const success = await userStore.login(loginForm.username, loginForm.password)
    
    if (success) {
      ElMessage.success('登录成功')
      router.push('/admin')
    } else {
      ElMessage.error(userStore.error || '用户名或密码错误')
    }
  } catch (error) {
    console.log('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
@import '../style.less';

.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-xl;
  position: relative;
  
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
}

.login-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.login-card {
  background: @white;
  border-radius: @border-radius-xl;
  padding: @spacing-3xl;
  box-shadow: @shadow-2xl;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
    border-radius: @border-radius-xl;
    z-index: -1;
  }
}

.login-header {
  text-align: center;
  margin-bottom: @spacing-2xl;
  
  h2 {
    color: @gray-800;
    font-size: @font-size-2xl;
    font-weight: 700;
    margin-bottom: @spacing-sm;
    background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: @gray-600;
    font-size: @font-size-base;
    margin: 0;
    font-weight: 400;
  }
}

.login-form {
  margin-bottom: @spacing-xl;
  
  .el-form-item {
    margin-bottom: @spacing-xl;
    
    :deep(.el-form-item__label) {
      color: @gray-700;
      font-weight: 600;
      font-size: @font-size-sm;
    }
    
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: @border-radius-lg;
        box-shadow: 0 0 0 1px @gray-300;
        transition: all 0.3s ease;
        background: @white;
        
        &:hover {
          box-shadow: 0 0 0 1px @gray-400;
        }
        
        &.is-focus {
          box-shadow: 0 0 0 2px fade(@primary-color, 30%);
        }
      }
      
      .el-input__inner {
        font-size: @font-size-base;
        color: @gray-800;
        
        &::placeholder {
          color: @gray-500;
        }
      }
      
      .el-input__prefix-inner {
        color: @gray-500;
        
        .el-icon {
          font-size: @font-size-lg;
        }
      }
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: @font-size-lg;
  font-weight: 600;
  background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
  border: none;
  border-radius: @border-radius-lg;
  box-shadow: @shadow-md;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, @primary-dark 0%, darken(@primary-dark, 10%) 100%);
    transform: translateY(-2px);
    box-shadow: @shadow-lg;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.is-loading {
    transform: none;
  }
}

.login-tips {
  background: linear-gradient(135deg, @gray-50 0%, @gray-100 100%);
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  margin-bottom: @spacing-xl;
  text-align: center;
  border: 1px solid @gray-200;
  
  p {
    color: @gray-600;
    font-size: @font-size-sm;
    margin: @spacing-xs 0;
    font-weight: 500;
    
    &:first-child {
      margin-top: 0;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.register-link {
  text-align: center;
  margin-bottom: @spacing-xl;
  color: @gray-600;
  font-size: @font-size-sm;
  
  .link {
    color: @primary-color;
    text-decoration: none;
    margin-left: @spacing-xs;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      color: @primary-dark;
      text-decoration: underline;
    }
  }
}

.back-home {
  text-align: center;
  
  .el-button {
    color: @gray-600;
    font-size: @font-size-sm;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      color: @primary-color;
      background: fade(@primary-color, 10%);
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .admin-login {
    padding: @spacing-lg;
  }
  
  .login-card {
    padding: @spacing-xl;
    
    .login-header {
      margin-bottom: @spacing-xl;
      
      h2 {
        font-size: @font-size-xl;
      }
      
      p {
        font-size: @font-size-sm;
      }
    }
    
    .login-form {
      .el-form-item {
        margin-bottom: @spacing-lg;
      }
    }
    
    .login-btn {
      height: 44px;
      font-size: @font-size-base;
    }
  }
}
</style>