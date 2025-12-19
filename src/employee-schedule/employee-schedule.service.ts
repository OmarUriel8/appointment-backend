import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { EmployeeSchedule } from './entities/employee-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/enums/user-role.enum';
import { toSeconds } from '../utils/to-seconds';
import { CreateEmployeeScheduleDto, UpdateEmployeeScheduleDto } from './dto';

@Injectable()
export class EmployeeScheduleService {
  private readonly logger = new Logger('EmployeeSchedule');

  constructor(
    @InjectRepository(EmployeeSchedule)
    private readonly employeeScheduleRepository: Repository<EmployeeSchedule>,
    private readonly userService: UserService,
    private readonly datasource: DataSource,
  ) {}

  async create(
    employeeId: string,
    createEmployeeScheduleDtos: CreateEmployeeScheduleDto[],
  ) {
    const user = await this.userService.findOne(employeeId);
    if (user.role !== UserRole.EMPLOYEE) {
      throw new BadRequestException(
        `User with id ${employeeId} is not to role EMPLOYEE`,
      );
    }

    if (createEmployeeScheduleDtos.length !== 7) {
      throw new BadRequestException(
        `For create the schedules need 7 registers.`,
      );
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // validaciopn del horario
      const employeeSchedules = createEmployeeScheduleDtos.map((schedule) => {
        const start = toSeconds(schedule.startTime);
        const end = toSeconds(schedule.endTime);

        if (start >= end) {
          throw new BadRequestException(
            `The schedule of start ${start} must be minor that end ${end}`,
          );
        }

        // creacion del horario
        return this.employeeScheduleRepository.create({
          ...schedule,
          employee: { id: employeeId },
          //isActive: true,
        });
      });

      await queryRunner.manager.save(employeeSchedules);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return employeeSchedules.map(({ createdAt, updatedAt, ...schedule }) => {
        return schedule;
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async findOne(employeeId: string) {
    const schedule = await this.employeeScheduleRepository.findBy({
      employee: { id: employeeId },
    });

    if (schedule.length === 0) {
      throw new NotFoundException(
        `Schedule with employee id ${employeeId} not found`,
      );
    }

    return schedule;
  }

  private async findOneSchedule(id: string) {
    const schedule = await this.employeeScheduleRepository.findOneBy({ id });
    if (!schedule) {
      throw new BadRequestException(
        `Employee Schedule with id ${id} not found`,
      );
    }

    return schedule;
  }

  async update(
    id: string,
    updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    const { startTime, endTime, ...rest } = updateEmployeeScheduleDto;

    const updateSchedule = await this.employeeScheduleRepository.preload({
      ...rest,
      id,
    });

    if (!updateSchedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }

    // valida horario
    const start = startTime ?? updateSchedule.startTime;
    const end = endTime ?? updateSchedule.endTime;

    if (toSeconds(start) >= toSeconds(end)) {
      throw new BadRequestException(
        `The schedule of start ${start} must be minor that end ${end}`,
      );
    }

    updateSchedule.startTime = start;
    updateSchedule.endTime = end;

    try {
      await this.employeeScheduleRepository.save(updateSchedule);

      return this.findOneSchedule(id);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const schedule = await this.findOneSchedule(id);

    try {
      schedule.isActive = false;
      await this.employeeScheduleRepository.save(schedule);
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
