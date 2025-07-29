import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { imageAPI, categoryAPI, authAPI, bannerAPI } from "@/api";

// 图片数据store
export const useImageStore = defineStore("image", () => {
  const images = ref([]);
  const categories = ref([]);
  const selectedCategory = ref("全部");
  const loading = ref(false);
  const error = ref(null);

  // 计算属性：根据分类过滤图片
  const filteredImages = computed(() => {
    if (selectedCategory.value === "全部") {
      return images.value;
    }
    return images.value.filter(
      (img) => img.category === selectedCategory.value
    );
  });

  // 获取图片列表
  const fetchImages = async (params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await imageAPI.getImages(params);
      images.value = response.data || [];
    } catch (err) {
      error.value = err.message;
      console.error("获取图片列表失败:", err);
    } finally {
      loading.value = false;
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      const categoryNames = response.map((cat) => cat.name);
      categories.value = ["全部", ...categoryNames];
    } catch (err) {
      console.error("获取分类列表失败:", err);
    }
  };

  // 添加图片
  const addImage = async (formData) => {
    try {
      loading.value = true;
      const response = await imageAPI.createImage(formData);
      await fetchImages(); // 重新获取列表
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 删除图片
  const deleteImage = async (id) => {
    try {
      await imageAPI.deleteImage(id);
      images.value = images.value.filter((img) => img.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 更新图片
  const updateImage = async (id, updatedData) => {
    try {
      const response = await imageAPI.updateImage(id, updatedData);
      const index = images.value.findIndex((img) => img.id === id);
      if (index > -1) {
        images.value[index] = { ...images.value[index], ...response };
      }
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 增加观看次数
  const incrementViews = async (id) => {
    try {
      await imageAPI.incrementViews(id);
      const index = images.value.findIndex((img) => img.id === id);
      if (index > -1) {
        images.value[index].views++;
      }
    } catch (err) {
      console.error("增加观看次数失败:", err);
    }
  };

  // 增加点赞数
  const incrementLikes = async (id) => {
    try {
      await imageAPI.incrementLikes(id);
      const index = images.value.findIndex((img) => img.id === id);
      if (index > -1) {
        images.value[index].likes++;
      }
    } catch (err) {
      console.error("点赞失败:", err);
    }
  };

  // 设置选中的分类
  const setSelectedCategory = (category) => {
    selectedCategory.value = category;
  };

  return {
    images,
    categories,
    selectedCategory,
    filteredImages,
    loading,
    error,
    fetchImages,
    fetchCategories,
    addImage,
    deleteImage,
    updateImage,
    incrementViews,
    incrementLikes,
    setSelectedCategory,
  };
});

// 用户状态store
export const useUserStore = defineStore("user", () => {
  const isAdmin = ref(false);
  const adminInfo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const login = async (username, password) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await authAPI.login({ username, password });

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("isAdmin", "true");
        isAdmin.value = true;
        adminInfo.value = { 
          username, 
          name: "管理员", 
          token: response.access_token 
        };
        return true;
      }
      return false;
    } catch (err) {
      error.value = err.response?.data?.message || "登录失败";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    isAdmin.value = false;
    adminInfo.value = null;
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
  };

  // 初始化时检查登录状态
  const checkAuth = () => {
    const adminStatus = localStorage.getItem("isAdmin");
    const token = localStorage.getItem("token");
    if (adminStatus && token) {
      isAdmin.value = true;
      adminInfo.value = { 
        username: "admin", 
        name: "管理员", 
        token: token 
      };
    }
  };

  return {
    isAdmin,
    adminInfo,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };
});

// 轮播图数据store
export const useBannerStore = defineStore("banner", () => {
  const banners = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 获取轮播图列表（前端显示）
  const fetchBanners = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await bannerAPI.getBanners();
      banners.value = response || [];
    } catch (err) {
      error.value = err.message;
      console.error("获取轮播图列表失败:", err);
    } finally {
      loading.value = false;
    }
  };

  // 获取轮播图列表（管理后台）
  const fetchBannersForAdmin = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await bannerAPI.getBannersForAdmin();
      banners.value = response || [];
    } catch (err) {
      error.value = err.message;
      console.error("获取轮播图列表失败:", err);
    } finally {
      loading.value = false;
    }
  };

  // 添加轮播图
  const addBanner = async (bannerData) => {
    try {
      loading.value = true;
      const response = await bannerAPI.createBanner(bannerData);
      banners.value.push(response);
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 更新轮播图
  const updateBanner = async (id, bannerData) => {
    try {
      loading.value = true;
      const response = await bannerAPI.updateBanner(id, bannerData);
      const index = banners.value.findIndex((banner) => banner.id === id);
      if (index !== -1) {
        banners.value[index] = response;
      }
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 删除轮播图
  const deleteBanner = async (id) => {
    try {
      loading.value = true;
      await bannerAPI.deleteBanner(id);
      banners.value = banners.value.filter((banner) => banner.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 切换轮播图状态
  const toggleBannerActive = async (id) => {
    try {
      const response = await bannerAPI.toggleActive(id);
      const index = banners.value.findIndex((banner) => banner.id === id);
      if (index !== -1) {
        banners.value[index] = response;
      }
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 更新排序
  const updateBannerSort = async (id, sortOrder) => {
    try {
      const response = await bannerAPI.updateSortOrder(id, sortOrder);
      const index = banners.value.findIndex((banner) => banner.id === id);
      if (index !== -1) {
        banners.value[index] = response;
      }
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    banners,
    loading,
    error,
    fetchBanners,
    fetchBannersForAdmin,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    updateBannerSort,
  };
});
