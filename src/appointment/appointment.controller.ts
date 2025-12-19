import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';

import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enums/user-role.enum';
import {
  AvaliableEmployeeDto,
  AvaliableScheduleDto,
  CancelAppointmentDto,
  ChangeStatusAppointmentDto,
  CreateAppointmentDto,
  ScoreAppointmentDto,
  TestimonialDto,
  UpdateAppointmentDto,
  PaginationAptDto,
} from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get('client/:idClient')
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  findAllByClientId(
    @Param('idClient', ParseUUIDPipe) idClient: string,
    @Query() paginationDto: PaginationAptDto,
  ) {
    return this.appointmentService.findAllByClientId(paginationDto, idClient);
  }

  @Get('employee/:idEmployee')
  @Auth(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiBearerAuth('access-token')
  findAllByEmployeeId(
    @Param('idEmployee', ParseUUIDPipe) idEmployee: string,
    @Query() paginationDto: PaginationAptDto,
  ) {
    return this.appointmentService.findAllByEmployeeId(
      paginationDto,
      idEmployee,
    );
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  findAll(@Query() paginationDto: PaginationAptDto) {
    return this.appointmentService.findAll(paginationDto);
  }

  @Get('testimonials')
  findTestimonials(@Query() testimonialDto: TestimonialDto) {
    return this.appointmentService.findTestimonials(testimonialDto);
  }

  @Get('available-hours')
  @Auth()
  @ApiBearerAuth('access-token')
  findAvailableHours(@Query() avaliableScheduleDto: AvaliableScheduleDto) {
    return this.appointmentService.findAvailableHours(avaliableScheduleDto);
  }

  @Get('available-employee')
  @Auth()
  @ApiBearerAuth('access-token')
  findAvailableEmployee(@Query() avaliableEmployeeDto: AvaliableEmployeeDto) {
    return this.appointmentService.findAvailableEmployee(avaliableEmployeeDto);
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.findOne(+id, user);
  }

  @Patch('score/:id')
  @Auth(UserRole.CLIENT, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  updateScore(
    @Param('id') id: string,
    @Body() scoreAppointmentDto: ScoreAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.updateScore(+id, scoreAppointmentDto, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto, user);
  }

  @Patch('change-status/:id')
  @Auth(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusAppointmentDto: ChangeStatusAppointmentDto,
  ) {
    return this.appointmentService.changeStatus(
      +id,
      changeStatusAppointmentDto,
    );
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  calcel(
    @Param('id') id: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancel(+id, cancelAppointmentDto);
  }
}
