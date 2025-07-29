import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async createUser(username: string, password: string, role: string = 'admin') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async register(registerDto: RegisterDto) {
    const { username, password, email, nickname, role = 'user' } = registerDto;
    
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (email) {
      const existingEmail = await this.userRepository.findOne({ where: { email } });
      if (existingEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      nickname,
      role,
      status: 'active',
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async findAllUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'username', 'email', 'nickname', 'role', 'status', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'nickname', 'role', 'status', 'createdAt', 'updatedAt'],
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    
    // 检查用户名是否已被其他用户使用
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({ 
        where: { username: updateUserDto.username } 
      });
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (existingEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    // 如果更新密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findUserById(id);
  }

  async deleteUser(id: number) {
    const user = await this.findUserById(id);
    
    // 防止删除管理员账户
    if (user.role === 'admin') {
      throw new ConflictException('不能删除管理员账户');
    }
    
    await this.userRepository.delete(id);
    return { message: '用户删除成功' };
  }

  async toggleUserStatus(id: number) {
    const user = await this.findUserById(id);
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await this.userRepository.update(id, { status: newStatus });
    
    return this.findUserById(id);
  }
}