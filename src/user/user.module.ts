import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmployeeSchedule } from '../employee-schedule/entities/employee-schedule.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, EmployeeSchedule, Appointment]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
