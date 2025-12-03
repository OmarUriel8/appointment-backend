import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Appointment } from './entities/appointment.entity';
import { Service } from 'src/service/entities';
import { EmployeeSchedule } from 'src/employee-schedule/entities/employee-schedule.entity';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Service, EmployeeSchedule]),
  ],
})
export class AppointmentModule {}
