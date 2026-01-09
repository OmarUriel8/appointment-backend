import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth, GetUser } from '@/auth/decorators';
import { UserRole } from '@/user/enums/user-role.enum';
import { User } from '@/user/entities/user.entity';
import { DashboardDto } from './dto/dashboard.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashbboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  findAll(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findAdmin(dashboardDto);
  }

  @Get('client')
  @Auth(UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  findAllClient(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findClient(dashboardDto, user);
  }

  @Get('employee')
  @Auth(UserRole.EMPLOYEE)
  @ApiBearerAuth('access-token')
  findAllEmployee(@Query() dashboardDto: DashboardDto, @GetUser() user: User) {
    return this.dashboardService.findEmployee(dashboardDto, user);
  }
}
