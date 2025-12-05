import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceModule } from 'src/service/service.module';
import { EmployeeSchedule } from 'src/employee-schedule/entities/employee-schedule.entity';
import { UserModule } from 'src/user/user.module';

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
