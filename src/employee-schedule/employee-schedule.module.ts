import { Module } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSchedule } from './entities/employee-schedule.entity';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [EmployeeScheduleController],
  providers: [EmployeeScheduleService],
  imports: [
    TypeOrmModule.forFeature([EmployeeSchedule]),
    UserModule,
    AuthModule,
  ],
})
export class EmployeeScheduleModule {}
