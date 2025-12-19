import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class DashboardDto {
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @Type(() => Date)
  @IsDate()
  startDate: Date;
}
