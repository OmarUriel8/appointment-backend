import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UserRole } from '@/user/enums/user-role.enum';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationUserDto extends PaginationDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    enum: ['all', ...Object.keys(UserRole)],
  })
  @IsIn(['all', ...Object.keys(UserRole)])
  @IsOptional()
  role?: UserRole | 'all';

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
