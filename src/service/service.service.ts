import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceImage } from './entities/service-image.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ServiceService {
  private logger = new Logger('ServiceService');

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceImage)
    private readonly serviceImageRepository: Repository<ServiceImage>,
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
    if (serviceName !== '') {
      query
        .where(`LOWER(service.name) LIKE :name`, {
          name: `%${serviceName.toLowerCase()}%`,
        })
        .getMany();
    }
    const [services, serviceCount] = await this.serviceRepository.findAndCount({
      where: where,
      take: limit,
      skip: offset,
    });

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

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: string) {
    return `This action removes a #${id} service`;
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
