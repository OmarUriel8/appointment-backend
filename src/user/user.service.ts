import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { UserRole } from './enums/user-role.enum';
import { UpdatePasswordDto } from './dto/update-pasword.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...restDto } = createUserDto;
      const user = await this.userRepository.create({
        ...restDto,
        password: bcrypt.hashSync(password, 10),
        role: restDto.role ? restDto.role : UserRole.CLIENT,
      });

      await this.userRepository.save(user);
      const { password: p, createdAt, updatedAt, ...rest } = user;

      return { ...rest };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {
      limit = 10,
      offset = 0,
      role = 'all',
      isActive = null,
    } = paginationDto;

    let where = {} as any;
    if (role !== 'all') {
      where.role = role as UserRole;
    }
    if (isActive !== null) {
      where.isActice = isActive;
    }

    const [users, userCount] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
      where,
      order: { email: 'asc' },
    });

    return {
      total: userCount,
      pages: Math.ceil(userCount / limit),
      users,
    };
  }

  async findOne(term: string) {
    const { password, ...user } = await this.findOneWithPassword(term);

    return user;
  }

  async findOneWithPassword(term: string) {
    let user: User | null;
    if (isUUID(term)) {
      user = await this.userRepository.findOne({
        where: { id: term },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          password: true,
          name: true,
        },
      });
    } else {
      const query = this.userRepository.createQueryBuilder('user');

      user = await query
        .where(`LOWER(email) = :email`, { email: term.toLowerCase() })
        .select([
          'user.id',
          'user.email',
          'user.phone',
          'user.role',
          'user.isActive',
          'user.password',
          'user.name',
        ])
        .getOne();
    }

    if (!user) {
      throw new BadRequestException(`User with term ${term} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { role, isActive, ...rest } = updateUserDto;
    const user = await this.userRepository.preload({
      ...rest,
      id,
    });

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    // if (userLogin.roles.includes(ValidRoles.admin)) {
    user.role = role ?? user?.role;
    user.isActive = isActive ?? user.isActive;
    // }

    await this.userRepository.save(user);

    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    try {
      user!.isActive = false;
      await this.userRepository.save(user);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async changePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOneWithPassword(id);

    try {
      user!.password = bcrypt.hashSync(updatePasswordDto.password, 10);
      this.userRepository.save(user!);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
