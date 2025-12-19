import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CancelAppointmentDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  notes: string;
}
