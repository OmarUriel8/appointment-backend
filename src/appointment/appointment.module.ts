import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AuthModule } from '../auth/auth.module';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { EmployeeSchedule } from '../employee-schedule/entities/employee-schedule.entity';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    TypeOrmModule.forFeature([Appointment, EmployeeSchedule]),
    AuthModule,
    ServiceModule,
    UserModule,
  ],
})
export class AppointmentModule {}
