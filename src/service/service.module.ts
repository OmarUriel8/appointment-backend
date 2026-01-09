import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service, ServiceImage } from './entities';
import { Appointment } from '@/appointment/entities/appointment.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [
    TypeOrmModule.forFeature([Service, ServiceImage, Appointment]),
    AuthModule,
  ],
  exports: [ServiceService],
})
export class ServiceModule {}
