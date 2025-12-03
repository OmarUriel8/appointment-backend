import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServiceModule } from './service/service.module';
import { FilesModule } from './files/files.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      autoLoadEntities: true,
      entities: [__dirname + '/database/core/**/*.entity{.ts,.js}'],
    }),
    ServiceModule,
    FilesModule,
    EmployeeScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
