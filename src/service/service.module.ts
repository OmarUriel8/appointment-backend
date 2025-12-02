import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service, ServiceImage } from './entities';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [TypeOrmModule.forFeature([Service, ServiceImage])],
})
export class ServiceModule {}
