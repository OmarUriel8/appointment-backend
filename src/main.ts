import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
        //enableImplicitConversion: true,
        exposeUnsetFields: true,
      },
    }),
  );

  // ? Se agrega Swagger para documentar
  const config = new DocumentBuilder()
    .setTitle('Appointment REST Full API.')
    .setDescription('Appointment endpoints.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa el token JWT sin "Bearer " al inicio',
        in: 'header',
      },
      'access-token', // ? nombre del esquema
    )
    //.addTag('Prueba')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // ? No genera todo el mapea se deben de configurar controllers y dtos
  SwaggerModule.setup('api', app, documentFactory);

  // SI ES VERCEL: Inicializamos y retornamos la instancia de Express
  if (process.env.VERCEL === '1') {
    await app.init();
    return app.getHttpAdapter().getInstance();
  }

  // SI ES LOCAL: Escuchamos en el puerto normal
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`API running on port ${port}`);
  logger.log(`Zona horaria ${process.env.TZ} ${new Date()}`);
}
//bootstrap();

export default bootstrap();
