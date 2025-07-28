import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Image } from '../entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepository.create(createImageDto);
    return this.imageRepository.save(image);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
  ): Promise<{ data: Image[]; total: number }> {
    const queryBuilder = this.imageRepository.createQueryBuilder('image');

    queryBuilder.where('image.isActive = :isActive', { isActive: true });

    if (category && category !== '全部') {
      queryBuilder.andWhere('image.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere('image.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy('image.createdAt', 'DESC');

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`图片 ID ${id} 不存在`);
    }
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);
    Object.assign(image, updateImageDto);
    return this.imageRepository.save(image);
  }

  async remove(id: number): Promise<void> {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
  }

  async incrementViews(id: number): Promise<void> {
    await this.imageRepository.increment({ id }, 'views', 1);
  }

  async incrementLikes(id: number): Promise<void> {
    await this.imageRepository.increment({ id }, 'likes', 1);
  }

  async getStats(): Promise<{
    totalImages: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const result = await this.imageRepository
      .createQueryBuilder('image')
      .select('COUNT(*)', 'totalImages')
      .addSelect('SUM(image.views)', 'totalViews')
      .addSelect('SUM(image.likes)', 'totalLikes')
      .where('image.isActive = :isActive', { isActive: true })
      .getRawOne();

    return {
      totalImages: parseInt(result.totalImages) || 0,
      totalViews: parseInt(result.totalViews) || 0,
      totalLikes: parseInt(result.totalLikes) || 0,
    };
  }
}
