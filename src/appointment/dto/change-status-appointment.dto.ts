import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatusAppointmentDto {
  @ApiProperty({
    required: true,
    enum: AppointmentStatus,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  notes?: string;
}
