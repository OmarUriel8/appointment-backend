import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { LessThan, MoreThan, Not, Raw, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AppointmentStatus } from './enum/appointment-status.enum';
import { ChangeStatusAppointmentDto } from './dto/change-status-appointment.dto';
import { ServiceService } from 'src/service/service.service';
import {
  addMinutes,
  generateSlots,
  isFree,
  toLocalDate,
  toSeconds,
  validateNotPast,
} from 'src/utils';
import { EmployeeSchedule } from 'src/employee-schedule/entities/employee-schedule.entity';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/enums/user-role.enum';
import { isUUID } from 'class-validator';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { TestimonialDto } from './dto/testimonial.dto';
import { AvaliableScheduleDto } from './dto/avaliable-schedule.dto';
import { AvaliableEmployeeDto, ScoreAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger('AppointmentService');

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly serviceService: ServiceService,
    private readonly userService: UserService,
    @InjectRepository(EmployeeSchedule)
    private readonly employeeScheduleRepository: Repository<EmployeeSchedule>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    const { serviceId, clientId, employeeId, status, ...restAppointment } =
      createAppointmentDto;

    const date = toLocalDate(restAppointment.date);

    const day = date.getDay();

    if (!validateNotPast(date.toString(), restAppointment.startTime)) {
      throw new BadRequestException(
        'Cannot create an appointment in the past.',
      );
    }

    let clientIdValid: string = !clientId ? user.id : clientId;
    let employeeIdValid: string;
    // ? 1 obtener servicio
    const service = await this.serviceService.findOne(serviceId);

    if (!service.isActive) {
      throw new BadRequestException(
        `Service ${service.name} not avaliable at the moment`,
      );
    }

    // ? 2 Calcular endTime
    const endTime = addMinutes(
      restAppointment.startTime,
      service.durationMinutes,
    );

    // ? 3 Obtiene empleado si no se paso en DTO
    if (!employeeId) {
      const employee = await this.employeeAvalible(
        restAppointment.startTime,
        endTime,
        date,
        day,
      );

      employeeIdValid = employee.id;
    }
    // ? 3 Valida si el empleado esta disponible
    else {
      const employee = (await this.userService.findOne(employeeId)) as User;
      if (
        !(await this.isWithinSchedule(
          employee,
          restAppointment.startTime,
          endTime,
          day,
        ))
      ) {
        throw new BadRequestException(
          `Employee not available for appointment (${restAppointment.startTime} - ${endTime})`,
        );
      }

      const confligAppointment = await this.hasConflicts(
        employee,
        date,
        restAppointment.startTime,
        endTime,
      );

      if (confligAppointment) {
        throw new BadRequestException(
          `Employee not available for appointment (${restAppointment.startTime}- ${endTime})`,
        );
      }

      employeeIdValid = employeeId;
    }

    // ? 4 Guarda la cita
    try {
      const appointment = this.appointmentRepository.create({
        ...restAppointment,
        status: status ?? AppointmentStatus.PENDING,
        client: { id: clientIdValid },
        employee: { id: employeeIdValid },
        service: { id: service.id },
        endTime: endTime,
        date: date,
      });

      await this.appointmentRepository.save(appointment);

      return appointment;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.getAppointmentes(paginationDto);
  }

  async findAllByClientId(paginationDto: PaginationDto, idClient: string) {
    return await this.getAppointmentes(paginationDto, idClient);
  }
  async findAllByEmployeeId(paginationDto: PaginationDto, idEmployee: string) {
    return await this.getAppointmentes(paginationDto, '', idEmployee);
  }

  async findOne(id: number, user: User | null) {
    if (isNaN(Number(id))) {
      throw new BadRequestException(`Id is not valid`);
    }

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['service', 'client', 'employee'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    if (user) {
      // cliente no es el registrado en la cita
      if (user.role === UserRole.CLIENT && appointment.client.id !== user.id) {
        throw new NotFoundException(`Appointment with id ${id} not found`);
      }

      // empleado no es el registrado en la cita
      if (
        user.role === UserRole.EMPLOYEE &&
        appointment.employee.id !== user.id
      ) {
        throw new NotFoundException(`Appointment with id ${id} not found`);
      }
    }

    return {
      ...appointment,
    };
  }

  async findAvailableHours(avaliableScheduleDto: AvaliableScheduleDto) {
    const { date } = avaliableScheduleDto;
    const where: any = { date: date.toISOString().split('T')[0] };
    const appointments = await this.appointmentRepository.find({
      where,
      relations: {
        employee: {
          employeeSchedule: true,
        },
      },
    });

    const validAppointments = appointments.filter(
      (a) => a.status !== AppointmentStatus.CANCELLED,
    );

    const schedules = await this.employeeScheduleRepository.find({
      where: {
        dayOfWeek: date.getDay(),
        isActive: true,
      },
      relations: {
        employee: true,
      },
    });

    const globalSlots = new Set<string>();

    schedules.forEach((schedule) => {
      const slots = generateSlots(schedule.startTime, schedule.endTime);

      slots.forEach((slot) => {
        if (isFree(slot, validAppointments, schedule.employee.id)) {
          globalSlots.add(slot);
        }
      });
    });

    return Array.from(globalSlots).sort();
  }

  async findAvailableEmployee(avaliableEmployeeDto: AvaliableEmployeeDto) {
    const { date, startTime, idService } = avaliableEmployeeDto;
    const service = await this.serviceService.findOne(idService);

    const endTime = addMinutes(startTime, service.durationMinutes);
    const avaliableEmployee = this.employeesAvalible(
      startTime,
      endTime,
      date,
      date.getDay(),
    );

    return avaliableEmployee;
  }

  async updateScore(id: number, dto: ScoreAppointmentDto, user: User) {
    const { comments, score } = dto;
    const appointment = await this.findOne(id, user);

    appointment.comments = comments;
    appointment.score = score;

    try {
      await this.appointmentRepository.save(appointment);
      return appointment;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: number, dto: UpdateAppointmentDto, user: User) {
    // 1. Obtener la cita actual
    const appointment = await this.findOne(id, null);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException(
        `The appointment ${id} cannot be changed as it has been cancelled`,
      );
    }

    // El cliente NO se puede cambiar
    if (dto.clientId && dto.clientId !== appointment.client.id) {
      throw new BadRequestException(`Client cannot be modified`);
    }

    // 2. Preparar valores actualizados
    const date = toLocalDate(dto.date ?? appointment.date);
    const startTime = dto.startTime ?? appointment.startTime;

    // Validar que la nueva fecha no sea pasada
    validateNotPast(date.toString(), startTime);

    const day = new Date(date).getDay();

    // 3. Valida el estatus de la cita
    if (dto.status && !this.validChangeStatus(appointment.status, dto.status)) {
      throw new BadRequestException(
        `The status ${appointment.status} can't change to ${status}`,
      );
    }

    // 4. Obtener servicio (si cambia)
    let service = appointment.service;

    if (dto.serviceId && dto.serviceId !== appointment.service.id) {
      service = await this.serviceService.findOne(dto.serviceId);

      if (!service.isActive) {
        throw new BadRequestException(
          `Service ${service.name} not available at the moment}`,
        );
      }
    }

    // 5. Calcular nuevo endTime en base al *servicio actual o nuevo*
    const endTime = addMinutes(startTime, service.durationMinutes);

    // 6. Obtener empleado (si cambia o si se envía uno nuevo)
    let employee = appointment.employee;

    if (dto.employeeId && dto.employeeId !== appointment.employee.id) {
      employee = (await this.userService.findOne(dto.employeeId)) as User;
    }

    // 7. Validar horario del empleado
    const within = await this.isWithinSchedule(
      employee,
      startTime,
      endTime,
      day,
    );

    if (!within) {
      throw new BadRequestException(
        `Employee not available for appointment (${startTime} - ${endTime})`,
      );
    }

    // 8. Validar conflictos (IMPORTANTE: ignorar esta misma cita)
    const conflict = await this.appointmentRepository.findOne({
      where: {
        employee: { id: employee.id },
        date: date,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
        id: Not(id), // ← evita chocar consigo misma
      },
    });

    if (conflict) {
      throw new BadRequestException(
        `Employee not available for appointment (${startTime} - ${endTime})`,
      );
    }

    // 9. Actualizar cita
    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.service = service;
    appointment.employee = employee;
    appointment.status = dto.status ?? appointment.status;
    appointment.comments = dto.comments ?? appointment.comments;
    appointment.notes = dto.notes ?? appointment.notes;
    appointment.score = dto.score ?? appointment.score;

    try {
      await this.appointmentRepository.save(appointment);
      return appointment;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async changeStatus(
    id: number,
    changeStatusAppointmentDto: ChangeStatusAppointmentDto,
  ) {
    const { notes, status } = changeStatusAppointmentDto;
    const appointment = await this.findOnePlane(id);

    if (!this.validChangeStatus(appointment.status, status)) {
      throw new BadRequestException(
        `The status ${appointment.status} can't change to ${status}`,
      );
    }

    try {
      appointment.status = status;
      if (notes) {
        appointment.notes += ` ${notes}`;
      }
      await this.appointmentRepository.save(appointment);

      return appointment;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async cancel(id: number, cancelAppointmentDto: CancelAppointmentDto) {
    const { notes } = cancelAppointmentDto;
    const appointment = await this.findOnePlane(id);

    const newStatus = AppointmentStatus.CANCELLED;
    if (!this.validChangeStatus(appointment.status, newStatus)) {
      throw new BadRequestException(
        `The status ${appointment.status} can't change to ${newStatus}`,
      );
    }

    try {
      appointment.status = newStatus;
      appointment.notes += ` ${notes}`;
      await this.appointmentRepository.save(appointment);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findTestimonials(testimonialDto: TestimonialDto) {
    const { limit = 3 } = testimonialDto;

    const testimonials = await this.appointmentRepository.find({
      where: {
        score: MoreThan(3),
        comments: Raw((alias) => `LENGTH(${alias}) > 2`),
      },
      relations: ['client'],
      take: limit,
      order: {
        date: 'DESC',
      },
    });

    if (!testimonials) {
      return [];
    }

    return testimonials.map(({ client, comments, score, id }) => ({
      id,
      name: client.name,
      comments,
      score,
    }));
  }
  private async findOnePlane(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  private validChangeStatus(
    oldStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ) {
    let isValid = false;
    switch (oldStatus) {
      case AppointmentStatus.CANCELLED:
        if (newStatus === AppointmentStatus.CANCELLED) {
          isValid = true;
        }
        break;

      case AppointmentStatus.PENDING:
        isValid = true;
        break;
      case AppointmentStatus.CONFIRMED:
        if (newStatus !== AppointmentStatus.PENDING) {
          isValid = true;
        }
        break;
      case AppointmentStatus.COMPLETED:
        if (newStatus === AppointmentStatus.COMPLETED) {
          isValid = true;
        }
        break;
      default:
        isValid = false;
        break;
    }
    return isValid;
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

  private async isWithinSchedule(
    employee: User,
    startTime: string,
    endTime: string,
    dayOfWeek: number,
  ) {
    if (employee.role !== UserRole.EMPLOYEE) {
      return false;
    }

    const employeeSchedule = await this.employeeScheduleRepository.findOne({
      where: {
        employee: { id: employee.id },
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
    });

    if (!employeeSchedule) {
      return false;
    }

    const empStart = toSeconds(employeeSchedule.startTime);
    const empEnd = toSeconds(employeeSchedule.endTime);

    const appointmentStart = toSeconds(startTime);
    const appointmentEnd = toSeconds(endTime);

    return empStart <= appointmentStart && empEnd >= appointmentEnd;
  }

  private async hasConflicts(
    emp: User,
    date: Date,
    startTime: string,
    endTime: string,
  ) {
    return await this.appointmentRepository.findOne({
      where: {
        employee: { id: emp.id },
        date: date,
        status: Not(AppointmentStatus.CANCELLED),
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
  }

  private async employeeAvalible(
    startTime: string,
    endTime: string,
    date: Date,
    day: number,
  ) {
    const employees = (
      await this.userService.findAll({
        isActive: true,
        role: UserRole.EMPLOYEE,
      })
    ).users;

    for (const emp of employees) {
      if (!(await this.isWithinSchedule(emp, startTime, endTime, day)))
        continue;
      if (await this.hasConflicts(emp, date, startTime, endTime)) continue;

      return emp;
    }

    throw new BadRequestException('No employee is available for that time.');
  }

  private async employeesAvalible(
    startTime: string,
    endTime: string,
    date: Date,
    day: number,
  ) {
    const employees = (
      await this.userService.findAll({
        isActive: true,
        role: UserRole.EMPLOYEE,
      })
    ).users;

    const avaliableEmployees: User[] = [];
    for (const emp of employees) {
      if (!(await this.isWithinSchedule(emp, startTime, endTime, day)))
        continue;
      if (await this.hasConflicts(emp, date, startTime, endTime)) continue;

      avaliableEmployees.push(emp);
    }

    if (avaliableEmployees.length === 0) {
      throw new BadRequestException('No employee is available for that time.');
    }
    return avaliableEmployees;
  }

  private async getAppointmentes(
    paginationDto: PaginationDto,
    idClient: string = '',
    idEmployee: string = '',
  ) {
    const {
      limit = 10,
      offset = 0,
      appointmentStatus = 'all',
      appointmentDate = undefined,
      appointmentId = 0,
    } = paginationDto;

    let where = {} as any;

    if (appointmentStatus !== 'all') {
      where.status = appointmentStatus;
    }
    if (isUUID(idClient)) {
      where.client = {};
      where.client.id = idClient;
    }
    if (isUUID(idEmployee)) {
      where.employee = {};
      where.employee.id = idEmployee;
    }
    if (appointmentDate) {
      where.date = appointmentDate.toISOString().split('T')[0];
    }

    if (appointmentId !== 0) {
      where.id = appointmentId;
    }

    const [appointments, appointmentsCount] =
      await this.appointmentRepository.findAndCount({
        where: where,
        take: limit,
        skip: offset,
        order: { date: 'desc', startTime: 'asc' },
        relations: ['service', 'client', 'employee'],
      });

    return {
      total: appointmentsCount,
      pages: Math.ceil(appointmentsCount / limit),
      appointments: appointments,
    };
  }
}
