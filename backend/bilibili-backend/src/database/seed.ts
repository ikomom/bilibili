import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);
  const categoriesService = app.get(CategoriesService);
  const imagesService = app.get(ImagesService);

  try {
    // 创建默认管理员用户
    console.log('创建默认管理员用户...');
    await authService.createUser('admin', 'admin123', 'admin');
    console.log('默认管理员用户创建成功: admin/admin123');

    // 创建默认分类
    console.log('创建默认分类...');
    const categories = [
      { name: '动画', description: '动画相关内容' },
      { name: '番剧', description: '番剧相关内容' },
      { name: '国创', description: '国产动画' },
      { name: '音乐', description: '音乐相关内容' },
      { name: '舞蹈', description: '舞蹈相关内容' },
      { name: '游戏', description: '游戏相关内容' },
      { name: '科技', description: '科技相关内容' },
      { name: '数码', description: '数码产品' },
      { name: '生活', description: '生活相关内容' },
      { name: '美食', description: '美食相关内容' },
    ];

    for (const category of categories) {
      await categoriesService.create(category);
    }
    console.log('默认分类创建成功');

    // 创建示例图片数据
    console.log('创建示例图片数据...');
    const images = [
      {
        title: '精美动画壁纸',
        description: '高清动画壁纸，适合桌面使用',
        url: 'https://picsum.photos/800/600?random=1',
        thumbnail: 'https://picsum.photos/400/300?random=1',
        category: '动画',
        views: 1250,
        likes: 89,
      },
      {
        title: '番剧截图合集',
        description: '热门番剧精彩截图',
        url: 'https://picsum.photos/800/600?random=2',
        thumbnail: 'https://picsum.photos/400/300?random=2',
        category: '番剧',
        views: 2340,
        likes: 156,
      },
      {
        title: '国创角色设计',
        description: '国产动画角色设计图',
        url: 'https://picsum.photos/800/600?random=3',
        thumbnail: 'https://picsum.photos/400/300?random=3',
        category: '国创',
        views: 890,
        likes: 67,
      },
      {
        title: '音乐专辑封面',
        description: '精美音乐专辑封面设计',
        url: 'https://picsum.photos/800/600?random=4',
        thumbnail: 'https://picsum.photos/400/300?random=4',
        category: '音乐',
        views: 1560,
        likes: 123,
      },
      {
        title: '舞蹈表演照片',
        description: '精彩舞蹈表演瞬间',
        url: 'https://picsum.photos/800/600?random=5',
        thumbnail: 'https://picsum.photos/400/300?random=5',
        category: '舞蹈',
        views: 780,
        likes: 45,
      },
      {
        title: '游戏截图',
        description: '热门游戏精彩截图',
        url: 'https://picsum.photos/800/600?random=6',
        thumbnail: 'https://picsum.photos/400/300?random=6',
        category: '游戏',
        views: 3200,
        likes: 234,
      },
    ];

    for (const image of images) {
      await imagesService.create(image);
    }
    console.log('示例图片数据创建成功');

    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
  } finally {
    await app.close();
  }
}

seed();
