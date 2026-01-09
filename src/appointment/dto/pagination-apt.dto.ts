import { AppointmentStatus } from '../enum/appointment-status.enum';
import { IsDate, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginationAptDto extends PaginationDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    enum: ['all', ...Object.keys(AppointmentStatus)],
  })
  @IsIn(['all', ...Object.keys(AppointmentStatus)])
  @IsOptional()
  appointmentStatus?: AppointmentStatus | 'all';

  @ApiProperty({
    required: false,
    nullable: true,
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  appointmentDate?: Date;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  appointmentId?: number;
}
