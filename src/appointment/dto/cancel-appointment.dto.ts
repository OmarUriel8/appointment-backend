import { IsString, MaxLength, MinLength } from 'class-validator';

export class CancelAppointmentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  notes: string;
}
