import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, Matches } from 'class-validator';

export class AvaliableEmployeeDto {
  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in format HH:mm',
  })
  startTime: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  idService: string;
}
