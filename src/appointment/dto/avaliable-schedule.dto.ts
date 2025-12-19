import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class AvaliableScheduleDto {
  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  date: Date;
}
