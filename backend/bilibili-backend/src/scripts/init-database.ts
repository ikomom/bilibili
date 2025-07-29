import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { CategoriesService } from '../categories/categories.service';
import { ImagesService } from '../images/images.service';
import { BannersService } from '../banners/banners.service';

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);
  const categoriesService = app.get(CategoriesService);
  const imagesService = app.get(ImagesService);
  const bannersService = app.get(BannersService);

  try {
    // 1. 创建默认管理员用户
    console.log('👤 创建默认管理员用户...');
    try {
      await authService.register({
        username: 'admin',
        password: 'admin123',
        email: 'admin@bilibili.com',
        nickname: '系统管理员',
        role: 'admin'
      });
      console.log('✅ 默认管理员用户创建成功: admin/admin123');
    } catch (error) {
      if (error.message.includes('用户名已存在')) {
        console.log('ℹ️  管理员用户已存在，跳过创建');
      } else {
        throw error;
      }
    }

    // 2. 创建默认分类
    console.log('📂 创建默认分类...');
    const categories = [
      { name: '动画', description: '动画相关内容，包括各种动画作品' },
      { name: '番剧', description: '日本动画番剧，热门新番推荐' },
      { name: '国创', description: '国产原创动画作品' },
      { name: '音乐', description: '音乐MV、翻唱、原创音乐' },
      { name: '舞蹈', description: '舞蹈表演、教学、翻跳' },
      { name: '游戏', description: '游戏实况、攻略、解说' },
      { name: '科技', description: '科技资讯、数码评测' },
      { name: '数码', description: '数码产品开箱、评测' },
      { name: '生活', description: '生活日常、Vlog分享' },
      { name: '美食', description: '美食制作、探店、吃播' },
      { name: '时尚', description: '时尚穿搭、美妆教程' },
      { name: '娱乐', description: '娱乐资讯、明星动态' },
    ];

    const existingCategories = await categoriesService.findAll();
    if (existingCategories.length === 0) {
      for (const category of categories) {
        await categoriesService.create(category);
        console.log(`  ✅ 创建分类: ${category.name}`);
      }
      console.log('✅ 默认分类创建完成');
    } else {
      console.log(`ℹ️  已存在 ${existingCategories.length} 个分类，跳过创建`);
    }

    // 3. 创建轮播图数据
    console.log('🎠 创建轮播图数据...');
    const banners = [
      {
        title: '精彩游戏直播',
        description: '观看最热门的游戏直播内容，体验精彩游戏世界',
        imageUrl: 'https://picsum.photos/800/300?random=1',
        linkUrl: '/category/games',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: '热门番剧推荐',
        description: '最新最热的番剧内容等你来看，追番必备',
        imageUrl: 'https://picsum.photos/800/300?random=2',
        linkUrl: '/category/anime',
        sortOrder: 2,
        isActive: true,
      },
      {
        title: '科技前沿',
        description: '探索最新的科技资讯和产品评测，紧跟科技潮流',
        imageUrl: 'https://picsum.photos/800/300?random=3',
        linkUrl: '/category/tech',
        sortOrder: 3,
        isActive: true,
      },
      {
        title: '美食天地',
        description: '发现美味佳肴，学习烹饪技巧，享受美食文化',
        imageUrl: 'https://picsum.photos/800/300?random=4',
        linkUrl: '/category/food',
        sortOrder: 4,
        isActive: true,
      },
      {
        title: '音乐世界',
        description: '聆听动人旋律，发现优秀音乐作品和才华横溢的音乐人',
        imageUrl: 'https://picsum.photos/800/300?random=5',
        linkUrl: '/category/music',
        sortOrder: 5,
        isActive: true,
      },
    ];

    const existingBanners = await bannersService.findAll();
    if (existingBanners.length === 0) {
      for (const banner of banners) {
        await bannersService.create(banner);
        console.log(`  ✅ 创建轮播图: ${banner.title}`);
      }
      console.log('✅ 轮播图数据创建完成');
    } else {
      console.log(`ℹ️  已存在 ${existingBanners.length} 个轮播图，跳过创建`);
    }

    // 4. 创建示例图片/视频数据
    console.log('🖼️  创建示例内容数据...');
    const images = [
      {
        title: '【动画】精美动画壁纸合集',
        author: 'AnimeLover',
        description: '收集了各种精美的动画壁纸，高清画质',
        url: 'https://picsum.photos/800/600?random=10',
        thumbnail: 'https://picsum.photos/400/300?random=10',
        category: '动画',
        views: 15420,
        likes: 892,
      },
      {
        title: '【番剧】新番推荐 - 本季必看',
        author: 'AnimeReviewer',
        description: '本季度最值得追的新番剧推荐，不容错过',
        url: 'https://picsum.photos/800/600?random=11',
        thumbnail: 'https://picsum.photos/400/300?random=11',
        category: '番剧',
        views: 28350,
        likes: 1456,
      },
      {
        title: '【国创】国产动画崛起之路',
        author: 'ChinaAnimation',
        description: '回顾国产动画的发展历程，展望未来',
        url: 'https://picsum.photos/800/600?random=12',
        thumbnail: 'https://picsum.photos/400/300?random=12',
        category: '国创',
        views: 12680,
        likes: 734,
      },
      {
        title: '【音乐】流行音乐MV精选',
        author: 'MusicFan',
        description: '最新流行音乐MV合集，好听到停不下来',
        url: 'https://picsum.photos/800/600?random=13',
        thumbnail: 'https://picsum.photos/400/300?random=13',
        category: '音乐',
        views: 45230,
        likes: 2341,
      },
      {
        title: '【舞蹈】街舞教学基础入门',
        author: 'DanceTeacher',
        description: '从零开始学街舞，详细的基础动作教学',
        url: 'https://picsum.photos/800/600?random=14',
        thumbnail: 'https://picsum.photos/400/300?random=14',
        category: '舞蹈',
        views: 18750,
        likes: 967,
      },
      {
        title: '【游戏】热门游戏实况解说',
        author: 'GameMaster',
        description: '最新热门游戏的精彩实况解说',
        url: 'https://picsum.photos/800/600?random=15',
        thumbnail: 'https://picsum.photos/400/300?random=15',
        category: '游戏',
        views: 67890,
        likes: 3456,
      },
      {
        title: '【科技】最新科技产品评测',
        author: 'TechReviewer',
        description: '深度评测最新科技产品，帮你做出购买决策',
        url: 'https://picsum.photos/800/600?random=16',
        thumbnail: 'https://picsum.photos/400/300?random=16',
        category: '科技',
        views: 34560,
        likes: 1789,
      },
      {
        title: '【数码】手机摄影技巧分享',
        author: 'PhotoPro',
        description: '用手机也能拍出专业级照片的技巧分享',
        url: 'https://picsum.photos/800/600?random=17',
        thumbnail: 'https://picsum.photos/400/300?random=17',
        category: '数码',
        views: 23450,
        likes: 1234,
      },
      {
        title: '【生活】日常生活小妙招',
        author: 'LifeHacker',
        description: '实用的生活小技巧，让生活更便利',
        url: 'https://picsum.photos/800/600?random=18',
        thumbnail: 'https://picsum.photos/400/300?random=18',
        category: '生活',
        views: 19870,
        likes: 876,
      },
      {
        title: '【美食】家常菜制作教程',
        author: 'ChefMaster',
        description: '简单易学的家常菜制作方法，新手也能轻松掌握',
        url: 'https://picsum.photos/800/600?random=19',
        thumbnail: 'https://picsum.photos/400/300?random=19',
        category: '美食',
        views: 41230,
        likes: 2156,
      },
      {
        title: '【时尚】春季穿搭指南',
        author: 'FashionGuru',
        description: '春季时尚穿搭推荐，让你成为街头焦点',
        url: 'https://picsum.photos/800/600?random=20',
        thumbnail: 'https://picsum.photos/400/300?random=20',
        category: '时尚',
        views: 28940,
        likes: 1567,
      },
      {
        title: '【娱乐】明星八卦最新资讯',
        author: 'EntertainmentNews',
        description: '最新的娱乐圈资讯和明星动态',
        url: 'https://picsum.photos/800/600?random=21',
        thumbnail: 'https://picsum.photos/400/300?random=21',
        category: '娱乐',
        views: 52340,
        likes: 2789,
      },
    ];

    const existingImages = await imagesService.findAll(1, 1);
    if (existingImages.data.length === 0) {
      for (const image of images) {
        await imagesService.create(image);
        console.log(`  ✅ 创建内容: ${image.title}`);
      }
      console.log('✅ 示例内容数据创建完成');
    } else {
      console.log(`ℹ️  已存在内容数据，跳过创建`);
    }

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📊 初始化统计:');
    console.log(`   👤 管理员账户: admin/admin123`);
    console.log(`   📂 分类数量: ${categories.length}`);
    console.log(`   🎠 轮播图数量: ${banners.length}`);
    console.log(`   🖼️  示例内容: ${images.length}`);
    console.log('\n🚀 现在可以启动应用了！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    if (error.stack) {
      console.error('错误详情:', error.stack);
    }
  } finally {
    await app.close();
  }
}

initDatabase();