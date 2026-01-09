import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '@/appointment/entities/appointment.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [AuthModule, TypeOrmModule.forFeature([Appointment])],
})
export class DashboardModule {}
