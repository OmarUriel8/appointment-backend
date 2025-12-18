import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ScoreAppointmentDto {
  @IsString()
  comments: string;

  @Type(() => Number)
  @IsNumber()
  score: number;
}
