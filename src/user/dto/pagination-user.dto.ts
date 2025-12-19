import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';

export class PaginationUserDto extends PaginationDto {
  @IsIn(['all', ...Object.keys(UserRole)])
  @IsOptional()
  role?: UserRole | 'all';

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
