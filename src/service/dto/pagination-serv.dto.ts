import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class PaginationServDto extends PaginationDto {
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
