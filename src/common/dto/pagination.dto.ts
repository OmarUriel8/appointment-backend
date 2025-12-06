import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { AppointmentStatus } from '../../appointment/enum/appointment-status.enum';
import { Type } from 'class-transformer';
import { ToBoolean } from '../decorators/to-boolean.decorator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number;

  @IsIn(['all', ...Object.keys(UserRole)])
  @IsOptional()
  role?: UserRole | 'all';

  @IsString()
  @IsOptional()
  serviceName?: string;

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsIn(['all', ...Object.keys(AppointmentStatus)])
  @IsOptional()
  appointmentStatus?: AppointmentStatus | 'all';

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  appointmentDate?: Date;
}
