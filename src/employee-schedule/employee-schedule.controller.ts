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

import { CreateEmployeeScheduleDto, UpdateEmployeeScheduleDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../user/enums/user-role.enum';
import { Auth } from '../auth/decorators';

@ApiTags('Employee Schedule')
@Controller('employee-schedule')
export class EmployeeScheduleController {
  constructor(
    private readonly employeeScheduleService: EmployeeScheduleService,
  ) {}

  @Post(':employeeId')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
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
  @ApiBearerAuth('access-token')
  findOne(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.employeeScheduleService.findOne(employeeId);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    return this.employeeScheduleService.update(id, updateEmployeeScheduleDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeScheduleService.remove(id);
  }
}
