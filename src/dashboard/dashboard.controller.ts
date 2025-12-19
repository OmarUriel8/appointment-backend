import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/user/enums/user-role.enum';
import { User } from 'src/user/entities/user.entity';
import { DashboardDto } from './dto/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Auth(UserRole.ADMIN)
  findAll(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findAdmin(dashboardDto);
  }

  @Get('client')
  @Auth(UserRole.CLIENT)
  findAllClient(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findClient(dashboardDto, user);
  }

  @Get('employee')
  @Auth(UserRole.EMPLOYEE)
  findAllEmployee(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findEmployee(dashboardDto, user);
  }
}
