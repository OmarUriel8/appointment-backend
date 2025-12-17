import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, Matches } from 'class-validator';

export class AvaliableEmployeeDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in format HH:mm',
  })
  startTime: string;

  @IsUUID()
  idService: string;
}
