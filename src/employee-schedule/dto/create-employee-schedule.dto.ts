import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

export class CreateEmployeeScheduleDto {
  @ApiProperty({
    required: true,
    type: Number,
    minimum: 0,
    maximum: 6,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    required: true,
    type: String,
    format: 'time',
    example: '10:01',
    description: 'Time in 24-hour format (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in format HH:mm',
  })
  startTime: string;

  @ApiProperty({
    required: true,
    type: String,
    format: 'time',
    example: '10:01',
    description: 'Time in 24-hour format (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in format HH:mm',
  })
  endTime: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Boolean,
  })
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
