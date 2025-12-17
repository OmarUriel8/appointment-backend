import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class AvaliableScheduleDto {
  @Type(() => Date)
  @IsDate()
  date: Date;
}
