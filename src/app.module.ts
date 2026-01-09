import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServiceModule } from './service/service.module';
import { FilesModule } from './files/files.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod' ? true : false,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      autoLoadEntities: true,
      entities: [__dirname + '/database/core/**/*.entity{.ts,.js}'],
      extra: {
        // Esto le dice a PG que use esta zona horaria para formatear los timestamps
        // al devolverlos al driver de Node.js.
        timezone: process.env.APP_TZ ?? 'UTC',
      },
    }),
    ServiceModule,
    FilesModule,
    EmployeeScheduleModule,
    AppointmentModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
