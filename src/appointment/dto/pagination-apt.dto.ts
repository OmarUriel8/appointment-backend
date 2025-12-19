import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AppointmentStatus } from '../enum/appointment-status.enum';
import { IsDate, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationAptDto extends PaginationDto {
  @IsIn(['all', ...Object.keys(AppointmentStatus)])
  @IsOptional()
  appointmentStatus?: AppointmentStatus | 'all';

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  appointmentDate?: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  appointmentId?: number;
}
