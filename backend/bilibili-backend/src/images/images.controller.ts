import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createImageDto.url = `/uploads/${file.filename}`;
      createImageDto.thumbnail = `/uploads/${file.filename}`;
    }
    return this.imagesService.create(createImageDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.imagesService.findAll(
      parseInt(page),
      parseInt(limit),
      category,
      search,
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.imagesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.remove(id);
  }

  @Post(':id/view')
  async incrementViews(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.incrementViews(id);
  }

  @Post(':id/like')
  async incrementLikes(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.incrementLikes(id);
  }
}
