import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ToBoolean } from '../../common/decorators/to-boolean.decorator';

export class PaginationServDto extends PaginationDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  serviceName?: string;

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
