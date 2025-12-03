import { Module } from '@nestjs/common';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSchedule } from './entities/employee-schedule.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EmployeeScheduleController],
  providers: [EmployeeScheduleService],
  imports: [TypeOrmModule.forFeature([EmployeeSchedule]), UserModule],
})
export class EmployeeScheduleModule {}
