import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AppointmentStatus } from '../enum/appointment-status.enum';

export class ChangeStatusAppointmentDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  notes?: string;
}
