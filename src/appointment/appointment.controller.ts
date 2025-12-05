import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ChangeStatusAppointmentDto } from './dto/change-status-appointment.dto';
import { UserRole } from 'src/user/enums/user-role.enum';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get('client/:idClient')
  @Auth(UserRole.ADMIN, UserRole.CLIENT)
  findAllByClientId(
    @Param('idClient', ParseUUIDPipe) idClient: string,
    @Body() paginationDto: PaginationDto,
  ) {
    return this.appointmentService.findAllByClientId(paginationDto, idClient);
  }

  @Get('employee/:idEmployee')
  @Auth(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAllByEmployeeId(
    @Param('idEmployee', ParseUUIDPipe) idEmployee: string,
    @Body() paginationDto: PaginationDto,
  ) {
    return this.appointmentService.findAllByEmployeeId(
      paginationDto,
      idEmployee,
    );
  }

  @Get()
  @Auth(UserRole.ADMIN)
  findAll(@Body() paginationDto: PaginationDto) {
    return this.appointmentService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.findOne(+id, user);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Patch('change-status/:id')
  @Auth(UserRole.ADMIN, UserRole.EMPLOYEE)
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
  calcel(
    @Param('id') id: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancel(+id, cancelAppointmentDto);
  }
}
