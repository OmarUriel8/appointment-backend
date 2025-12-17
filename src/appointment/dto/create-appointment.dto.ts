import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in format HH:mm',
  })
  startTime: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsUUID()
  serviceId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  employeeId?: string;
}
