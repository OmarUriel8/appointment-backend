import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DataSource, Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceImage } from './entities/service-image.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class ServiceService {
  private logger = new Logger('ServiceService');

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceImage)
    private readonly serviceImageRepository: Repository<ServiceImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const { images = [], ...rest } = createServiceDto;
      const service = this.serviceRepository.create({
        ...rest,
        images: images.map((imgUrl) =>
          this.serviceImageRepository.create({ url: imgUrl }),
        ),
      });

      await this.serviceRepository.save(service);
      console.log(service);

      return {
        ...service,
        images,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10, serviceName = '' } = paginationDto;

    let where = {} as any;
    if (serviceName !== '') {
      where.name = serviceName;
    }

    const query = this.serviceRepository.createQueryBuilder('service');
    const role = UserRole.CLIENT;
    if (role === UserRole.CLIENT) {
      query.andWhere(`service.isActive = true`);
    }

    if (serviceName !== '') {
      query.andWhere(`LOWER(service.name) LIKE :name`, {
        name: `%${serviceName.toLowerCase()}%`,
      });
    }

    const [services, serviceCount] = await query
      .leftJoinAndSelect('service.images', 'service_image')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      total: serviceCount,
      page: Math.ceil(serviceCount / limit),
      services,
    };
  }

  async findOne(term: string) {
    let service: Service | null;
    if (isUUID(term)) {
      service = await this.serviceRepository.findOneBy({ id: term });
    } else {
      const query = this.serviceRepository.createQueryBuilder('service');
      service = await query
        .leftJoinAndSelect('service.images', 'service_image')
        .where(`LOWER(name) = :name OR LOWER(slug) = :slug`, {
          name: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!service) {
      throw new BadRequestException(`service with term ${term} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const { images, ...toUpdate } = updateServiceDto;

    const service = await this.serviceRepository.preload({ ...toUpdate, id });

    if (!service) {
      throw new BadRequestException(`Service with id ${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ServiceImage, { service: { id } });

        service.images = images.map((image) =>
          this.serviceImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(service);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const service = await this.findOne(id);

      service.isActive = false;
      await this.serviceRepository.save(service);
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
