import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

// Condición para determinar si estamos en producción (prod)
const isProduction = process.env.STAGE === 'prod';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get('DB_PORT')!, 5432),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations:
    process.env.STAGE === 'prod'
      ? ['src/database/migrations-prod/*-migration.ts']
      : ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
  extra: isProduction
    ? {
        ssl: {
          rejectUnauthorized: false, // Necesario si usas un certificado autofirmado
        },
      }
    : {},
});

export default AppDataSource;
