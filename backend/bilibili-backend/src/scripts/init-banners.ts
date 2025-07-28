import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { BannersService } from '../banners/banners.service';

async function initBanners() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const bannersService = app.get(BannersService);

  // 创建测试轮播图数据
  const testBanners = [
    {
      title: '精彩游戏直播',
      description: '观看最热门的游戏直播内容',
      imageUrl: 'https://picsum.photos/800/300?random=1',
      linkUrl: '/category/games',
      sortOrder: 1,
      isActive: true,
    },
    {
      title: '热门番剧推荐',
      description: '最新最热的番剧内容等你来看',
      imageUrl: 'https://picsum.photos/800/300?random=2',
      linkUrl: '/category/anime',
      sortOrder: 2,
      isActive: true,
    },
    {
      title: '科技前沿',
      description: '探索最新的科技资讯和产品评测',
      imageUrl: 'https://picsum.photos/800/300?random=3',
      linkUrl: '/category/tech',
      sortOrder: 3,
      isActive: true,
    },
  ];

  try {
    // 检查是否已有轮播图数据
    const existingBanners = await bannersService.findAll();
    if (existingBanners.length === 0) {
      console.log('正在创建测试轮播图数据...');
      for (const banner of testBanners) {
        await bannersService.create(banner);
        console.log(`创建轮播图: ${banner.title}`);
      }
      console.log('测试轮播图数据创建完成！');
    } else {
      console.log(`已存在 ${existingBanners.length} 个轮播图，跳过初始化`);
    }
  } catch (error) {
    console.error('创建轮播图数据失败:', error);
  }

  await app.close();
}

initBanners();