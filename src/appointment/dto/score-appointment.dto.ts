import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ScoreAppointmentDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  comments: string;

  @ApiProperty({
    required: true,
    type: Number,
    minimum: 0,
    maximum: 5,
  })
  @Type(() => Number)
  @IsNumber()
  score: number;
}
