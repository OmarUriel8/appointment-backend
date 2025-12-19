import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DashboardDto {
  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;
}
