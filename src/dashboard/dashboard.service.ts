import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Repository } from 'typeorm';
import { DashboardDto } from './dto/dashboard.dto';
import { AppointmentStatus } from 'src/appointment/enum/appointment-status.enum';
import {
  AppointmentCanceled,
  AppointmentClient,
  AppointmentCompleted,
  ClientMostVisited,
  ReviewByClient,
  ScoreAverage,
  ServiceMostUsed,
} from './interfaces';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAdmin(dashboardDto: DashboardDto) {
    console.log(dashboardDto);
    try {
      const { endDate, startDate } = dashboardDto;

      const appointmentScore: { averageScore: number } =
        (await this.appointmentRepository
          .createQueryBuilder('apt')
          .select('AVG(apt.score)', 'averageScore')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('apt.score > 0')
          .getRawOne()) ?? {
          averageScore: 0,
        };

      const appointmentCompleted: AppointmentCompleted =
        (await this.appointmentRepository
          .createQueryBuilder('apt')
          .select('SUM(apt.price)', 'total')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'count')
          .addSelect(
            'COALESCE(SUM(apt.price) / NULLIF(COUNT(apt.id), 0), 0)',
            'average',
          )
          .addSelect('AVG(apt.score)', 'averageScore')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .getRawOne()) ?? {
          average: 0,
          count: 0,
          total: 0,
          averageScore: 0,
        };

      appointmentCompleted.averageScore = appointmentScore.averageScore;

      const appointmentCanceled: AppointmentCanceled =
        (await this.appointmentRepository
          .createQueryBuilder('apt')
          .select('SUM(apt.price)', 'total')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'count')
          .addSelect(
            'COALESCE(SUM(apt.price) / NULLIF(COUNT(apt.id), 0), 0)',
            'average',
          )
          .where('apt.status = :status', {
            status: AppointmentStatus.CANCELLED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .getRawOne()) ?? {
          average: 0,
          count: 0,
          percentage: 0,
          total: 0,
        };

      appointmentCanceled.percentage =
        appointmentCompleted.count === 0
          ? 0
          : appointmentCanceled.count / appointmentCompleted.count;

      const serviceMostUsed: ServiceMostUsed[] =
        await this.appointmentRepository
          .createQueryBuilder('apt')
          .innerJoin('apt.service', 'service')
          .select('service.id', 'id')
          .addSelect('service.name', 'name')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'total')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .take(3)
          .groupBy('service.id')
          .addGroupBy('service.name')
          .orderBy('total', 'DESC')
          .getRawMany();

      const clientMostVisited: ClientMostVisited[] =
        await this.appointmentRepository
          .createQueryBuilder('apt')
          .innerJoin('apt.client', 'client')
          .select('client.id', 'id')
          .addSelect('client.name', 'name')
          .addSelect('client.email', 'email')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'total')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .take(5)
          .groupBy('client.id')
          .addGroupBy('client.name')
          .addGroupBy('client.email')
          .orderBy('total', 'DESC')
          .getRawMany();

      return {
        serviceMostUsed,
        clientMostVisited,
        appointmentCompleted,
        appointmentCanceled,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findClient(dashboardDto: DashboardDto, user: User) {
    try {
      const { endDate, startDate } = dashboardDto;

      const appointmentCompleted: AppointmentClient =
        (await this.appointmentRepository
          .createQueryBuilder('apt')
          .select('CAST(COUNT(apt.id) AS INT)', 'count')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('apt.clientId = :id', { id: user.id })
          .getRawOne()) ?? {
          count: 0,
        };

      const appointmentPending: AppointmentClient =
        (await this.appointmentRepository
          .createQueryBuilder('apt')
          .select('CAST(COUNT(apt.id) AS INT)', 'count')
          .where('apt.status IN(:...status)', {
            status: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('apt.clientId = :id', { id: user.id })
          .getRawOne()) ?? {
          count: 0,
        };

      const serviceMostUsed: ServiceMostUsed[] =
        await this.appointmentRepository
          .createQueryBuilder('apt')
          .innerJoin('apt.service', 'service')
          .select('service.id', 'id')
          .addSelect('service.name', 'name')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'total')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('apt.clientId = :id', { id: user.id })
          .take(3)
          .groupBy('service.id')
          .addGroupBy('service.name')
          .orderBy('total', 'DESC')
          .getRawMany();

      return {
        appointmentCompleted,
        appointmentPending,
        serviceMostUsed,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findEmployee(dashboardDto: DashboardDto, user: User) {
    try {
      const { endDate, startDate } = dashboardDto;

      const serviceMostUsed: ServiceMostUsed[] =
        await this.appointmentRepository
          .createQueryBuilder('apt')
          .innerJoin('apt.service', 'service')
          .select('service.id', 'id')
          .addSelect('service.name', 'name')
          .addSelect('CAST(COUNT(apt.id) AS INT)', 'total')
          .where('apt.status = :status', {
            status: AppointmentStatus.COMPLETED,
          })
          .andWhere('apt.date BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('apt.employeeId = :id', { id: user.id })
          .take(3)
          .groupBy('service.id')
          .addGroupBy('service.name')
          .orderBy('total', 'DESC')
          .getRawMany();

      const scoreAverage: ScoreAverage = (await this.appointmentRepository
        .createQueryBuilder('apt')
        .select('AVG(apt.score)', 'average')
        .where('apt.status = :status', { status: AppointmentStatus.COMPLETED })
        .andWhere('apt.date BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .andWhere('apt.employeeId = :id', { id: user.id })
        .getRawOne()) ?? {
        average: 0,
      };

      const reviewClient: ReviewByClient[] = await this.appointmentRepository
        .createQueryBuilder('apt')
        .select('apt.comments', 'comments')
        .addSelect('apt.score', 'score')
        .addSelect('apt.id', 'id')
        .where('apt.status = :status', { status: AppointmentStatus.COMPLETED })
        .andWhere('apt.date BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .andWhere('apt.score > 3')
        .andWhere('apt.employeeId = :id', { id: user.id })
        .getRawMany();

      return {
        serviceMostUsed,
        scoreAverage,
        reviewClient,
      };
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
