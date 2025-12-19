import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [AuthModule, TypeOrmModule.forFeature([Appointment])],
})
export class DashboardModule {}
