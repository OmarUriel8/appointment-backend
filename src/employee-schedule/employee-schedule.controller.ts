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
import { EmployeeScheduleService } from './employee-schedule.service';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/user/enums/user-role.enum';

@Controller('employee-schedule')
export class EmployeeScheduleController {
  constructor(
    private readonly employeeScheduleService: EmployeeScheduleService,
  ) {}

  @Post(':employeeId')
  @Auth(UserRole.ADMIN)
  create(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Body() createEmployeeScheduleDto: CreateEmployeeScheduleDto[],
  ) {
    return this.employeeScheduleService.create(
      employeeId,
      createEmployeeScheduleDto,
    );
  }

  @Get(':employeeId')
  @Auth(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.employeeScheduleService.findOne(employeeId);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    return this.employeeScheduleService.update(id, updateEmployeeScheduleDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeScheduleService.remove(id);
  }
}
