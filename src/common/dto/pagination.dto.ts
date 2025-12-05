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

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsIn(['all', ...Object.keys(AppointmentStatus)])
  @IsOptional()
  appointmentStatus?: AppointmentStatus | 'all';

  @IsDate()
  @IsOptional()
  appointmentDate?: Date;
}
