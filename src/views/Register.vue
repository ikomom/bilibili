<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>加入我们，开启精彩视频之旅</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱（可选）"
            prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="请输入昵称（可选）"
            prefix-icon="Avatar"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRegister"
            class="register-btn"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="login-link">
          <span>已有账号？</span>
          <router-link to="/admin/login" class="link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api'

const router = useRouter()
const registerFormRef = ref()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    const { confirmPassword, ...registerData } = registerForm
    
    const response = await authAPI.register(registerData)
    
    ElMessage.success('注册成功！请登录')
    router.push('/admin/login')
  } catch (error) {
    
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
@import '../style.less';

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  padding: @spacing-xl;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
    pointer-events: none;
  }
}

.register-card {
  background: @white;
  border-radius: @border-radius-xl;
  box-shadow: @shadow-xl;
  padding: @spacing-3xl;
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
    border-radius: @border-radius-xl;
    z-index: -1;
  }
}

.register-header {
  text-align: center;
  margin-bottom: @spacing-2xl;
  
  h2 {
    color: @gray-800;
    margin-bottom: @spacing-sm;
    font-size: @font-size-2xl;
    font-weight: 700;
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

.register-form {
  margin-top: @spacing-xl;
  
  .el-form-item {
    margin-bottom: @spacing-xl;
  }
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: @font-size-lg;
  font-weight: 600;
  border-radius: @border-radius-lg;
  background: linear-gradient(135deg, @primary-color 0%, @primary-dark 100%);
  border: none;
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
}

.login-link {
  text-align: center;
  margin-top: @spacing-xl;
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

// Element Plus 样式覆盖
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

:deep(.el-form-item__error) {
  color: @error-color;
  font-size: @font-size-xs;
  font-weight: 500;
}

// 响应式设计
@media (max-width: 768px) {
  .register-container {
    padding: @spacing-lg;
  }
  
  .register-card {
    padding: @spacing-xl;
    max-width: 100%;
    
    .register-header {
      margin-bottom: @spacing-xl;
      
      h2 {
        font-size: @font-size-xl;
      }
      
      p {
        font-size: @font-size-sm;
      }
    }
    
    .register-form {
      .el-form-item {
        margin-bottom: @spacing-lg;
      }
    }
    
    .register-btn {
      height: 44px;
      font-size: @font-size-base;
    }
  }
}
</style>