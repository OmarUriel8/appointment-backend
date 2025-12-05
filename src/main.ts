import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // ? Configuracion de la zona horaria
  process.env.TZ = process.env.TZ ?? 'UTC';

  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Api running on port ${process.env.PORT}`);
  logger.log(`Zona horaria ${process.env.TZ} ${new Date()}`);
}
bootstrap();
